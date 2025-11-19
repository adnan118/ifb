const { insertData, handleImageUpload } = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/areasattention/areasattentionImages",
  [{ name: "areasattention_img", maxCount: 1 }]
);

async function insertDataAreasAttention(req, res) {
  try {
    const areasattention_img_file = req.files["areasattention_img"]
      ? req.files["areasattention_img"][0]
      : null;

    const { areasattention_gender_id, areasattention_titleEn, areasattention_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const areasattention_img_path = areasattention_img_file
      ? areasattention_img_file.filename
      : req.body.areasattention_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertAreasAttentionData = {
      areasattention_gender_id: areasattention_gender_id,
      areasattention_titleEn: areasattention_titleEn,
      areasattention_titleAr: areasattention_titleAr,
      areasattention_img: areasattention_img_path,
    };

    const result = await insertData("areasattention", insertAreasAttentionData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Areas of attention data inserted successfully.",
        data: insertAreasAttentionData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert areas of attention data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting areas of attention data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting areas of attention data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataAreasAttention }; 