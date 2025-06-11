const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/diettype/diettypeImages/images",
  [{ name: "diettype_img", maxCount: 1 }]
);

async function updateDataDietType(req, res) {
  try {
    const diettype_img_file = req.files["diettype_img"]
      ? req.files["diettype_img"][0]
      : null;

    const {
      diettype_id,
      diettype_titleEn,
      diettype_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldDietTypeData = await getData("diettype", "diettype_id = ?", [
      diettype_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_diettype_img =
      oldDietTypeData && oldDietTypeData.status === "success" && oldDietTypeData.data
        ? oldDietTypeData.data.diettype_img
        : null;

    let diettype_img_path = old_diettype_img || "img.svg"; // الافتراضي

    if (diettype_img_file) {
      const newFileName = diettype_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_diettype_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_diettype_img && old_diettype_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/diettype/diettypeImages/images",
            old_diettype_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        diettype_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateDietTypeData = {
      diettype_titleEn: diettype_titleEn,
      diettype_titleAr: diettype_titleAr,
      diettype_img: diettype_img_path,
    };

    const result = await updateData(
      "diettype",
      updateDietTypeData,
      "diettype_id = ?",
      [diettype_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Diet type data updated successfully.",
        data: {
          diettype_id,
          ...updateDietTypeData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update diet type data.",
      });
    }
  } catch (error) {
    console.error("Error updating diet type data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating diet type data",
    });
  }
}

module.exports = { updateDataDietType, uploadImages }; 