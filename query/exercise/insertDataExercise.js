const {
  insertData,
  createMulterConfig
} = require("../../controllers/functions");

// دالة لرفع الصور والفيديو
const uploadFiles = (req, res, next) => {
  // إنشاء تكوين multer
  const multerConfig = createMulterConfig("query/exercise/exerciseFiles", true);

  // تنفيذ رفع الملفات
  const upload = multerConfig.fields([
    { name: "exercise_img", maxCount: 1 },
    { name: "exercise_video", maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      let msg = "حدث خطأ في الرفع";
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        msg = `اسم الحقل غير متوقع: ${err.field}`;
      } else if (err.message === "EXT") {
        msg = "ملف غير مسموح به";
      } else if (err.code === "LIMIT_FILE_SIZE") {
        msg = "حجم الملف كبير جداً";
      }
      return res.status(400).json({ error: msg });
    }
    next();
  });
};

// دالة لادخال بيانات التمرين
async function insertDataExercise(req, res) {
  try {
    const exercise_img_file = req.files["exercise_img"]
      ? req.files["exercise_img"][0]
      : null;
    
    const exercise_video_file = req.files["exercise_video"]
      ? req.files["exercise_video"][0]
      : null;

    const {
      exercise_idTraining,
      exercise_nameEn,
      exercise_nameAr,
      exercise_equipment,
      exercise_duration,
      exercise_Kcal,
      exercise_musclesTargeted,
      exercise_stepHowDoing,
      commonMistakes,
      tips
    } = req.body;

    // تحديد مسارات الصور والفيديو بناءً على الملفات المرفوعة
    const exercise_img_path = exercise_img_file
      ? exercise_img_file.filename
      : req.body.exercise_img || "img.png";

    const exercise_video_path = exercise_video_file
      ? exercise_video_file.filename
      : req.body.exercise_video || null;

    // إدخال البيانات في قاعدة البيانات
    const insertExerciseData = {
      exercise_idTraining,
      exercise_nameEn,
      exercise_nameAr,
      exercise_equipment,
      exercise_duration,
      exercise_Kcal,
      exercise_img: exercise_img_path,
      exercise_video: exercise_video_path,
      exercise_musclesTargeted,
      exercise_stepHowDoing,
      commonMistakes,
      tips
    };

    const result = await insertData("exercise", insertExerciseData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Exercise data inserted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert exercise data.",
      });
    }
  } catch (error) {
    console.error("Error inserting exercise data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting exercise data",
    });
  }
}

// تصدير الدالة
module.exports = { insertDataExercise, uploadFiles }; 