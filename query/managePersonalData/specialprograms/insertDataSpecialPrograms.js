const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/specialprograms/specialprogramsImages",
  [{ name: "specialPrograms_img", maxCount: 1 }]
);

async function insertDataSpecialPrograms(req, res) {
  try {
    const specialPrograms_img_file = req.files["specialPrograms_img"]
      ? req.files["specialPrograms_img"][0]
      : null;

    const { specialPrograms_nameEn, specialPrograms_nameAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const specialPrograms_img_path = specialPrograms_img_file
      ? specialPrograms_img_file.filename
      : req.body.specialPrograms_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertSpecialProgramsData = {
      specialPrograms_nameEn,
      specialPrograms_nameAr,
      specialPrograms_img: specialPrograms_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("specialprograms", insertSpecialProgramsData);

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
module.exports = { insertDataSpecialPrograms, uploadImages }; 