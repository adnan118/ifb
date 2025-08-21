const { insertData } = require("../../controllers/functions");

async function insertDataUserFood(req, res) {
  try {
    const { user_id, food_id, daysOfWeek_id } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!user_id || !food_id || !daysOfWeek_id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields: user_id, food_id, daysOfWeek_id",
      });
    }

    // إعداد بيانات الإدخال
    const insertUserFoodData = {
      user_id: user_id,
      food_id: food_id,
      daysOfWeek_id: daysOfWeek_id,
      assigned_at: new Date(), // الوقت الحالي
    };

    const result = await insertData("user_foods", insertUserFoodData);

    if (result.status === "success") {
      res.status(201).json({
        status: "success",
        message: "User food assigned successfully.",
        data: {
          id: result.insertId,
          ...insertUserFoodData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to assign user food.",
      });
    }
  } catch (error) {
    console.error("Error inserting user food data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem assigning user food",
      error: error.message,
    });
  }
}

module.exports = { insertDataUserFood };