const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور الخاصة بجنر
const uploadGenderImages = handleImageUpload(
  "query/managePersonalData/gender/genderImages",
  [{ name: "gender_img", maxCount: 1 }]
);

// دالة لإدخال بيانات الجنس
async function insertDataGender(req, res) {
  try {
    const gender_img_file = req.files["gender_img"]
      ? req.files["gender_img"][0]
      : null;

    const { gender_nameEn, gender_nameAr }  = req.body;

    // تحديد مسار الصورة المرفوعة
    const gender_img_path = gender_img_file
      ? gender_img_file.filename
      : req.body.gender_img || "img.svg";

    // إعداد البيانات الإدخالية
    const insertGenderData = {
      gender_nameEn: gender_nameEn,
      gender_nameAr: gender_nameAr,
      gender_img: gender_img_path,
    };

    const result = await insertData("gender", insertGenderData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Gender data inserted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert gender data.",
      });
    }
  } catch (error) {
    console.error("Error inserting gender data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting gender data",
    });
  }
}

// تصدير الدوال
module.exports = { insertDataGender, uploadGenderImages };