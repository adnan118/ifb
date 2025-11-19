const {
  insertData,
  handleImageUpload,
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/typicalday/typicaldayImages",
  [{ name: "typicalday_img", maxCount: 1 }]
);

// دالة لإدخال بيانات اليوم النموذجي
async function insertDataTypicalDay(req, res) {
  try {
    const typicalday_img_file = req.files["typicalday_img"]
      ? req.files["typicalday_img"][0]
      : null;

    const { typicalday_titleEn, typicalday_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const typicalday_img_path = typicalday_img_file
      ? typicalday_img_file.filename
      : req.body.typicalday_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertTypicalDayData = {
      typicalday_titleEn: typicalday_titleEn,
      typicalday_titleAr: typicalday_titleAr,
      typicalday_img: typicalday_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("typicalday", insertTypicalDayData);

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
module.exports = {
  uploadImages,
  insertDataTypicalDay,
};
