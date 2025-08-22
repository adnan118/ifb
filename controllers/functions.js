const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const path = require("path"); // استيراد هذا لتسهيل التعامل مع مسارات الملفات  

 

 
//صور
const fs = require("fs"); 
const fsPromises = require("fs").promises;

const multer = require("multer"); 

 
const { getConnection } = require("./db");




// دالة لاسترجاع جميع البيانات
async function getAllData(table, where = null, values = null, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال

  // بناء الاستعلام الأساسي
  let query = `SELECT * FROM ${table}`;

  // إضافة شرط WHERE إذا كان موجودًا
  if (where) {
    query += ` WHERE ${where}`;
  }

  // ضبط القيم للاستعلام
  let queryValues = values ? values : [];

  try {
    const [results] = await connection.execute(query, queryValues);
    await connection.end();

    return { status: "success", data: results }; // هيكل موحد
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "There is a problem retrieving data" }; // رسالة الخطأ
  }
}
 // دالة لاسترجاع بيانات فردية
async function getData(table, where = null, values = null, json = true) { 
  const connection = await getConnection(); // الحصول على الاتصال

  let query = `SELECT * FROM ${mysql.escapeId(table)}`;
  
  // إضافة شرط WHERE إذا كان موجودًا
  if (where) {
    query += ` WHERE ${where}`;
  }

  try {
    const [results] = await connection.execute(query, values || []);
    await connection.end();

    if (results.length > 0) {
      return { status: "success", data: results[0] };
    } else {
      return { status: "failure", message: "No Data" };
    }
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "There is a problem retrieving data" };
  }
}

// دالة لإدراج بيانات جديدة
async function insertData(table, data, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال

  const fields = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");

  const query = `INSERT INTO ${mysql.escapeId(
    table
  )} (${fields}) VALUES (${placeholders})`;

  try {
    await connection.execute(query, Object.values(data));
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
   // return { status: "failure", message: "There is a problem inserting data" };
       return { status: "failure", message: error.message }; // 👈 رجّع الخطأ الحقيقي

  }
}

// دالة لتحديث البيانات
async function updateData(table, data, where, values, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال
  const setClause = Object.keys(data)
    .map((key) => `${mysql.escapeId(key)} = ?`)
    .join(", ");

  const query = `UPDATE ${mysql.escapeId(
    table
  )} SET ${setClause} WHERE ${where}`;

  try {
    await connection.execute(query, [...Object.values(data), ...values]);
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "هناك مشكلة في تحديث البيانات" };
  }
}

// دالة لحذف البيانات
async function deleteData(table, where, values, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال

  const query = `DELETE FROM ${mysql.escapeId(table)} WHERE ${where}`;

  try {
    await connection.execute(query, values);
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "هناك مشكلة في حذف البيانات" };
  }
}



 

const fileFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".png", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("EXT"));
  }
};

const videoFilter = (req, file, cb) => {
  const allowedExt = [".mp4", ".mov", ".avi", ".wmv"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("EXT"));
  }
};

// Create a function to configure multer with custom path
const createMulterConfig = (uploadPath, isVideo = false) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // تحديد المسار بناءً على نوع الملف
      let finalPath = path.join(process.cwd(), uploadPath);
      if (file.fieldname === "exercise_video") {
        finalPath = path.join(finalPath, "videos");
      } else {
        finalPath = path.join(finalPath, "images");
      }

      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
        console.log("Created upload directory:", finalPath);
      }
      cb(null, finalPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }, 
  });

  return multer({
    storage: storage,
    limits: { fileSize: isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024 }, // 100MB for video, 20MB for images
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "exercise_video") {
        return videoFilter(req, file, cb);
      }
      return fileFilter(req, file, cb);
    }
  });
};

//  هي دالة middleware تستخدم عادة في مسارات (routes)
// دالة شاملة لرفع الصور
const handleImageUpload = (
  uploadPath,
  fieldConfigs = [
    { name: "img_cover", maxCount: 1 },
    { name: "img_gallery", maxCount: 10 },
  ]
) => {
  // إنشاء تكوين multer
  const multerConfig = createMulterConfig(uploadPath);

  // دالة middleware لرفع الصور
  return (req, res, next) => {
    const upload = multerConfig.fields(fieldConfigs);

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
};



//  هي دالة middleware تستخدم عادة في مسارات (routes)
// دالة شاملة لحذف الصور
const handleImageDeletion = (uploadPath, tableName, idField, coverImageField, galleryImageField = null) => {
  return async (req, res, next) => {
    try {
      const id = req.body[idField];
      // تحقق مما إذا كان طلب رفع صورة جديدة
      const newImageFile = req.files || req.files[coverImageField];

      // إذا لم يتم رفع صورة جديدة، لا تحذف
      if (!newImageFile) {
        return next();
      }
      // الحصول على معلومات السجل
      const result = await getData(tableName, `${idField} = ?`, [id]);

      if (result.status === "success") {
        const record = result.data;

        // حذف صورة الغلاف
        if (record[coverImageField] && record[coverImageField] !== "img.png") {
          const coverPath = path.join(
            process.cwd(),
            uploadPath,
            record[coverImageField]
          );
          if (await fsPromises.access(coverPath).catch(() => false)) {
            await fsPromises.unlink(coverPath);
            console.log("تم حذف صورة الغلاف:", coverPath);
          }
        }

        // حذف صور المعرض إذا وجدت
        if (galleryImageField && record[galleryImageField]) {
          const galleryImages = record[galleryImageField].split(",");
          galleryImages.forEach((image) => {
            if (image && image !== "img.png") {
              const galleryPath = path.join(process.cwd(), uploadPath, image);
              if (fs.existsSync(galleryPath)) {
                fs.unlinkSync(galleryPath);
            //    console.log("Deleted gallery image:", galleryPath);
              }
            }
          });
        }
      } else {
        console.log("No record found to delete images for");
      }

      next();
    } catch (error) {
      console.error("Error deleting images: ", error);
      next(error);
    }
  };
};
// دالة لإرسال البريد الإلكتروني

/*
. استخدام كلمة مرور خاصة بالتطبيق:
إذا كانت المصادقة الثنائية مفعلة، يجب عليك إنشاء كلمة مرور خاصة بالتطبيق. اتبع الخطوات التالية:

انتقل إلى حساب Google.
اذهب إلى قسم "الأمان".
ابحث عن "تسجيل الدخول إلى Google" ثم اختر "كلمات مرور التطبيقات".
اتبع التعليمات لإنشاء كلمة مرور تطبيق جديدة.
استخدم كلمة المرور هذه بدلاً من كلمة مرور حساب Gmail في كودك.
*/
 
const sentMail = async (to, cc,name, subjectTitle, verificationCode, logoUrl) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "a934916@gmail.com", // بريدك الإلكتروني
      pass: "gxiruzcgkyhbgrjt", // كلمة مرور بريدك الإلكتروني
    },
  });

  const mailOptions = {
    from: "Ideal Body",
    to: to,
    subject: subjectTitle,
    html: `  
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">  
        <div style="text-align: center;">  
          <img src="${logoUrl}" alt="Logo yabro" style="width: 150px;"/>  
        </div>  
        <h2 style="color: #333;">Dear, ${name}</h2>  
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>  
        <h3 style="color: #007BFF;">${verificationCode}</h3>  
        <p style="font-size: 16px; color: #555;">Please use this code to complete your registration.</p>  
        
        <hr style="margin: 20px 0;">  
        
        <p style="font-size: 14px; color: #999;">If you did not request this code, you can ignore this email.</p>  
        <footer style="margin-top: 20px; font-size: 14px; color: #999;">  
          &copy; 2025 Yabro. All rights reserved.  
        </footer>  
      </div>  
    `,
    cc: cc,
    replyTo: "no-reply@yabro-co.com", // عنوان بريد إلكتروني غير مراقب
  };

      await transporter.sendMail(mailOptions);
};  
// مثال على كيفية استخدام الدالة  
// sentMail("recipient@example.com", "cc@example.com", "Subject", "This is the message body", "https://example.com/logo.png");  

// دالة شاملة لرفع الفيديو
const handleVideoUpload = (
  uploadPath,
  fieldConfigs = [{ name: "exercise_video", maxCount: 1 }]
) => {
  // إنشاء تكوين multer
  const multerConfig = createMulterConfig(uploadPath, true);

  // دالة middleware لرفع الفيديو
  return multerConfig.fields(fieldConfigs);
};

// دالة شاملة لحذف الفيديو
const handleVideoDeletion = (uploadPath, videoFileName) => {
  return async (req, res, next) => {
    try {
      // إذا لم يتم رفع فيديو جديد، لا تحذف
      if (!req.files || !req.files["exercise_video"]) {
        return next();
      }

      // حذف الفيديو القديم إذا كان موجوداً
      if (videoFileName) {
        const videoPath = path.join(process.cwd(), uploadPath, videoFileName);
        if (await fsPromises.access(videoPath).catch(() => false)) {
          await fsPromises.unlink(videoPath);
          console.log("تم حذف الفيديو القديم:", videoPath);
        }
      }
      next();
    } catch (error) {
      console.error("Error in handleVideoDeletion:", error);
      next(error);
    }
  };
};

// تصدير الدوال
module.exports = {
  getAllData,
  getData,
  insertData,
  updateData,
  deleteData,
  sentMail,
  handleImageUpload,
  handleImageDeletion,
  handleVideoUpload,
  handleVideoDeletion,
  createMulterConfig
};


