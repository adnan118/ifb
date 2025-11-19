const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataActivities(req, res) {
  try {
    const { activities_id } = req.body;
    
    // الحصول على معلومات النشاطات قبل حذفها
    const activitiesData = await getData("activities", "activities_id = ?", [activities_id]);
    
    if (activitiesData.status === "success" && activitiesData.data) {
      // حذف الصورة إذا كانت موجودة
      if (activitiesData.data.activities_img && activitiesData.data.activities_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/activities/activitiesImages/images",
          activitiesData.data.activities_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("activities", "activities_id = ?", [
      activities_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Activities and associated images deleted successfully.",
        data: {
          activities_id,
          ...activitiesData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete activities data.",
      });
    }
  } catch (error) {
    console.error("Error deleting activities data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting activities data",
    });
  }
}

module.exports = { deleteDataActivities }; 