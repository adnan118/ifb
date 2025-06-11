const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataDietType(req, res) {
  try {
    const { diettype_id } = req.body;
    
    // الحصول على معلومات نوع النظام الغذائي قبل حذفها
    const diettypeData = await getData("diettype", "diettype_id = ?", [diettype_id]);
    
    if (diettypeData.status === "success" && diettypeData.data) {
      // حذف الصورة إذا كانت موجودة
      if (diettypeData.data.diettype_img && diettypeData.data.diettype_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/diettype/diettypeImages/images",
          diettypeData.data.diettype_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("diettype", "diettype_id = ?", [
      diettype_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Diet type and associated images deleted successfully.",
        data: {
          diettype_id,
          ...diettypeData.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete diet type data.",
      });
    }
  } catch (error) {
    console.error("Error deleting diet type data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting diet type data",
    });
  }
}

module.exports = { deleteDataDietType }; 