const {
  deleteData,
  handleImageDeletion,
  getData
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/trainings/trainingImages/images", // مسار الصور
  "trainings", // اسم الجدول
  "trainings_id", // حقل المعرف
  "trainings_img" // حقل صورة
);

// دالة لحذف بيانات التدريب
async function deleteDataTraining(req, res) {
  try {
    const { trainings_id } = req.body;
    
    // الحصول على معلومات التدريب قبل حذفه
    const trainingData = await getData("trainings", "trainings_id = ?", [trainings_id]);
    
    if (trainingData.status === "success" && trainingData.data) {
      // حذف الصورة إذا كانت موجودة
      if (trainingData.data.trainings_img && trainingData.data.trainings_img !== "img.png") {
        const imagePath = path.join(
          process.cwd(),
          "query/trainings/trainingImages/images",
          trainingData.data.trainings_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
   
    const result = await deleteData("trainings", "trainings_id = ?", [trainings_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training and associated images deleted successfully.",
        trainings_id: trainings_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Training not found or no changes made.",
      });
    }

  } catch (error) {
    console.error("Error deleting training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting training data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataTraining, deleteImages };