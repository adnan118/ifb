const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataRestNight(req, res) {
  try {
    const { restnight_id } = req.body;
    
    // الحصول على معلومات الراحة الليلية قبل حذفها
    const restnightData = await getData("restnight", "restnight_id = ?", [restnight_id]);
    
    if (restnightData.status === "success" && restnightData.data) {
      // حذف الصورة إذا كانت موجودة
      if (restnightData.data.restnight_img && restnightData.data.restnight_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/restnight/restnightImages/images",
          restnightData.data.restnight_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("restnight", "restnight_id = ?", [
      restnight_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Rest night and associated images deleted successfully.",
        restnight_id: restnight_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Rest night not found or no changes made.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataRestNight }; 