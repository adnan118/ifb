const {
  insertData,
  handleImageUpload,
} = require("../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload("query/equipments/equipmentImages", [
  { name: "equipments_img", maxCount: 1 },
]);

// دالة لإضافة بيانات المعدات
async function insertEquipmentData(req, res) {
  try {
    const equipment_img_file = req.files["equipments_img"]
      ? req.files["equipments_img"][0]
      : null;

    const { equipments_nameEn, equipments_nameAr, equipments_price,equipments_url } = req.body;

    // تحديد مسارات الصور بناءً على الملفات المرفوعة
    const equipments_img_path = equipment_img_file
      ? equipment_img_file.filename
      : req.body.equipments_img || "img.png";

    // إنشاء البيانات للإدخال في قاعدة البيانات
    const insertEquipmentData = {
      equipments_nameEn: equipments_nameEn,
      equipments_nameAr: equipments_nameAr,
      equipments_img: equipments_img_path,
      equipments_price: equipments_price,
      equipments_url:equipments_url,
    };

    const result = await insertData("equipments", insertEquipmentData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Equipment data inserted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert equipment data.",
      });
    }
  } catch (error) {
    console.error("Error inserting equipment data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting equipment data.",
    });
  }
}

// تصدير الدوال
module.exports = { insertEquipmentData, uploadImages };
