const { insertData, handleImageUpload } = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/dailywater/dailywaterImages",
  [{ name: "dailywater_img", maxCount: 1 }]
);

async function insertDataDailyWater(req, res) {
  try {
    const dailywater_img_file = req.files["dailywater_img"]
      ? req.files["dailywater_img"][0]
      : null;

    const { dailywater_titleEn, dailywater_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const dailywater_img_path = dailywater_img_file
      ? dailywater_img_file.filename
      : req.body.dailywater_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertDailyWaterData = {
      dailywater_titleEn: dailywater_titleEn,
      dailywater_titleAr: dailywater_titleAr,
      dailywater_img: dailywater_img_path,
    };

    const result = await insertData("dailywater", insertDailyWaterData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Daily water data inserted successfully.",
        data: insertDailyWaterData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert daily water data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting daily water data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting daily water data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataDailyWater }; 