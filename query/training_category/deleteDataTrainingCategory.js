const {
  deleteData,
  handleImageDeletion,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/training_category/trainingCategoryImages/images",  // مسار الصور
  "training_category", // اسم الجدول
  "training_category_id", // حقل المعرف
  "training_category_img" // حقل الصورة
);

// دالة لحذف بيانات التصنيف
async function deleteDataTrainingCategory(req, res) {
  try {
    const { training_category_id } = req.body;

    // الحصول على معلومات التصنيف قبل حذفه
    const categoryData = await getData(
      "training_category",
      "training_category_id = ?",
      [training_category_id]
    );

    if (categoryData.status === "success" && categoryData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        categoryData.data.training_category_img &&
        categoryData.data.training_category_img !== "img.png"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/training_category/trainingCategoryImages/images",  
          categoryData.data.training_category_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData(
      "training_category",
      "training_category_id = ?",
      [training_category_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training category and associated image deleted successfully.",
        training_category_id: training_category_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Training category not found or no changes made.",
      });
    }
  } catch (error) {
    console.error("Error deleting training category: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting training category.",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataTrainingCategory, deleteImages };
