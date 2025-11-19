const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataDailyWater(req, res) {
  try {
    const { dailywater_id } = req.body;
    
    // الحصول على معلومات الماء اليومي قبل حذفها
    const dailywaterData = await getData("dailywater", "dailywater_id = ?", [dailywater_id]);
    
    if (dailywaterData.status === "success" && dailywaterData.data) {
      // حذف الصورة إذا كانت موجودة
      if (dailywaterData.data.dailywater_img && dailywaterData.data.dailywater_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/dailywater/dailywaterImages/images",
          dailywaterData.data.dailywater_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("dailywater", "dailywater_id = ?", [
      dailywater_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Daily water and associated images deleted successfully.",
        data: {
          dailywater_id,
          ...dailywaterData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete daily water data.",
      });
    }
  } catch (error) {
    console.error("Error deleting daily water data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting daily water data",
    });
  }
}

module.exports = { deleteDataDailyWater }; 