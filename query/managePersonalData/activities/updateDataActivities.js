const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/activities/activitiesImages/images",
  [{ name: "activities_img", maxCount: 1 }]
);

async function updateDataActivities(req, res) {
  try {
    const activities_img_file = req.files["activities_img"]
      ? req.files["activities_img"][0]
      : null;

    const {
      activities_id,
      activities_titleEn,
      activities_titleAr,
      activities_subtitleEn,
      activities_subtitleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldActivitiesData = await getData("activities", "activities_id = ?", [
      activities_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_activities_img =
      oldActivitiesData && oldActivitiesData.status === "success" && oldActivitiesData.data
        ? oldActivitiesData.data.activities_img
        : null;

    let activities_img_path = old_activities_img || "img.svg"; // الافتراضي

    if (activities_img_file) {
      const newFileName = activities_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_activities_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_activities_img && old_activities_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/activities/activitiesImages/images",
            old_activities_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        activities_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateActivitiesData = {
      activities_titleEn: activities_titleEn,
      activities_titleAr: activities_titleAr,
      activities_subtitleEn: activities_subtitleEn,
      activities_subtitleAr: activities_subtitleAr,
      activities_img: activities_img_path,
    };

    const result = await updateData(
      "activities",
      updateActivitiesData,
      "activities_id = ?",
      [activities_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Activities data updated successfully.",
        data: {
          activities_id,
          ...updateActivitiesData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update activities data.",
      });
    }
  } catch (error) {
    console.error("Error updating activities data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating activities data",
    });
  }
}

module.exports = { updateDataActivities, uploadImages }; 