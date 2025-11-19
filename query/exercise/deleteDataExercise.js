const {
  deleteData,
  handleImageDeletion,
  handleVideoDeletion,
  getData
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/exercise/exerciseFiles/images",
  "exercise",
  "exercise_id",
  ["exercise_img"]
);

// دالة لحذف الفيديو
const deleteVideos = handleVideoDeletion(
  "query/exercise/exerciseFiles/videos",
  "exercise",
  "exercise_id",
  ["exercise_video"]
);

async function deleteDataExercise(req, res) {
  try {
    const { exercise_id } = req.body;
    
    // الحصول على معلومات التمرين قبل حذفه
    const exerciseData = await getData("exercise", "exercise_id = ?", [exercise_id]);
    
    if (exerciseData.status === "success" && exerciseData.data) {
      // حذف الصورة إذا كانت موجودة
      if (exerciseData.data.exercise_img && exerciseData.data.exercise_img !== "img.png") {
        const imagePath = path.join(process.cwd(), "query/exercise/exerciseFiles/images", exerciseData.data.exercise_img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // حذف الفيديو إذا كان موجوداً
      if (exerciseData.data.exercise_video) {
        const videoPath = path.join(process.cwd(), "query/exercise/exerciseFiles/videos", exerciseData.data.exercise_video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
    }
   
    const result = await deleteData("exercise", "exercise_id = ?", [exercise_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Exercise and associated files deleted successfully.",
        exercise_id: exercise_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Exercise not found or no changes made.",
      });
    }

  } catch (error) {
    console.error("Error deleting exercise data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting exercise data",
    });
  }
}

module.exports = { deleteDataExercise, deleteImages, deleteVideos }; 