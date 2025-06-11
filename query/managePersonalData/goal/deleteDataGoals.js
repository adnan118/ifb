const {
  deleteData,
  handleImageDeletion,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/managePersonalData/goal/goalImages/images", // مسار الصور
  "goals", // اسم الجدول
  "goal_id", // حقل المعرف
  "goal_img" // حقل صورة
);

// دالة لادخال بيانات التسجيل  
async function deleteDataGoals(req, res) {
  try {
    const { goal_id } = req.body;
    
    // الحصول على معلومات الهدف قبل حذفه
    const goalData = await getData("goals", "goal_id = ?", [goal_id]);
    
    if (goalData.status === "success" && goalData.data) {
      // حذف الصورة إذا كانت موجودة
      if (goalData.data.goal_img && goalData.data.goal_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/goal/goalImages/images",
          goalData.data.goal_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
   
    const result = await deleteData("goals", "goal_id = ?", [goal_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "goal and associated images deleted successfully.",
        goal_id: goal_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "goal not found or no changes made.",
      });
    }

  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataGoals, deleteImages };