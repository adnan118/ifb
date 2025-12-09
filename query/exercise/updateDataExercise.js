/*const {
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
      let statusCode = 400;
      
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        msg = `اسم الحقل غير متوقع: ${err.field}`;
      } else if (err.message === "EXT") {
        msg = "ملف غير مسموح به";
      } else if (err.code === "LIMIT_FILE_SIZE") {
        msg = "حجم الملف كبير جداً. الحد الأقصى: 100MB للفيديو، 20MB للصور";
      } else if (err.code === "ECONNRESET" || err.code === "ENOTFOUND") {
        msg = "انقطع الاتصال أثناء رفع الملف";
        statusCode = 408;
      } else if (err.message && err.message.includes("413")) {
        msg = "حجم الملف كبير جداً. تحقق من إعدادات nginx";
        statusCode = 413;
      }
      
      return res.status(statusCode).json({ 
        error: msg,
        code: err.code,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next();
  });
};

// دالة لتحديث بيانات التمرين
async function updateDataExercise(req, res) {
  try {
    // إضافة logs للتتبع
    console.log("🔄 بدء عملية تحديث التمرين");
    console.log("📝 البيانات المستلمة:", req.body);
    console.log("📁 الملفات المرفوعة:", req.files ? Object.keys(req.files) : "لا توجد ملفات");

    const exercise_img_file = req.files && req.files["exercise_img"]
      ? req.files["exercise_img"][0]
      : null;
    
    const exercise_video_file = req.files && req.files["exercise_video"]
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
      exercise_stepHowDoingEn,
      exercise_stepHowDoingAr,
      exercise_commonMistakesEn,
      exercise_commonMistakesAr,
      exercise_tipsEn,
      exercise_tipsAr,
    } = req.body;

    // التحقق من وجود المعاملات الأساسية
    if (!exercise_id) {
      console.log("❌ معرف التمرين مفقود");
      return res.status(400).json({
        status: "failure",
        message: "Exercise ID is required",
      });
    }

    console.log(`🔍 محاولة تحديث التمرين رقم: ${exercise_id}`);

    // استعلام للحصول على البيانات القديمة
    console.log("📖 جاري استرجاع البيانات القديمة...");
    const oldExerciseData = await getData("exercise", "exercise_id = ?", [exercise_id]);
    console.log("📊 نتيجة استرجاع البيانات:", oldExerciseData);

    // التحقق من وجود التمرين
    if (!oldExerciseData || oldExerciseData.status !== "success" || !oldExerciseData.data) {
      console.log("❌ التمرين غير موجود في قاعدة البيانات");
      return res.status(404).json({
        status: "failure",
        message: "Exercise not found",
      });
    }

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_exercise_img = oldExerciseData.data.exercise_img || "img.png";
    const old_exercise_video = oldExerciseData.data.exercise_video || null;
    
    console.log(`🖼️  الصورة القديمة: ${old_exercise_img}`);
    console.log(`🎥 الفيديو القديم: ${old_exercise_video}`);

    let exercise_img_path = old_exercise_img;
    let exercise_video_path = old_exercise_video;

    // معالجة الصورة الجديدة
    if (exercise_img_file) {
      console.log(`📤 رفع صورة جديدة: ${exercise_img_file.filename}`);
      const newFileName = exercise_img_file.filename;
      if (newFileName !== old_exercise_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_exercise_img && old_exercise_img !== "img.png") {
          const oldImagePath = path.join(process.cwd(), "query/exercise/exerciseFiles/images", old_exercise_img);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log(`🗑️  تم حذف الصورة القديمة: ${oldImagePath}`);
          }
        }
        exercise_img_path = newFileName;
      }
    } else {
      console.log("📷 لم يتم رفع صورة جديدة - الاحتفاظ بالصورة القديمة");
    }

    // معالجة الفيديو الجديد
    if (exercise_video_file) {
      console.log(`📤 رفع فيديو جديد: ${exercise_video_file.filename}`);
      const newFileName = exercise_video_file.filename;
      if (newFileName !== old_exercise_video) {
        // حذف الفيديو القديم إن وجد
        if (old_exercise_video) {
          const oldVideoPath = path.join(process.cwd(), "query/exercise/exerciseFiles/videos", old_exercise_video);
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
            console.log(`🗑️  تم حذف الفيديو القديم: ${oldVideoPath}`);
          }
        }
        exercise_video_path = newFileName;
      }
    } else {
      console.log("🎥 لم يتم رفع فيديو جديد - الاحتفاظ بالفيديو القديم");
    }

    // تحديث البيانات في قاعدة البيانات
    const updateExerciseData = {
      exercise_idTraining: exercise_idTraining || oldExerciseData.data.exercise_idTraining,
      exercise_nameEn: exercise_nameEn || oldExerciseData.data.exercise_nameEn,
      exercise_nameAr: exercise_nameAr || oldExerciseData.data.exercise_nameAr,
      exercise_equipment: exercise_equipment || oldExerciseData.data.exercise_equipment,
      exercise_duration: exercise_duration || oldExerciseData.data.exercise_duration,
      exercise_Kcal: exercise_Kcal || oldExerciseData.data.exercise_Kcal,
      exercise_img: exercise_img_path,
      exercise_video: exercise_video_path,
      exercise_musclesTargeted: exercise_musclesTargeted || oldExerciseData.data.exercise_musclesTargeted,
      exercise_stepHowDoingEn: exercise_stepHowDoingEn || oldExerciseData.data.exercise_stepHowDoingEn,
      exercise_stepHowDoingAr: exercise_stepHowDoingAr || oldExerciseData.data.exercise_stepHowDoingAr,
      exercise_commonMistakesEn: exercise_commonMistakesEn || oldExerciseData.data.exercise_commonMistakesEn,
      exercise_commonMistakesAr: exercise_commonMistakesAr || oldExerciseData.data.exercise_commonMistakesAr,
      exercise_tipsEn: exercise_tipsEn || oldExerciseData.data.exercise_tipsEn,
      exercise_tipsAr: exercise_tipsAr || oldExerciseData.data.exercise_tipsAr,
    };

    console.log("💾 البيانات المراد تحديثها:", updateExerciseData);
    console.log("🔄 جاري تحديث قاعدة البيانات...");

    const result = await updateData(
      "exercise",
      updateExerciseData,
      "exercise_id = ?",
      [exercise_id]
    );

    console.log("📊 نتيجة التحديث:", result);

    if (result.status === "success") {
      console.log("✅ تم تحديث التمرين بنجاح");
      res.json({
        status: "success",
        message: "Exercise data updated successfully.",
        data: {
          exercise_id,
          updated_fields: Object.keys(updateExerciseData)
        }
      });
    } else {
      console.log("❌ فشل في تحديث التمرين:", result.message);
      res.status(500).json({
        status: "failure",
        message: result.message || "Failed to update exercise data.",
      });
    }
  } catch (error) {
    console.error("💥 خطأ في تحديث بيانات التمرين:", error);
    console.error("📍 تفاصيل الخطأ:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
      files: req.files ? Object.keys(req.files) : "لا توجد ملفات"
    });
    
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating exercise data",
      error_details: error.message
    });
  }
}

// تصدير الدالة
module.exports = { updateDataExercise, uploadFiles }; 
*/
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
      let statusCode = 400;
      
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        msg = `اسم الحقل غير متوقع: ${err.field}`;
      } else if (err.message === "EXT") {
        msg = "ملف غير مسموح به";
      } else if (err.code === "LIMIT_FILE_SIZE") {
        msg = "حجم الملف كبير جداً. الحد الأقصى: 100MB للفيديو، 20MB للصور";
      } else if (err.code === "ECONNRESET" || err.code === "ENOTFOUND") {
        msg = "انقطع الاتصال أثناء رفع الملف";
        statusCode = 408;
      } else if (err.message && err.message.includes("413")) {
        msg = "حجم الملف كبير جداً. تحقق من إعدادات nginx";
        statusCode = 413;
      }
      
      return res.status(statusCode).json({ 
        error: msg,
        code: err.code,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next();
  });
};

// Function to normalize gender values
const normalizeGender = (gender) => {
  if (!gender) return null;
  
  // Handle numeric gender IDs
  if (typeof gender === 'number') {
    if (gender === 1) return 1;
    if (gender === 2) return 2;
    return null;
  }
  
  // Handle string gender values
  const genderStr = gender.toString().trim();
  
  // Handle numeric strings
  if (genderStr === '1') return 1;
  if (genderStr === '2') return 2;
  
  // Handle other string variations
  const normalized = genderStr.toLowerCase();
  
  // Handle different forms of female
  if (['female', 'femal', 'أنثى', 'انثى', 'female'].includes(normalized)) {
    return 2;
  }
  
  // Handle different forms of male
  if (['male', 'ذكر', 'male'].includes(normalized)) {
    return 1;
  }
  
  return null;
};

// دالة لتحديث بيانات التمرين
async function updateDataExercise(req, res) {
  try {
    // إضافة logs للتتبع
    console.log("🔄 بدء عملية تحديث التمرين");
    console.log("📝 البيانات المستلمة:", req.body);
    console.log("📁 الملفات المرفوعة:", req.files ? Object.keys(req.files) : "لا توجد ملفات");

    const exercise_img_file = req.files && req.files["exercise_img"]
      ? req.files["exercise_img"][0]
      : null;
    
    const exercise_video_file = req.files && req.files["exercise_video"]
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
      exercise_stepHowDoingEn,
      exercise_stepHowDoingAr,
      exercise_commonMistakesEn,
      exercise_commonMistakesAr,
      exercise_tipsEn,
      exercise_tipsAr,
      // Add gender field
      gender,
      // Add equipment weights field
      exercise_equipment_weights
    } = req.body;

    // التحقق من وجود المعاملات الأساسية
    if (!exercise_id) {
      console.log("❌ معرف التمرين مفقود");
      return res.status(400).json({
        status: "failure",
        message: "Exercise ID is required",
      });
    }

    console.log(`🔍 محاولة تحديث التمرين رقم: ${exercise_id}`);

    // استعلام للحصول على البيانات القديمة
    console.log("📖 جاري استرجاع البيانات القديمة...");
    const oldExerciseData = await getData("exercise", "exercise_id = ?", [exercise_id]);
    console.log("📊 نتيجة استرجاع البيانات:", oldExerciseData);

    // التحقق من وجود التمرين
    if (!oldExerciseData || oldExerciseData.status !== "success" || !oldExerciseData.data) {
      console.log("❌ التمرين غير موجود في قاعدة البيانات");
      return res.status(404).json({
        status: "failure",
        message: "Exercise not found",
      });
    }

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_exercise_img = oldExerciseData.data.exercise_img || "img.png";
    const old_exercise_video = oldExerciseData.data.exercise_video || "";
    
    console.log(`🖼️  الصورة القديمة: ${old_exercise_img}`);
    console.log(`🎥 الفيديو القديم: ${old_exercise_video}`);

    let exercise_img_path = old_exercise_img;
    let exercise_video_path = old_exercise_video;

    // معالجة الصورة الجديدة
    if (exercise_img_file) {
      console.log(`📤 رفع صورة جديدة: ${exercise_img_file.filename}`);
      const newFileName = exercise_img_file.filename;
      if (newFileName !== old_exercise_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_exercise_img && old_exercise_img !== "img.png") {
          const oldImagePath = path.join(process.cwd(), "query/exercise/exerciseFiles/images", old_exercise_img);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log(`🗑️  تم حذف الصورة القديمة: ${oldImagePath}`);
          }
        }
        exercise_img_path = newFileName;
      }
    } else {
      console.log("📷 لم يتم رفع صورة جديدة - الاحتفاظ بالصورة القديمة");
    }

    // معالجة الفيديو الجديد
    if (exercise_video_file) {
      console.log(`📤 رفع فيديو جديد: ${exercise_video_file.filename}`);
      const newFileName = exercise_video_file.filename;
      if (newFileName !== old_exercise_video) {
        // حذف الفيديو القديم إن وجد
        if (old_exercise_video) {
          const oldVideoPath = path.join(process.cwd(), "query/exercise/exerciseFiles/videos", old_exercise_video);
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
            console.log(`🗑️  تم حذف الفيديو القديم: ${oldVideoPath}`);
          }
        }
        exercise_video_path = newFileName;
      }
    } else {
      console.log("🎥 لم يتم رفع فيديو جديد - الاحتفاظ بالفيديو القديم");
    }

    // Process gender value for update
    let processedGender = undefined;
    // Only update gender if it's explicitly provided in the request
    if (gender !== undefined) {
      if (gender === null || gender === '') {
        // If explicitly set to null or empty, use empty string
        processedGender = '';
      } else {
        // Normalize the gender value
        processedGender = normalizeGender(gender);
        // If normalization returns null, use empty string
        if (processedGender === null) {
          processedGender = '';
        }
      }
    }

    // Process equipment weights for update
    let processedEquipmentWeights = undefined;
    // Only update equipment weights if it's explicitly provided in the request
    if (exercise_equipment_weights !== undefined) {
      if (exercise_equipment_weights === null || exercise_equipment_weights === '') {
        // If explicitly set to null or empty, use empty string
        processedEquipmentWeights = '';
      } else {
        // Process the equipment weights value
        if (typeof exercise_equipment_weights === 'object') {
          processedEquipmentWeights = JSON.stringify(exercise_equipment_weights);
        } else if (typeof exercise_equipment_weights === 'string') {
          // Validate if it's valid JSON
          try {
            JSON.parse(exercise_equipment_weights);
            processedEquipmentWeights = exercise_equipment_weights;
          } catch (e) {
            processedEquipmentWeights = exercise_equipment_weights;
          }
        } else {
          processedEquipmentWeights = exercise_equipment_weights.toString();
        }
      }
    }

    // تحديث البيانات في قاعدة البيانات
    const updateExerciseData = {
      exercise_idTraining: exercise_idTraining || oldExerciseData.data.exercise_idTraining,
      exercise_nameEn: exercise_nameEn || oldExerciseData.data.exercise_nameEn,
      exercise_nameAr: exercise_nameAr || oldExerciseData.data.exercise_nameAr,
      exercise_equipment: exercise_equipment || oldExerciseData.data.exercise_equipment,
      exercise_duration: exercise_duration || oldExerciseData.data.exercise_duration,
      exercise_Kcal: exercise_Kcal || oldExerciseData.data.exercise_Kcal,
      exercise_img: exercise_img_path,
      exercise_video: exercise_video_path,
      exercise_musclesTargeted: exercise_musclesTargeted || oldExerciseData.data.exercise_musclesTargeted,
      exercise_stepHowDoingEn: exercise_stepHowDoingEn || oldExerciseData.data.exercise_stepHowDoingEn,
      exercise_stepHowDoingAr: exercise_stepHowDoingAr || oldExerciseData.data.exercise_stepHowDoingAr,
      exercise_commonMistakesEn: exercise_commonMistakesEn || oldExerciseData.data.exercise_commonMistakesEn,
      exercise_commonMistakesAr: exercise_commonMistakesAr || oldExerciseData.data.exercise_commonMistakesAr,
      exercise_tipsEn: exercise_tipsEn || oldExerciseData.data.exercise_tipsEn,
      exercise_tipsAr: exercise_tipsAr || oldExerciseData.data.exercise_tipsAr,
      // Add gender field if provided
      ...(gender !== undefined && { gender: processedGender }),
      // Add equipment weights field if provided
      ...(exercise_equipment_weights !== undefined && { exercise_equipment_weights: processedEquipmentWeights })
    };

    console.log("💾 البيانات المراد تحديثها:", updateExerciseData);
    console.log("🔄 جاري تحديث قاعدة البيانات...");

    const result = await updateData(
      "exercise",
      updateExerciseData,
      "exercise_id = ?",
      [exercise_id]
    );

    console.log("📊 نتيجة التحديث:", result);

    if (result.status === "success") {
      console.log("✅ تم تحديث التمرين بنجاح");
      res.json({
        status: "success",
        message: "Exercise data updated successfully.",
        data: {
          exercise_id,
          updated_fields: Object.keys(updateExerciseData)
        }
      });
    } else {
      console.log("❌ فشل في تحديث التمرين:", result.message);
      res.status(500).json({
        status: "failure",
        message: result.message || "Failed to update exercise data.",
      });
    }
  } catch (error) {
    console.error("💥 خطأ في تحديث بيانات التمرين:", error);
    console.error("📍 تفاصيل الخطأ:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
      files: req.files ? Object.keys(req.files) : "لا توجد ملفات"
    });
    
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating exercise data",
      error_details: error.message
    });
  }
}

// تصدير الدالة
module.exports = { updateDataExercise, uploadFiles };
