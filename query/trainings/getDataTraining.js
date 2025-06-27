/*const { getAllData } = require("../../controllers/functions");

const getDataTraining = async (req, res) => {
  try {
    const { training_activities_id, trainings_id } = req.body;

    if (!training_activities_id) {
      return res.status(400).json({
        status: "failure",
        message: "training_activities_id is required",
      });
    }

    let whereClause = "training_activities_id = ?";
    const values = [training_activities_id];

    // التعامل مع trainings_id كمصفوفة
    let trainingsArray = [];

    if (trainings_id !== undefined) {
      // إذا كانت غير مصفوفة، حاول تحويلها لمصفوفة
      if (!Array.isArray(trainings_id)) {
        // إذا كانت رقم أو سلسلة، حولها لمصفوفة
        trainingsArray = [trainings_id];
      } else {
        trainingsArray = trainings_id;
      }

      // إذا كانت المصفوفة تحتوي على 0، تجاهل الشرط
      if (trainingsArray.includes(0)) {
        // لا نضيف شرط trainings_id
      } else if (trainingsArray.length > 0) {
        // بناء شرط IN
        whereClause +=
          " AND trainings_id IN (" +
          trainingsArray.map(() => "?").join(",") +
          ")";
        values.push(...trainingsArray);
      }
      // إذا كانت المصفوفة فارغة، لا نضيف شرط
    }

    const result = await getAllData("trainings", whereClause, values);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Trainings fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching trainings",
      });
    }
  } catch (error) {
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataTraining,
};
*/
const { getAllData, getData } = require("../../controllers/functions");

const getDataTraining = async (req, res) => {
  try {
    const { training_activities_id, trainings_id, personalData_users_id } = req.body;

    if (!training_activities_id || !personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "training_activities_id and personalData_users_id are required",
      });
    }

    // 1. جلب بيانات المستخدم من personaldataregister
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

    // 2. جلب بيانات الأوفر من offers
    let offers_discount = 0;
    if (offers_id) {
      const offerResult = await getData("offers", "offers_id = ?", [offers_id]);
      if (offerResult.status === "success" && offerResult.data) {
        offers_discount = offerResult.data.offers_discount || 0;
      }
    }

    // 3. بناء الاستعلام بناءً على قيمة الأوفر
    if (offers_discount && offers_discount !== 0) {
      // جلب من user_trainings
      let sql = `SELECT ut.*, t.* FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.trainings_id
        WHERE ut.user_id = ? AND t.training_activities_id = ?`;
      let values = [personalData_users_id, training_activities_id];
      // دعم فلترة trainings_id إذا أرسلت
      if (trainings_id && Array.isArray(trainings_id) && trainings_id.length > 0 && !trainings_id.includes(0)) {
        const inClause = trainings_id.map(() => "?").join(",");
        sql += ` AND ut.training_id IN (${inClause})`;
        values.push(...trainings_id);
      }
      const result = await getAllData(null, sql, values, true);
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "User trainings fetched successfully",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: result.message || "Error fetching user trainings",
        });
      }
    } else {
      // جلب من trainings (الكود القديم)
      let whereClause = "training_activities_id = ?";
      const values = [training_activities_id];
      let trainingsArray = [];
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
      const result = await getAllData("trainings", whereClause, values);
      if (result.status === "success") {
        res.status(200).json({
          status: "success",
          message: "Trainings fetched successfully",
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
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataTraining,
};
