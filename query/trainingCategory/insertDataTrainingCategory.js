const {
  insertData,
  handleImageUpload,
} = require("../../controllers/functions");

// دالة لرفع الصور (إذا كنت تحتاج لذلك)
const uploadImages = handleImageUpload(
  "query/training_category/images", // مسار حفظ الصور (يمكنك تعديله)
  [{ name: "training_category_img", maxCount: 1 }] // اسم حقل الصورة
);

// دالة لإضافة بيانات لفئة التدريب
async function insertDataTrainingCategory(req, res) {
  try {
    const training_img_file = req.files["training_category_img"]
      ? req.files["training_category_img"][0]
      : null;

    const {
       
      training_category_idTraining,
      training_category_nameEn,
      training_category_nameAr,
    } = req.body;

    // تحديد مسار الصورة
    const training_category_img_path = training_img_file
      ? training_img_file.filename
      : req.body.training_category_img || "img.png";

    // إعداد البيانات لإدخالها
    const insertTrainingCategoryData = {
    
      training_category_idTraining: training_category_idTraining,
      training_category_nameEn: training_category_nameEn,
      training_category_nameAr: training_category_nameAr,
      training_category_img: training_category_img_path,
    };

    // إدخال البيانات إلى قاعدة البيانات
    const result = await insertData(
      "training_category",
      insertTrainingCategoryData
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training category inserted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert training category.",
      });
    }
  } catch (error) {
    console.error("Error inserting training category: ", error);
    res.status(500).json({
      status: "failure",
      message: "There was a problem inserting training category",
    });
  }
}

// تصدير الدالة
module.exports = { insertDataTrainingCategory, uploadImages };
