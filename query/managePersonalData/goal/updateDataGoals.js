const {
  updateData,
  handleImageUpload,
  handleImageDeletion,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/goal/goalImages/images",
  [{ name: "goal_img", maxCount: 1 }]
);
 
// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/managePersonalData/goal/goalImages/images", // مسار الصور
  "goals", // اسم الجدول
  "goal_id", // حقل المعرف
  "goal_img" // حقل صورة
);
 
async function updateDataGoals(req, res) {
  try {
    const goal_img_file = req.files["goal_img"]
      ? req.files["goal_img"][0]
      : null;

    const {
      goal_id,
      goal_titleEn,
      goal_titleAr,
      goal_subtitleEn,
      goal_subtitleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldGoalData = await getData("goals", "goal_id = ?", [goal_id]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_goal_img =
      oldGoalData && oldGoalData.status === "success" && oldGoalData.data
        ? oldGoalData.data.goal_img
        : null;
    
    let goal_img_path = old_goal_img || "img.svg"; // الافتراضي

    if (goal_img_file) {
      const newFileName = goal_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_goal_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_goal_img && old_goal_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/goal/goalImages/images",
            old_goal_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        goal_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateGoalsData = {
      goal_titleEn,
      goal_titleAr,
      goal_subtitleEn,
      goal_subtitleAr,
      goal_img: goal_img_path,
    };

    const result = await updateData("goals", updateGoalsData, "goal_id = ?", [
      goal_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Update data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating data",
    });
  }
}
// تصدير الدالة
module.exports = { updateDataGoals };
