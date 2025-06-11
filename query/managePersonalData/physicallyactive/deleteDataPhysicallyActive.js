const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataPhysicallyActive(req, res) {
  try {
    const { physicallyactive_id } = req.body;
    
    // الحصول على معلومات النشاط البدني قبل حذفها
    const physicallyactiveData = await getData("physicallyactive", "physicallyactive_id = ?", [physicallyactive_id]);
    
    if (physicallyactiveData.status === "success" && physicallyactiveData.data) {
      // حذف الصورة إذا كانت موجودة
      if (physicallyactiveData.data.physicallyactive_img && physicallyactiveData.data.physicallyactive_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/physicallyactive/physicallyactiveImages/images",
          physicallyactiveData.data.physicallyactive_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("physicallyactive", "physicallyactive_id = ?", [
      physicallyactive_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Physically active and associated images deleted successfully.",
        physicallyactive_id: physicallyactive_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Physically active not found or no changes made.",
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
module.exports = { deleteDataPhysicallyActive }; 