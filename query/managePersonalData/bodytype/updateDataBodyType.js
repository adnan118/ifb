const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/bodytype/bodytypeImages/images",
  [{ name: "bodyType_img", maxCount: 1 }]
);

async function updateDataBodyType(req, res) {
  try {
    const bodyType_img_file = req.files["bodyType_img"]
      ? req.files["bodyType_img"][0]
      : null;

    const {
      bodyType_id,
      bodyType_gender_id,
      bodyType_titleEn,
      bodyType_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldBodyTypeData = await getData("bodytype", "bodyType_id = ?", [
      bodyType_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_bodyType_img =
      oldBodyTypeData && oldBodyTypeData.status === "success" && oldBodyTypeData.data
        ? oldBodyTypeData.data.bodyType_img
        : null;

    let bodyType_img_path = old_bodyType_img || "img.svg"; // الافتراضي

    if (bodyType_img_file) {
      const newFileName = bodyType_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_bodyType_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_bodyType_img && old_bodyType_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/bodytype/bodytypeImages/images",
            old_bodyType_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        bodyType_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateBodyTypeData = {
      bodyType_gender_id: bodyType_gender_id,
      bodyType_titleEn: bodyType_titleEn,
      bodyType_titleAr: bodyType_titleAr,
      bodyType_img: bodyType_img_path,
    };

    const result = await updateData(
      "bodytype",
      updateBodyTypeData,
      "bodyType_id = ?",
      [bodyType_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Body type data updated successfully.",
        data: {
          bodyType_id,
          ...updateBodyTypeData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update body type data.",
      });
    }
  } catch (error) {
    console.error("Error updating body type data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating body type data",
    });
  }
}

module.exports = { updateDataBodyType, uploadImages }; 