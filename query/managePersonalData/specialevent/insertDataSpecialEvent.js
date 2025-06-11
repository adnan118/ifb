const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/specialevent/specialeventImages",
  [{ name: "specialevent_img", maxCount: 1 }]
);

async function insertDataSpecialEvent(req, res) {
  try {
    const specialevent_img_file = req.files["specialevent_img"]
      ? req.files["specialevent_img"][0]
      : null;

    const { specialevent_titleEn, specialevent_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const specialevent_img_path = specialevent_img_file
      ? specialevent_img_file.filename
      : req.body.specialevent_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertSpecialEventData = {
      specialevent_titleEn,
      specialevent_titleAr,
      specialevent_img: specialevent_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("specialevent", insertSpecialEventData);

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
module.exports = { insertDataSpecialEvent, uploadImages }; 