const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/badhabits/badhabitsImages/images",
  [{ name: "badHabits_img", maxCount: 1 }]
);

async function updateDataBadHabits(req, res) {
  try {
    const badHabits_img_file = req.files["badHabits_img"]
      ? req.files["badHabits_img"][0]
      : null;

    const {
      badHabits_id,
      badHabits_titleEn,
      badHabits_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldBadHabitsData = await getData("badhabits", "badHabits_id = ?", [
      badHabits_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_badHabits_img =
      oldBadHabitsData && oldBadHabitsData.status === "success" && oldBadHabitsData.data
        ? oldBadHabitsData.data.badHabits_img
        : null;

    let badHabits_img_path = old_badHabits_img || "img.svg"; // الافتراضي

    if (badHabits_img_file) {
      const newFileName = badHabits_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_badHabits_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_badHabits_img && old_badHabits_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/badhabits/badhabitsImages/images",
            old_badHabits_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        badHabits_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateBadHabitsData = {
      badHabits_titleEn: badHabits_titleEn,
      badHabits_titleAr: badHabits_titleAr,
      badHabits_img: badHabits_img_path,
    };

    const result = await updateData(
      "badhabits",
      updateBadHabitsData,
      "badHabits_id = ?",
      [badHabits_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Bad habits data updated successfully.",
        data: {
          badHabits_id,
          ...updateBadHabitsData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update bad habits data.",
      });
    }
  } catch (error) {
    console.error("Error updating bad habits data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating bad habits data",
    });
  }
}

module.exports = { updateDataBadHabits, uploadImages }; 