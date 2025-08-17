 const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

/**
 * دالة جلب التمارين للمستخدم بناءً على حالة الأوفر
 * إذا كان لدى المستخدم أوفر فعال (خصم لا يساوي 0) ولم تنتهِ صلاحيته يتم جلب التمارين المخصصة له من user_trainings
 * إذا لم يكن لديه أوفر، أو الخصم = 0، أو كانت صلاحية الأوفر منتهية يتم جلب التمارين العامة من جدول trainings
 * @param req - يجب أن يحتوي على personalData_users_id دائماً، و training_activities_id إذا لم يكن هناك أوفر
 */
const getDataTraining = async (req, res) => {
  try {
    const { training_activities_id, trainings_id, personalData_users_id } = req.body;

    // تحقق من وجود معرف المستخدم (أساسي في كل الحالات)
    if (!personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "personalData_users_id is required",
      });
    }

    // 1. جلب بيانات المستخدم من جدول personaldataregister
    // الهدف: معرفة رقم الأوفر والبيانات المرتبطة به للمستخدم
    const userDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id]
    );
    if (userDataResult.status !== "success" || !userDataResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found",
      });
    }

    const offers_id = userDataResult.data.personalData_offers_id;
    const personalData_expOffer = userDataResult.data.personalData_expOffer; // تاريخ انتهاء صلاحية الأوفر (إن وجد)

    // 2. جلب بيانات الأوفر من جدول offers لمعرفة قيمة الخصم
    let offers_discount = 0;
    if (offers_id) {
      const offerResult = await getData("offers", "offers_id = ?", [offers_id]);
      if (offerResult.status === "success" && offerResult.data) {
        offers_discount = offerResult.data.offers_discount || 0;
      }
    }

    // 2.1 التحقق من انتهاء صلاحية الأوفر من personalData_expOffer
    let isOfferExpired = false;
    if (personalData_expOffer) {
      const expDate = new Date(personalData_expOffer);
      if (!isNaN(expDate.getTime())) {
        isOfferExpired = Date.now() > expDate.getTime();
      }
    }

    // 3. تحديد منطق الجلب بناءً على حالة الأوفر وصلاحيته
    //offers_id = 2 ->  Training & Diet
    //offers_id = 3 ->  Training 
     if (offers_discount && offers_discount !== 0 && !isOfferExpired && (offers_id === 2 || offers_id === 3)) {

      // --- المستخدم لديه أوفر فعال وغير منتهي ---
      // نجلب التمارين المخصصة له من جدول user_trainings
      // نتجاهل شرط training_activities_id (أي نجلب كل التمارين المخصصة له)
      let sql = `SELECT ut.*, t.* FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.trainings_id
        WHERE ut.user_id = ?`;
      let values = [personalData_users_id];
      // إذا تم إرسال trainings_id (مصفوفة)، أضف شرط IN
      if (
        trainings_id &&
        Array.isArray(trainings_id) &&
        trainings_id.length > 0 &&
        !trainings_id.includes(0)
      ) {
        const inClause = trainings_id.map(() => "?").join(",");
        sql += ` AND ut.training_id IN (${inClause})`;
        values.push(...trainings_id);
      }
      // تنفيذ الاستعلام مباشرة باستخدام mysql2
      const connection = await getConnection();
      try {
        const [results] = await connection.execute(sql, values);
        await connection.end();
        // إرجاع النتائج للمستخدم
        res.status(200).json({
          status: "success",
          message: "User trainings fetched successfully (خصم فعال)",
          data: results,
        });
      } catch (error) {
        await connection.end();
        console.error("Error in user_trainings query:", error);
        res.status(500).json({
          status: "failure",
          message: "Error fetching user trainings",
          error: error.message,
        });
      }
    } else {
      // --- لا يوجد أوفر، أو الخصم = 0، أو الأوفر منتهي الصلاحية ---
      // استخدم personalData_activities_id من بيانات المستخدم
      const activities_id = userDataResult.data.personalData_activities_id;
      if (!activities_id) {
        return res.status(400).json({
          status: "failure",
          message: "personalData_activities_id is required in user data",
        });
      }
      // بناء شرط الجلب من جدول trainings
      let whereClause = "training_activities_id = ?";
      const values = [activities_id];
      let trainingsArray = [];
      // دعم فلترة trainings_id إذا أرسلت
      if (trainings_id !== undefined) {
        if (!Array.isArray(trainings_id)) {
          trainingsArray = [trainings_id];
        } else {
          trainingsArray = trainings_id;
        }
        if (trainingsArray.includes(0)) {
          // لا نضيف شرط trainings_id
        } else if (trainingsArray.length > 0) {
          whereClause +=
            " AND trainings_id IN (" + trainingsArray.map(() => "?").join(",") + ")";
          values.push(...trainingsArray);
        }
      }
      // جلب التمارين العامة
      const result = await getAllData("trainings", whereClause, values);
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Trainings fetched successfully (بدون خصم)",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching trainings",
        });
      }
    }
  } catch (error) {
    // معالجة أي خطأ غير متوقع
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// تصدير الدالة للاستخدام في المسارات
module.exports = {
  getDataTraining,
};





/*
const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

 
const getDataTraining = async (req, res) => {
  try {
    const { training_activities_id, trainings_id, personalData_users_id } = req.body;

    // تحقق من وجود معرف المستخدم (أساسي في كل الحالات)
    if (!personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "personalData_users_id is required",
      });
    }

    // 1. جلب بيانات المستخدم من جدول personaldataregister
    // الهدف: معرفة رقم الأوفر المرتبط بالمستخدم
    const userDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id]
    );
    if (userDataResult.status !== "success" || !userDataResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found",
      });
    }
    const offers_id = userDataResult.data.personalData_offers_id;

    // 2. جلب بيانات الأوفر من جدول offers
    // الهدف: معرفة قيمة الخصم (offers_discount) لهذا الأوفر
    let offers_discount = 0;
    if (offers_id) {
      const offerResult = await getData("offers", "offers_id = ?", [offers_id]);
      if (offerResult.status === "success" && offerResult.data) {
        offers_discount = offerResult.data.offers_discount || 0;
      }
    }

    // 3. تحديد منطق الجلب بناءً على حالة الأوفر
    if (offers_discount && offers_discount !== 0) {
      // --- المستخدم لديه أوفر فعال ---
      // نجلب التمارين المخصصة له من جدول user_trainings
      // نتجاهل شرط training_activities_id (أي نجلب كل التمارين المخصصة له)
      let sql = `SELECT ut.*, t.* FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.trainings_id
        WHERE ut.user_id = ?`;
      let values = [personalData_users_id];
      // إذا تم إرسال trainings_id (مصفوفة)، أضف شرط IN
      if (trainings_id && Array.isArray(trainings_id) && trainings_id.length > 0 && !trainings_id.includes(0)) {
        const inClause = trainings_id.map(() => "?").join(",");
        sql += ` AND ut.training_id IN (${inClause})`;
        values.push(...trainings_id);
      }
      // تنفيذ الاستعلام مباشرة باستخدام mysql2
      const connection = await getConnection();
      try {
        const [results] = await connection.execute(sql, values);
        await connection.end();
        // إرجاع النتائج للمستخدم
        res.status(200).json({
          status: "success",
          message: "User trainings fetched successfully (خصم فعال)",
          data: results,
        });
      } catch (error) {
        await connection.end();
        console.error("Error in user_trainings query:", error);
        res.status(500).json({
          status: "failure",
          message: "Error fetching user trainings",
          error: error.message,
        });
      }
    } else {
      // --- لا يوجد أوفر أو الخصم = 0 ---
      // استخدم personalData_activities_id من بيانات المستخدم
      const activities_id = userDataResult.data.personalData_activities_id;
      if (!activities_id) {
        return res.status(400).json({
          status: "failure",
          message: "personalData_activities_id is required in user data",
        });
      }
      // بناء شرط الجلب من جدول trainings
      let whereClause = "training_activities_id = ?";
      const values = [activities_id];
      let trainingsArray = [];
      // دعم فلترة trainings_id إذا أرسلت
      if (trainings_id !== undefined) {
        if (!Array.isArray(trainings_id)) {
          trainingsArray = [trainings_id];
        } else {
          trainingsArray = trainings_id;
        }
        if (trainingsArray.includes(0)) {
          // لا نضيف شرط trainings_id
        } else if (trainingsArray.length > 0) {
          whereClause +=
            " AND trainings_id IN (" +
            trainingsArray.map(() => "?").join(",") +
            ")";
          values.push(...trainingsArray);
        }
      }
      // جلب التمارين العامة
      const result = await getAllData("trainings", whereClause, values);
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Trainings fetched successfully (بدون خصم)",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching trainings",
        });
      }
    }
  } catch (error) {
    // معالجة أي خطأ غير متوقع
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// تصدير الدالة للاستخدام في المسارات
module.exports = {
  getDataTraining,
};*/




