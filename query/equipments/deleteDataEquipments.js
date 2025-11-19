const {
  deleteData,
  handleImageDeletion,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/equipments/equipmentImages/images", // مسار الصور
  "equipments", // اسم الجدول
  "equipments_id", // حقل المعرف
  "equipments_img" // حقل الصورة
);

// دالة لحذف بيانات المعدات
async function deleteEquipment(req, res) {
  try {
    const { equipments_id } = req.body;

    // الحصول على معلومات المعدات قبل حذفه
    const equipmentData = await getData("equipments", "equipments_id = ?", [
      equipments_id,
    ]);

    if (equipmentData.status === "success" && equipmentData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        equipmentData.data.equipments_img &&
        equipmentData.data.equipments_img !== "img.png"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/equipments/equipmentImages/images",
          equipmentData.data.equipments_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("equipments", "equipments_id = ?", [
      equipments_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Equipment and associated image deleted successfully.",
        equipments_id: equipments_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Equipment not found or no changes made.",
      });
    }
  } catch (error) {
    console.error("Error deleting equipment data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting equipment data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteEquipment  };
