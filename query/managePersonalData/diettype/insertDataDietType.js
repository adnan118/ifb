const { insertData, handleImageUpload } = require("../../../controllers/functions");

 
// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/diettype/diettypeImages",
  [{ name: "diettype_img", maxCount: 1 }]
);
const insertDataDietType = async (req, res) => {
  try {

    const diettype_img_file = req.files["diettype_img"]
      ? req.files["diettype_img"][0]
      : null;

  
      const { diettype_titleEn, diettype_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const diettype_img_path = diettype_img_file
      ? diettype_img_file.filename
      : req.body.diettype_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertDietTypeData = {
      diettype_titleEn: diettype_titleEn,
      diettype_titleAr: diettype_titleAr,
      diettype_img: diettype_img_path,
    };


 
    const result = await insertData("diettype", insertDietTypeData);

    

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Diet Type data inserted successfully.",
        data: insertDietTypeData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert Diet Type data.",
      });
    }




  } catch (error) {
    console.error("Error in inserting  Diet Type data:", error);
    res.status(500).json({
      success: false,
      message: "There is a problem inserting  Diet Type data",
      error: error.message,
    });

   


  }
};

module.exports = {
  uploadImages,
  insertDataDietType,
}; 