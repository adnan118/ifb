const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/areasattention/areasattentionImages/images",
  [{ name: "areasattention_img", maxCount: 1 }]
);

async function updateDataAreasAttention(req, res) {
  try {
    const areasattention_img_file = req.files["areasattention_img"]
      ? req.files["areasattention_img"][0]
      : null;

    const {
      areasattention_id,
      areasattention_gender_id,
      areasattention_titleEn,
      areasattention_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldAreasAttentionData = await getData("areasattention", "areasattention_id = ?", [
      areasattention_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_areasattention_img =
      oldAreasAttentionData && oldAreasAttentionData.status === "success" && oldAreasAttentionData.data
        ? oldAreasAttentionData.data.areasattention_img
        : null;

    let areasattention_img_path = old_areasattention_img || "img.svg"; // الافتراضي

    if (areasattention_img_file) {
      const newFileName = areasattention_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_areasattention_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_areasattention_img && old_areasattention_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/areasattention/areasattentionImages/images",
            old_areasattention_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        areasattention_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateAreasAttentionData = {
      areasattention_gender_id: areasattention_gender_id,
      areasattention_titleEn: areasattention_titleEn,
      areasattention_titleAr: areasattention_titleAr,
      areasattention_img: areasattention_img_path,
    };

    const result = await updateData(
      "areasattention",
      updateAreasAttentionData,
      "areasattention_id = ?",
      [areasattention_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Areas of attention data updated successfully.",
        data: {
          areasattention_id,
          ...updateAreasAttentionData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update areas of attention data.",
      });
    }
  } catch (error) {
    console.error("Error updating areas of attention data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating areas of attention data",
    });
  }
}

module.exports = { updateDataAreasAttention, uploadImages }; 