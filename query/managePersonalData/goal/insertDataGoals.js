const {
  insertData,
  handleImageUpload} = require("../../../controllers/functions");
 // دالة لرفع الصور    
 const uploadImages = handleImageUpload(
   "query/managePersonalData/goal/goalImages",
   [{ name: "goal_img", maxCount: 1 }]
 );
// دالة لادخال بيانات التسجيل  
async function insertDataGoals(req, res) {
  try {
     const goal_img_file = req.files["goal_img"]
       ? req.files["goal_img"][0]
       : null;

    
    
    const { goal_titleEn, goal_titleAr, goal_subtitleEn, goal_subtitleAr } =
      req.body;

    // تحديد مسارات الصور بناءً على الملفات المرفوعة
    const goal_img_path = goal_img_file
      ? goal_img_file.filename
      : req.body.goal_img || "img.svg";

    // إدخال البيانات في قاعدة البيانات
    const insertGoalsData = {
      goal_titleEn: goal_titleEn,
      goal_titleAr: goal_titleAr,
      goal_subtitleEn: goal_subtitleEn,
      goal_subtitleAr: goal_subtitleAr,
      goal_img: goal_img_path,
    };

    const result = await insertData("goals", insertGoalsData);

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
// تصدير الدالة
module.exports = { insertDataGoals,uploadImages };