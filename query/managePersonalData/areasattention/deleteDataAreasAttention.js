const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataAreasAttention(req, res) {
  try {
    const { areasattention_id } = req.body;
    
    // الحصول على معلومات مناطق الاهتمام قبل حذفها
    const areasAttentionData = await getData("areasattention", "areasattention_id = ?", [areasattention_id]);
    
    if (areasAttentionData.status === "success" && areasAttentionData.data) {
      // حذف الصورة إذا كانت موجودة
      if (areasAttentionData.data.areasattention_img && areasAttentionData.data.areasattention_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/areasattention/areasattentionImages/images",
          areasAttentionData.data.areasattention_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("areasattention", "areasattention_id = ?", [
      areasattention_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Areas of attention and associated images deleted successfully.",
        data: {
          areasattention_id,
          ...areasAttentionData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete areas of attention data.",
      });
    }
  } catch (error) {
    console.error("Error deleting areas of attention data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting areas of attention data",
    });
  }
}

module.exports = { deleteDataAreasAttention }; 