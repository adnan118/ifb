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
const { getAllData } = require("../../controllers/functions");
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
    // تحقق هل يوجد بيانات للمستخدم في user_foods
    const connection = await getConnection();
    const [userFoods] = await connection.execute(
      "SELECT uf.*, f.* FROM user_foods uf JOIN food f ON uf.food_id = f.food_id WHERE uf.user_id = ?",
      [user_id]
    );
    if (userFoods.length > 0) {
      await connection.end();
      // إذا وجد بيانات للمستخدم، أرجعها
      res.status(200).json({
        status: "success",
        message: "User foods fetched successfully",
        data: userFoods,
      });
      return;
    } else {
      // إذا لم يوجد بيانات للمستخدم، استخدم الكود الأصلي
      if (!food_diettype_id) {
        await connection.end();
        return res.status(400).json({
          status: "failure",
          message: "food_diettype_id is required",
        });
      }
      const [foods] = await connection.execute(
        "SELECT * FROM food WHERE food_diettype_id = ?",
        [food_diettype_id]
      );
      await connection.end();
      res.status(200).json({
        status: "success",
        message: "Food fetched successfully",
        data: foods,
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
};
