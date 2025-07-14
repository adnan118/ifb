/*const { getAllData } = require("../../controllers/functions");

const getDataFood = async (req, res) => {
  try {
    const { food_diettype_id } = req.body; // أو req.params حسب طريقة الاستلام
    if (!food_diettype_id) {
      return res.status(400).json({
        status: "failure",
        message: "food_diettype_id is required",
      });
    }

    const result = await getAllData(
      "food",
      "food_diettype_id = ?", // شرط where
      [food_diettype_id] // القيم المعطاة للشرط
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
};*/
const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

/**
 * دالة جلب بيانات الطعام للمستخدم
 * إذا كان للمستخدم بيانات في user_foods يتم جلبها مع بيانات الطعام (JOIN)
 * إذا لم يوجد، يتم جلب الطعام حسب نوع الدايت كما في الكود الأصلي
 * @param req - يجب أن يحتوي على user_id و/أو food_diettype_id
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
    const user_food_diettype_id = userData.food_diettype_id;
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
