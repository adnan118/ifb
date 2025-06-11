const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/energylevels/energylevelsImages/images",
  [{ name: "energylevels_img", maxCount: 1 }]
);

async function updateDataEnergyLevels(req, res) {
  try {
    const energylevels_img_file = req.files["energylevels_img"]
      ? req.files["energylevels_img"][0]
      : null;

    const {
      energylevels_id,
      energylevels_titleEn,
      energylevels_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldEnergyLevelsData = await getData("energylevels", "energylevels_id = ?", [
      energylevels_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_energylevels_img =
      oldEnergyLevelsData && oldEnergyLevelsData.status === "success" && oldEnergyLevelsData.data
        ? oldEnergyLevelsData.data.energylevels_img
        : null;

    let energylevels_img_path = old_energylevels_img || "img.svg"; // الافتراضي

    if (energylevels_img_file) {
      const newFileName = energylevels_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_energylevels_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_energylevels_img && old_energylevels_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/energylevels/energylevelsImages/images",
            old_energylevels_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        energylevels_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateEnergyLevelsData = {
      energylevels_titleEn: energylevels_titleEn,
      energylevels_titleAr: energylevels_titleAr,
      energylevels_img: energylevels_img_path,
    };

    const result = await updateData(
      "energylevels",
      updateEnergyLevelsData,
      "energylevels_id = ?",
      [energylevels_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Energy levels data updated successfully.",
        data: {
          energylevels_id,
          ...updateEnergyLevelsData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update energy levels data.",
      });
    }
  } catch (error) {
    console.error("Error updating energy levels data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating energy levels data",
    });
  }
}

module.exports = { updateDataEnergyLevels, uploadImages }; 