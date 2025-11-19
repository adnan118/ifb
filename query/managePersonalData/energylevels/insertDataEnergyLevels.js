const {
  insertData,
  handleImageUpload
} = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/energylevels/energylevelsImages",
  [{ name: "energylevels_img", maxCount: 1 }]
);

async function insertDataEnergyLevels(req, res) {
  try {
    const energylevels_img_file = req.files["energylevels_img"]
      ? req.files["energylevels_img"][0]
      : null;

    const { energylevels_titleEn, energylevels_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const energylevels_img_path = energylevels_img_file
      ? energylevels_img_file.filename
      : req.body.energylevels_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertEnergyLevelsData = {
      energylevels_titleEn: energylevels_titleEn,
      energylevels_titleAr: energylevels_titleAr,
      energylevels_img: energylevels_img_path,
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData(
      "energylevels",
      insertEnergyLevelsData
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Energy levels data inserted successfully.",
        data: insertEnergyLevelsData
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert energy levels data.",
      });
    }
  } catch (error) {
    console.error("Error inserting energy levels data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting energy levels data",
    });
  }
}

module.exports = { insertDataEnergyLevels, uploadImages }; 