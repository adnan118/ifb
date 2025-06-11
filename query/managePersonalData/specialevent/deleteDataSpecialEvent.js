const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataSpecialEvent(req, res) {
  try {
    const { specialevent_id } = req.body;
    
    // الحصول على معلومات الفعالية الخاصة قبل حذفها
    const specialeventData = await getData("specialevent", "specialevent_id = ?", [specialevent_id]);
    
    if (specialeventData.status === "success" && specialeventData.data) {
      // حذف الصورة إذا كانت موجودة
      if (specialeventData.data.specialevent_img && specialeventData.data.specialevent_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/specialevent/specialeventImages/images",
          specialeventData.data.specialevent_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("specialevent", "specialevent_id = ?", [
      specialevent_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Special event and associated images deleted successfully.",
        specialevent_id: specialevent_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Special event not found or no changes made.",
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
module.exports = { deleteDataSpecialEvent }; 