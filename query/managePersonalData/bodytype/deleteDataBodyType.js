const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataBodyType(req, res) {
  try {
    const { bodyType_id } = req.body;
    
    // الحصول على معلومات نوع الجسم قبل حذفها
    const bodyTypeData = await getData("bodytype", "bodyType_id = ?", [bodyType_id]);
    
    if (bodyTypeData.status === "success" && bodyTypeData.data) {
      // حذف الصورة إذا كانت موجودة
      if (bodyTypeData.data.bodyType_img && bodyTypeData.data.bodyType_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/bodytype/bodytypeImages/images",
          bodyTypeData.data.bodyType_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("bodytype", "bodyType_id = ?", [
      bodyType_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Body type and associated images deleted successfully.",
        data: {
          bodyType_id,
          ...bodyTypeData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete body type data.",
      });
    }
  } catch (error) {
    console.error("Error deleting body type data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting body type data",
    });
  }
}

module.exports = { deleteDataBodyType }; 