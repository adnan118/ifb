const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/physicallyactive/physicallyactiveImages",
  [{ name: "physicallyactive_img", maxCount: 1 }]
);

async function insertDataPhysicallyActive(req, res) {
  try {
    const physicallyactive_img_file = req.files["physicallyactive_img"]
      ? req.files["physicallyactive_img"][0]
      : null;

    const { physicallyactive_titleEn, physicallyactive_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const physicallyactive_img_path = physicallyactive_img_file
      ? physicallyactive_img_file.filename
      : req.body.physicallyactive_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertPhysicallyActiveData = {
      physicallyactive_titleEn,
      physicallyactive_titleAr,
      physicallyactive_img: physicallyactive_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("physicallyactive", insertPhysicallyActiveData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Insert data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting data",
    });
  }
}

// تصدير الدوال
module.exports = { insertDataPhysicallyActive, uploadImages }; 