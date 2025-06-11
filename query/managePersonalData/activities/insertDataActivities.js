const { insertData, handleImageUpload } = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/activities/activitiesImages",
  [{ name: "activities_img", maxCount: 1 }]
);

async function insertDataActivities(req, res) {
  try {
    const activities_img_file = req.files["activities_img"]
      ? req.files["activities_img"][0]
      : null;

    const { 
      activities_titleEn, 
      activities_titleAr,
      activities_subtitleEn,
      activities_subtitleAr 
    } = req.body;

    // تحديد مسار الصورة المرفوعة
    const activities_img_path = activities_img_file
      ? activities_img_file.filename
      : req.body.activities_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertActivitiesData = {
      activities_titleEn: activities_titleEn,
      activities_titleAr: activities_titleAr,
      activities_subtitleEn: activities_subtitleEn,
      activities_subtitleAr: activities_subtitleAr,
      activities_img: activities_img_path,
    };

    const result = await insertData("activities", insertActivitiesData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Activities data inserted successfully.",
        data: insertActivitiesData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert activities data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting activities data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting activities data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataActivities }; 