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
  "query/training_category/trainingCategoryImages/images", // مسار رفع الصور
  [{ name: "training_category_img", maxCount: 1 }] // حقل الصورة
);
 

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/training_category/trainingCategoryImages/images", // مسار الصور
  "training_category", // اسم الجدول
  "training_category_id", // حقل المعرف
  "training_category_img" // حقل الصورة
);

async function updateDataTrainingCategory(req, res) {
  try {
    const training_img_file = req.files["training_category_img"]
      ? req.files["training_category_img"][0]
      : null;

    const {
      training_category_id,
      training_category_idTraining,
      training_category_nameEn,
      training_category_nameAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldTrainingData = await getData(
      "training_category",
      "training_category_id = ?",
      [training_category_id]
    );

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_training_img =
      oldTrainingData &&
      oldTrainingData.status === "success" &&
      oldTrainingData.data
        ? oldTrainingData.data.training_category_img
        : null;

    let training_category_img_path = old_training_img || "img.png"; // الافتراضي

    if (training_img_file) {
      const newFileName = training_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_training_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_training_img && old_training_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/training_category/trainingCategoryImages/images",
            old_training_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        training_category_img_path = newFileName;
      }
    }

    const updateTrainingCategoryData = {
      training_category_idTraining,
      training_category_nameEn,
      training_category_nameAr,
      training_category_img: training_category_img_path,
    };

    const result = await updateData(
      "training_category",
      updateTrainingCategoryData,
      "training_category_id = ?",
      [training_category_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training category updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update training category.",
      });
    }
  } catch (error) {
    console.error("Error updating training category: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating training category.",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataTrainingCategory };
