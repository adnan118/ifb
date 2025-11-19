const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/lastidealweight/lastidealweightImages",
  [{ name: "lastidealweight_img", maxCount: 1 }]
);

async function insertDataLastIdealWeight(req, res) {
  try {
    const lastidealweight_img_file = req.files["lastidealweight_img"]
      ? req.files["lastidealweight_img"][0]
      : null;

    const { lastidealweight_titleEn, lastidealweight_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const lastidealweight_img_path = lastidealweight_img_file
      ? lastidealweight_img_file.filename
      : req.body.lastidealweight_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertLastIdealWeightData = {
      lastidealweight_titleEn: lastidealweight_titleEn,
      lastidealweight_titleAr: lastidealweight_titleAr,
      lastidealweight_img: lastidealweight_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData(
      "lastidealweight",
      insertLastIdealWeightData
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Last ideal weight data inserted successfully.",
        data: insertLastIdealWeightData
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert last ideal weight data.",
      });
    }
  } catch (error) {
    console.error("Error inserting last ideal weight data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting last ideal weight data",
    });
  }
}

// تصدير الدوال
module.exports = { insertDataLastIdealWeight, uploadImages }; 