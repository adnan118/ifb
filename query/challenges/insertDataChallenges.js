const { insertData, handleImageUpload } = require("../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/challenges/challengesImages",
  [{ name: "challenges_img", maxCount: 1 }]
);

async function insertDataChallenges(req, res) {
  try {
    const challenges_img_file = req.files["challenges_img"]
      ? req.files["challenges_img"][0]
      : null;

    const {
      challenges_name,
      challenges_num_joined,
      challenges_price,
      challenges_num_days,
      challenges_about
    } = req.body;

    // تحديد مسار الصورة المرفوعة
    const challenges_img_path = challenges_img_file
      ? challenges_img_file.filename
      : req.body.challenges_img || "img.png";

    // إعداد بيانات الإدخال
    const insertChallengesData = {
      challenges_name: challenges_name,
      challenges_num_joined: challenges_num_joined,
      challenges_price: challenges_price,
      challenges_num_days: challenges_num_days,
      challenges_img: challenges_img_path,
      challenges_about: challenges_about,
    };

    const result = await insertData("challenges", insertChallengesData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Challenge data inserted successfully.",
        data: insertChallengesData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert challenge data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting challenge data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting challenge data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataChallenges }; 