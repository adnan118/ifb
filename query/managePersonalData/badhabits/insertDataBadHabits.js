const { insertData, handleImageUpload } = require("../../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/badhabits/badhabitsImages",
  [{ name: "badHabits_img", maxCount: 1 }]
);

async function insertDataBadHabits(req, res) {
  try {
    const badHabits_img_file = req.files["badHabits_img"]
      ? req.files["badHabits_img"][0]
      : null;

    const { badHabits_titleEn, badHabits_titleAr } = req.body;

    // تحديد مسار الصورة المرفوعة
    const badHabits_img_path = badHabits_img_file
      ? badHabits_img_file.filename
      : req.body.badHabits_img || "img.svg";

    // إعداد بيانات الإدخال
    const insertBadHabitsData = {
      badHabits_titleEn: badHabits_titleEn,
      badHabits_titleAr: badHabits_titleAr,
      badHabits_img: badHabits_img_path,
    };

    const result = await insertData("badhabits", insertBadHabitsData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Bad habits data inserted successfully.",
        data: insertBadHabitsData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert bad habits data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting bad habits data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting bad habits data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataBadHabits }; 