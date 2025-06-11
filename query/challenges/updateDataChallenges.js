const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/challenges/challengesImages/images",
  [{ name: "challenges_img", maxCount: 1 }]
);

async function updateDataChallenges(req, res) {
  try {
    const challenges_img_file = req.files["challenges_img"]
      ? req.files["challenges_img"][0]
      : null;

    const {
      challenges_id,
      challenges_name,
      challenges_num_joined,
      challenges_price,
      challenges_num_days,
      challenges_about,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldChallengesData = await getData("challenges", "challenges_id = ?", [
      challenges_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_challenges_img =
      oldChallengesData && oldChallengesData.status === "success" && oldChallengesData.data
        ? oldChallengesData.data.challenges_img
        : null;

    let challenges_img_path = old_challenges_img || "img.png"; // الافتراضي

    if (challenges_img_file) {
      const newFileName = challenges_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_challenges_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_challenges_img && old_challenges_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/challenges/challengesImages/images",
            old_challenges_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        challenges_img_path = newFileName;
      }
    }

    const updateChallengesData = {
      challenges_name: challenges_name,
      challenges_num_joined: challenges_num_joined,
      challenges_price: challenges_price,
      challenges_num_days: challenges_num_days,
      challenges_img: challenges_img_path,
      challenges_about:challenges_about
    };

    const result = await updateData(
      "challenges",
      updateChallengesData,
      "challenges_id = ?",
      [challenges_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Challenge data updated successfully.",
        data: {
          challenges_id,
          ...updateChallengesData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update challenge data.",
      });
    }
  } catch (error) {
    console.error("Error updating challenge data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating challenge data",
    });
  }
}

module.exports = { updateDataChallenges, uploadImages }; 