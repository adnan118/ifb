const {
  updateData,
  handleImageUpload,
  handleImageDeletion,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/equipments/equipmentImages/images",
  [{ name: "equipments_img", maxCount: 1 }]
);

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/equipments/equipmentImages/images", // مسار الصور
  "equipments", // اسم الجدول
  "equipments_id", // حقل المعرف
  "equipments_img" // حقل الصورة
);

async function updateEquipmentData(req, res) {
  try {
    const equipment_img_file = req.files["equipments_img"]
      ? req.files["equipments_img"][0]
      : null;

    const {
      equipments_id,
      equipments_nameEn,
      equipments_nameAr,
      equipments_price,
      equipments_url
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldEquipmentData = await getData("equipments", "equipments_id = ?", [
      equipments_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_equipments_img =
      oldEquipmentData &&
      oldEquipmentData.status === "success" &&
      oldEquipmentData.data
        ? oldEquipmentData.data.equipments_img
        : null;

    let equipments_img_path = old_equipments_img || "img.png"; // الافتراضي

    if (equipment_img_file) {
      const newFileName = equipment_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_equipments_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_equipments_img && old_equipments_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/equipments/equipmentImages/images",
            old_equipments_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        equipments_img_path = newFileName;
      }
    }

    const updateEquipmentData = {
      equipments_nameEn:equipments_nameEn,
      equipments_nameAr:equipments_nameAr,
      equipments_img: equipments_img_path,
      equipments_price:equipments_price,
      equipments_url:equipments_url
    };

    const result = await updateData(
      "equipments",
      updateEquipmentData,
      "equipments_id = ?",
      [equipments_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Equipment data updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update equipment data.",
      });
    }
  } catch (error) {
    console.error("Error updating equipment data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating equipment data.",
    });
  }
}

// تصدير الدالة
module.exports = { updateEquipmentData };
