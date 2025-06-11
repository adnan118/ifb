const {
  insertData,
  handleImageUpload} =  require("../../controllers/functions");

// دالة لرفع الصور    
const uploadImages = handleImageUpload(
  "query/trainings/trainingImages",
  [{ name: "trainings_img", maxCount: 1 }]
);

// دالة لادخال بيانات التدريب
async function insertDataTraining(req, res) {
  try {
    const training_img_file = req.files["trainings_img"]
      ? req.files["trainings_img"][0]
      : null;

    const { trainings_nameEn, trainings_nameAr } = req.body;

    // تحديد مسارات الصور بناءً على الملفات المرفوعة
    const trainings_img_path = training_img_file
      ? training_img_file.filename
      : req.body.trainings_img || "img.png";

    // إدخال البيانات في قاعدة البيانات
    const insertTrainingData = {
      trainings_nameEn: trainings_nameEn,
      trainings_nameAr: trainings_nameAr,
      trainings_img: trainings_img_path,
    };

    const result = await insertData("trainings", insertTrainingData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training data inserted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert training data.",
      });
    }
  } catch (error) {
    console.error("Error inserting training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting training data",
    });
  }
}

// تصدير الدالة
module.exports = { insertDataTraining, uploadImages };