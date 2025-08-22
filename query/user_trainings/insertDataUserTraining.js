
const { insertData } = require("../../controllers/functions");

// دالة لتنسيق التاريخ ليتوافق مع MySQL
function formatDateToMySQL(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
async function insertDataUserTraining(req, res) {
  try {
    const { user_id, training_id, daysOfWeek_id } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!user_id || !training_id || !daysOfWeek_id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields: user_id, training_id, daysOfWeek_id",
      });
    }

    // إعداد بيانات الإدخال
    const insertUserTrainingData = {
      user_id: user_id,
      training_id: training_id,
      daysOfWeek_id: daysOfWeek_id,
      active:  1, // افتراضي 1 (نشط)
  assigned_at: formatDateToMySQL(new Date()), // الوقت الحالي
    };

    const result = await insertData("user_trainings", insertUserTrainingData);

     if (result.status === "success") {
        res.status(201).json({
          status: "success",
          message: "User training assigned successfully.",
          data: insertUserTrainingData,  
        });
      } else {
      res.status(500).json({
         status: "failure",
         message: "Failed to assign user training.",
         dbError: result.message 
      });
    }
  } catch (error) {/*
    console.error("Error inserting user training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem assigning user training",
      error: error.message,
    });*/
      console.error("Database query error: ", error);
  await connection.end();
  return { status: "failure", message: error.message }; // 👈 رجّع رسالة الخطأ الحقيقية

  }
}


module.exports = { insertDataUserTraining };








