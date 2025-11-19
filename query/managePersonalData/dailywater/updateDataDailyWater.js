const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/dailywater/dailywaterImages/images",
  [{ name: "dailywater_img", maxCount: 1 }]
);

async function updateDataDailyWater(req, res) {
  try {
    const dailywater_img_file = req.files["dailywater_img"]
      ? req.files["dailywater_img"][0]
      : null;

    const {
      dailywater_id,
      dailywater_titleEn,
      dailywater_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldDailyWaterData = await getData("dailywater", "dailywater_id = ?", [
      dailywater_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_dailywater_img =
      oldDailyWaterData && oldDailyWaterData.status === "success" && oldDailyWaterData.data
        ? oldDailyWaterData.data.dailywater_img
        : null;

    let dailywater_img_path = old_dailywater_img || "img.svg"; // الافتراضي

    if (dailywater_img_file) {
      const newFileName = dailywater_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_dailywater_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_dailywater_img && old_dailywater_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/dailywater/dailywaterImages/images",
            old_dailywater_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dailywater_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateDailyWaterData = {
      dailywater_titleEn: dailywater_titleEn,
      dailywater_titleAr: dailywater_titleAr,
      dailywater_img: dailywater_img_path,
    };

    const result = await updateData(
      "dailywater",
      updateDailyWaterData,
      "dailywater_id = ?",
      [dailywater_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Daily water data updated successfully.",
        data: {
          dailywater_id,
          ...updateDailyWaterData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update daily water data.",
      });
    }
  } catch (error) {
    console.error("Error updating daily water data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating daily water data",
    });
  }
}

module.exports = { updateDataDailyWater, uploadImages }; 