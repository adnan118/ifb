const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/specialprograms/specialprogramsImages/images",
  [{ name: "specialPrograms_img", maxCount: 1 }]
);

async function updateDataSpecialPrograms(req, res) {
  try {
    const specialPrograms_img_file = req.files["specialPrograms_img"]
      ? req.files["specialPrograms_img"][0]
      : null;

    const {
      specialPrograms_id,
      specialPrograms_nameEn,
      specialPrograms_nameAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldSpecialProgramsData = await getData("specialprograms", "specialPrograms_id = ?", [
      specialPrograms_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_specialPrograms_img =
      oldSpecialProgramsData && oldSpecialProgramsData.status === "success" && oldSpecialProgramsData.data
        ? oldSpecialProgramsData.data.specialPrograms_img
        : null;

    let specialPrograms_img_path = old_specialPrograms_img || "img.svg"; // الافتراضي

    if (specialPrograms_img_file) {
      const newFileName = specialPrograms_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_specialPrograms_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_specialPrograms_img && old_specialPrograms_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/specialprograms/specialprogramsImages/images",
            old_specialPrograms_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        specialPrograms_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateSpecialProgramsData = {
      specialPrograms_nameEn,
      specialPrograms_nameAr,
      specialPrograms_img: specialPrograms_img_path,
    };

    const result = await updateData(
      "specialprograms",
      updateSpecialProgramsData,
      "specialPrograms_id = ?",
      [specialPrograms_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Update data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataSpecialPrograms, uploadImages }; 