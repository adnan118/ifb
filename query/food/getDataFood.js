/*

const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

 const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

/**
 * دالة جلب بيانات الطعام للمستخدم بناءً على حالة الأوفر
 * إذا كان لدى المستخدم أوفر فعال (خصم لا يساوي 0) ولم تنتهِ صلاحيته يتم جلب الطعام المخصص له من user_foods
 * إذا لم يكن لديه أوفر، أو الخصم = 0، أو كانت صلاحية الأوفر منتهية يتم جلب الطعام العام من جدول food
 * @param req - يجب أن يحتوي على user_id دائماً، و food_diettype_id إذا لم يكن هناك أوفر
 */
const getDataFood = async (req, res) => {
  try {
    const { food_diettype_id, user_id } = req.body;
    // تحقق من وجود user_id
    if (!user_id) {
      // إذا لم يوجد user_id استخدم الكود الأصلي
      if (!food_diettype_id) {
        return res.status(400).json({
          status: "failure",
          message: "food_diettype_id is required",
        });
      }
      const result = await getAllData(
        "food",
        "food_diettype_id = ?",
        [food_diettype_id]
      );
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Food fetched successfully",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching food",
        });
      }
      return;
    }
    // --- تعديل المنطق بناءً على حالة الأوفر ---
    // 1. جلب بيانات المستخدم من personaldataregister
    const userDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [user_id]
    );
    if (userDataResult.status !== "success" || !userDataResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found",
      });
    }
    const userData = userDataResult.data;
    const offers_id = userData.personalData_offers_id;
    const personalData_expOffer = userData.personalData_expOffer; // تاريخ انتهاء صلاحية الأوفر (إن وجد)
    const user_food_diettype_id = userData.personalData_dietType_id;

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
    if (offers_discount && offers_discount !== 0 && !isOfferExpired) {
      // --- المستخدم لديه أوفر فعال وغير منتهي ---
      // نجلب الطعام المخصص له من جدول user_foods
      const connection = await getConnection();
      try {
        const [userFoods] = await connection.execute(
          "SELECT uf.*, f.* FROM user_foods uf JOIN food f ON uf.food_id = f.food_id WHERE uf.user_id = ?",
          [user_id]
        );
        await connection.end();
        
        if (userFoods.length > 0) {
          res.status(200).json({
            status: "success",
            message: "User foods fetched successfully (خصم فعال)",
            data: userFoods,
          });
        } else {
          res.status(404).json({
            status: "failure",
            message: "No user foods found for this user",
          });
        }
      } catch (error) {
        await connection.end();
        console.error("Error in user_foods query:", error);
        res.status(500).json({
          status: "failure",
          message: "Error fetching user foods",
          error: error.message,
        });
      }
    } else {
      // --- لا يوجد أوفر، أو الخصم = 0، أو الأوفر منتهي الصلاحية ---
      // استخدم personalData_dietType_id من بيانات المستخدم
      if (!user_food_diettype_id) {
        return res.status(400).json({
          status: "failure",
          message: "personalData_dietType_id is required in user data",
        });
      }
      
      // جلب الطعام العام من جدول food
      const result = await getAllData(
        "food",
        "food_diettype_id = ?",
        [user_food_diettype_id]
      );
      
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Food fetched successfully (بدون خصم)",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching food",
        });
      }
    }
  } catch (error) {
    // معالجة أي خطأ غير متوقع
    console.error("Error in getDataFood:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataFood,
};
const getDataFood = async (req, res) => {
  try {
    const { food_diettype_id, user_id } = req.body;
    // تحقق من وجود user_id
    if (!user_id) {
      // إذا لم يوجد user_id استخدم الكود الأصلي
      if (!food_diettype_id) {
        return res.status(400).json({
          status: "failure",
          message: "food_diettype_id is required",
        });
      }
      const result = await getAllData(
        "food",
        "food_diettype_id = ?",
        [food_diettype_id]
      );
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Food fetched successfully",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching food",
        });
      }
      return;
    }
    // --- تعديل المنطق بناءً على حالة الأوفر ---
    // 1. جلب بيانات المستخدم من personaldataregister
    const userDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [user_id]
    );
    if (userDataResult.status !== "success" || !userDataResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found",
      });
    }
    const userData = userDataResult.data;
    const offers_id = userData.personalData_offers_id;
    const user_food_diettype_id = userData.personalData_dietType_id;
    // 2. جلب بيانات الأوفر
    let offers_discount = 0;
    if (offers_id) {
      const offerResult = await getData(
        "offers",
        "offers_id = ?",
        [offers_id]
      );
      if (offerResult.status === "success" && offerResult.data) {
        offers_discount = offerResult.data.offers_discount || 0;
      }
    }
    // 3. منطق جلب الطعام
    if (!offers_discount || offers_discount === 0) {
      // --- الأوفر مجاني أو الخصم = 0 ---
      if (!user_food_diettype_id) {
        return res.status(400).json({
          status: "failure",
          message: "food_diettype_id is required in user data",
        });
      }
      const result = await getAllData(
        "food",
        "food_diettype_id = ?",
        [user_food_diettype_id]
      );
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Food fetched successfully (خصم مجاني)",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching food",
        });
      }
      return;
    } else {
      // --- الأوفر غير مجاني (خصم > 0) ---
      // جلب بيانات user_foods مع JOIN على food
      const connection = await getConnection();
      const [userFoods] = await connection.execute(
        "SELECT uf.*, f.* FROM user_foods uf JOIN food f ON uf.food_id = f.food_id WHERE uf.user_id = ?",
        [user_id]
      );
      await connection.end();
      if (userFoods.length > 0) {
        res.status(200).json({
          status: "success",
          message: "User foods fetched successfully (خصم فعال)",
          data: userFoods,
        });
      } else {
        res.status(404).json({
          status: "failure",
          message: "No user foods found for this user",
        });
      }
      return;
    }
  } catch (error) {
    console.error("Error in getData food:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataFood,
};

*/

