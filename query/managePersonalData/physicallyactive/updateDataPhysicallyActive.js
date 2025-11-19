const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/physicallyactive/physicallyactiveImages/images",
  [{ name: "physicallyactive_img", maxCount: 1 }]
);

async function updateDataPhysicallyActive(req, res) {
  try {
    const physicallyactive_img_file = req.files["physicallyactive_img"]
      ? req.files["physicallyactive_img"][0]
      : null;

    const {
      physicallyactive_id,
      physicallyactive_titleEn,
      physicallyactive_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldPhysicallyActiveData = await getData("physicallyactive", "physicallyactive_id = ?", [
      physicallyactive_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_physicallyactive_img =
      oldPhysicallyActiveData && oldPhysicallyActiveData.status === "success" && oldPhysicallyActiveData.data
        ? oldPhysicallyActiveData.data.physicallyactive_img
        : null;

    let physicallyactive_img_path = old_physicallyactive_img || "img.svg"; // الافتراضي

    if (physicallyactive_img_file) {
      const newFileName = physicallyactive_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_physicallyactive_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_physicallyactive_img && old_physicallyactive_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/physicallyactive/physicallyactiveImages/images",
            old_physicallyactive_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        physicallyactive_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updatePhysicallyActiveData = {
      physicallyactive_titleEn,
      physicallyactive_titleAr,
      physicallyactive_img: physicallyactive_img_path,
    };

    const result = await updateData(
      "physicallyactive",
      updatePhysicallyActiveData,
      "physicallyactive_id = ?",
      [physicallyactive_id]
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
module.exports = { updateDataPhysicallyActive, uploadImages }; 