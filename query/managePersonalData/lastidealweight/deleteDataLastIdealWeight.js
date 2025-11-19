const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataLastIdealWeight(req, res) {
  try {
    const { lastidealweight_id } = req.body;
    
    // الحصول على معلومات الوزن المثالي الأخير قبل حذفها
    const lastidealweightData = await getData("lastidealweight", "lastidealweight_id = ?", [lastidealweight_id]);
    
    if (lastidealweightData.status === "success" && lastidealweightData.data) {
      // حذف الصورة إذا كانت موجودة
      if (lastidealweightData.data.lastidealweight_img && lastidealweightData.data.lastidealweight_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/lastidealweight/lastidealweightImages/images",
          lastidealweightData.data.lastidealweight_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("lastidealweight", "lastidealweight_id = ?", [
      lastidealweight_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Last ideal weight and associated images deleted successfully.",
        data: {
          lastidealweight_id,
          ...lastidealweightData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete last ideal weight data.",
      });
    }
  } catch (error) {
    console.error("Error deleting last ideal weight data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting last ideal weight data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataLastIdealWeight }; 