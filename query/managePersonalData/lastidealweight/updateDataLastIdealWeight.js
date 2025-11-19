const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/lastidealweight/lastidealweightImages/images",
  [{ name: "lastidealweight_img", maxCount: 1 }]
);

async function updateDataLastIdealWeight(req, res) {
  try {
    const lastidealweight_img_file = req.files["lastidealweight_img"]
      ? req.files["lastidealweight_img"][0]
      : null;

    const {
      lastidealweight_id,
      lastidealweight_titleEn,
      lastidealweight_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldLastIdealWeightData = await getData("lastidealweight", "lastidealweight_id = ?", [
      lastidealweight_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_lastidealweight_img =
      oldLastIdealWeightData && oldLastIdealWeightData.status === "success" && oldLastIdealWeightData.data
        ? oldLastIdealWeightData.data.lastidealweight_img
        : null;

    let lastidealweight_img_path = old_lastidealweight_img || "img.svg"; // الافتراضي

    if (lastidealweight_img_file) {
      const newFileName = lastidealweight_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_lastidealweight_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_lastidealweight_img && old_lastidealweight_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/lastidealweight/lastidealweightImages/images",
            old_lastidealweight_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        lastidealweight_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateLastIdealWeightData = {
      lastidealweight_titleEn: lastidealweight_titleEn,
      lastidealweight_titleAr: lastidealweight_titleAr,
      lastidealweight_img: lastidealweight_img_path,
    };

    const result = await updateData(
      "lastidealweight",
      updateLastIdealWeightData,
      "lastidealweight_id = ?",
      [lastidealweight_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Last ideal weight data updated successfully.",
        data: {
          lastidealweight_id,
          ...updateLastIdealWeightData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update last ideal weight data.",
      });
    }
  } catch (error) {
    console.error("Error updating last ideal weight data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating last ideal weight data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataLastIdealWeight, uploadImages }; 