const {
  updateData,
  handleImageUpload,
  handleImageDeletion,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور الخاصة بالجنس
const uploadGenderImages = handleImageUpload(
  "query/managePersonalData/gender/genderImages/images",
  [{ name: "gender_img", maxCount: 1 }]
);

// دالة لحذف صور الجندر
const deleteGenderImages = handleImageDeletion(
  "query/managePersonalData/gender/genderImages/images",
  "gender",
  "gender_id",
  "gender_img"
);

async function updateDataGender(req, res) {
  try {
    const gender_img_file = req.files["gender_img"]
      ? req.files["gender_img"][0]
      : null;

    const {
      gender_id, 
      gender_nameEn,
      gender_nameAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldGenderData = await getData("gender", "gender_id = ?", [gender_id]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_gender_img =
      oldGenderData && oldGenderData.status === "success" && oldGenderData.data
        ? oldGenderData.data.gender_img
        : null;

    let gender_img_path = old_gender_img || "img.svg"; // الافتراضي

    if (gender_img_file) {
      const newFileName = gender_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_gender_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_gender_img && old_gender_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/gender/genderImages/images",
            old_gender_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        gender_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateGenderData = {
      gender_nameEn,
      gender_nameAr,
      gender_img: gender_img_path,
    };

    const result = await updateData(
      "gender",
      updateGenderData,
      "gender_id = ?",
      [gender_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Gender data updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update gender data.",
      });
    }
  } catch (error) {
    console.error("Error updating gender data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating gender data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataGender };
