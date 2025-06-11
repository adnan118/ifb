const { insertData, handleImageUpload } = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/bodytype/bodytypeImages",
  [{ name: "bodyType_img", maxCount: 1 }]
);

async function insertDataBodyType(req, res) {
  try {
    const bodyType_img_file = req.files["bodyType_img"]
      ? req.files["bodyType_img"][0]
      : null;

    const { bodyType_gender_id, bodyType_titleEn, bodyType_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const bodyType_img_path = bodyType_img_file
      ? bodyType_img_file.filename
      : req.body.bodyType_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertBodyTypeData = {
      bodyType_gender_id: bodyType_gender_id,
      bodyType_titleEn: bodyType_titleEn,
      bodyType_titleAr: bodyType_titleAr,
      bodyType_img: bodyType_img_path,
    };

    const result = await insertData("bodytype", insertBodyTypeData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Body type data inserted successfully.",
        data: insertBodyTypeData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert body type data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting body type data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting body type data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataBodyType }; 