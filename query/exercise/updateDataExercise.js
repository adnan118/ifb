const {
  updateData,
  createMulterConfig,
  getData
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

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

// دالة لتحديث بيانات التمرين
async function updateDataExercise(req, res) {
  try {
    const exercise_img_file = req.files["exercise_img"]
      ? req.files["exercise_img"][0]
      : null;
    
    const exercise_video_file = req.files["exercise_video"]
      ? req.files["exercise_video"][0]
      : null;

    const {
      exercise_id,
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

    // استعلام للحصول على البيانات القديمة
    const oldExerciseData = await getData("exercise", "exercise_id = ?", [exercise_id]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_exercise_img = oldExerciseData && oldExerciseData.status === "success" && oldExerciseData.data
      ? oldExerciseData.data.exercise_img
      : null;

    const old_exercise_video = oldExerciseData && oldExerciseData.status === "success" && oldExerciseData.data
      ? oldExerciseData.data.exercise_video
      : null;

    let exercise_img_path = old_exercise_img || "img.png";
    let exercise_video_path = old_exercise_video || null;

    // معالجة الصورة الجديدة
    if (exercise_img_file) {
      const newFileName = exercise_img_file.filename;
      if (newFileName !== old_exercise_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_exercise_img && old_exercise_img !== "img.png") {
          const oldImagePath = path.join(process.cwd(), "query/exercise/exerciseFiles/images", old_exercise_img);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        exercise_img_path = newFileName;
      }
    }

    // معالجة الفيديو الجديد
    if (exercise_video_file) {
      const newFileName = exercise_video_file.filename;
      if (newFileName !== old_exercise_video) {
        // حذف الفيديو القديم إن وجد
        if (old_exercise_video) {
          const oldVideoPath = path.join(process.cwd(), "query/exercise/exerciseFiles/videos", old_exercise_video);
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
          }
        }
        exercise_video_path = newFileName;
      }
    }

    // تحديث البيانات في قاعدة البيانات
    const updateExerciseData = {
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

    const result = await updateData(
      "exercise",
      updateExerciseData,
      "exercise_id = ?",
      [exercise_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Exercise data updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update exercise data.",
      });
    }
  } catch (error) {
    console.error("Error updating exercise data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating exercise data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataExercise, uploadFiles }; 