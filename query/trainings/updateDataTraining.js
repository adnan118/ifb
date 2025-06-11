const {
  updateData,
  handleImageUpload,
  handleImageDeletion,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/trainings/trainingImages/images",
  [{ name: "trainings_img", maxCount: 1 }]
);
 
// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/trainings/trainingImages/images", // مسار الصور
  "trainings", // اسم الجدول
  "trainings_id", // حقل المعرف
  "trainings_img" // حقل صورة
);
 
async function updateDataTraining(req, res) {
  try {
    const training_img_file = req.files["trainings_img"]
      ? req.files["trainings_img"][0]
      : null;

    const {
      trainings_id,
      trainings_nameEn,
      trainings_nameAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldTrainingData = await getData("trainings", "trainings_id = ?", [trainings_id]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_training_img =
      oldTrainingData && oldTrainingData.status === "success" && oldTrainingData.data
        ? oldTrainingData.data.trainings_img
        : null;
    
    let trainings_img_path = old_training_img || "img.png"; // الافتراضي

    if (training_img_file) {
      const newFileName = training_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_training_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_training_img && old_training_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/trainings/trainingImages/images",
            old_training_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        trainings_img_path = newFileName;
      }
    }

    const updateTrainingData = {
      trainings_nameEn,
      trainings_nameAr,
      trainings_img: trainings_img_path,
    };

    const result = await updateData("trainings", updateTrainingData, "trainings_id = ?", [
      trainings_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training data updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update training data.",
      });
    }
  } catch (error) {
    console.error("Error updating training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating training data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataTraining };
  