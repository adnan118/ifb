const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataBadHabits(req, res) {
  try {
    const { badHabits_id } = req.body;
    
    // الحصول على معلومات العادات السيئة قبل حذفها
    const badHabitsData = await getData("badhabits", "badHabits_id = ?", [badHabits_id]);
    
    if (badHabitsData.status === "success" && badHabitsData.data) {
      // حذف الصورة إذا كانت موجودة
      if (badHabitsData.data.badHabits_img && badHabitsData.data.badHabits_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/badhabits/badhabitsImages/images",
          badHabitsData.data.badHabits_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("badhabits", "badHabits_id = ?", [
      badHabits_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Bad habits and associated images deleted successfully.",
        data: {
          badHabits_id,
          ...badHabitsData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete bad habits data.",
      });
    }
  } catch (error) {
    console.error("Error deleting bad habits data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting bad habits data",
    });
  }
}

module.exports = { deleteDataBadHabits }; 