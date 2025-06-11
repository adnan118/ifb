const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataEnergyLevels(req, res) {
  try {
    const { energylevels_id } = req.body;
    
    // الحصول على معلومات مستوى الطاقة قبل حذفها
    const energylevelsData = await getData("energylevels", "energylevels_id = ?", [energylevels_id]);
    
    if (energylevelsData.status === "success" && energylevelsData.data) {
      // حذف الصورة إذا كانت موجودة
      if (energylevelsData.data.energylevels_img && energylevelsData.data.energylevels_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/energylevels/energylevelsImages/images",
          energylevelsData.data.energylevels_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("energylevels", "energylevels_id = ?", [
      energylevels_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Energy levels and associated images deleted successfully.",
        data: {
          energylevels_id,
          ...energylevelsData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete energy levels data.",
      });
    }
  } catch (error) {
    console.error("Error deleting energy levels data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting energy levels data",
    });
  }
}

module.exports = { deleteDataEnergyLevels }; 