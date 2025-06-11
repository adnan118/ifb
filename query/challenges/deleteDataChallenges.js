const {
  deleteData,
  getData
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataChallenges(req, res) {
  try {
    const { challenges_id } = req.body;

    // الحصول على معلومات  قبل حذفها
    const challengesData = await getData("challenges", "challenges_id = ?", [
      challenges_id,
    ]);

    if (challengesData.status === "success" && challengesData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        challengesData.data.challenges_img &&
        challengesData.data.challenges_img !== "img.png"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/challenges/challengesImages/images",
          challengesData.data.challenges_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("challenges", "challenges_id = ?", [
      challenges_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Challenge and associated images deleted successfully.",
        data: {
          challenges_id,
          ...challengesData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete Challenge  data.",
      });
    }
  } catch (error) {
    console.error("Error deleting Challenge  data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting Challenge  data",
    });
  }
}

module.exports = { deleteDataChallenges }; 