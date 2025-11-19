const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/restnight/restnightImages",
  [{ name: "restnight_img", maxCount: 1 }]
);

async function insertDataRestNight(req, res) {
  try {
    const restnight_img_file = req.files["restnight_img"]
      ? req.files["restnight_img"][0]
      : null;

    const { restnight_titleEn, restnight_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const restnight_img_path = restnight_img_file
      ? restnight_img_file.filename
      : req.body.restnight_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertRestNightData = {
      restnight_titleEn,
      restnight_titleAr,
      restnight_img: restnight_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("restnight", insertRestNightData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Insert data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting data",
    });
  }
}

// تصدير الدوال
module.exports = { insertDataRestNight, uploadImages }; 