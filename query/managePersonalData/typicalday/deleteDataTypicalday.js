const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف بيانات اليوم النموذجية
async function deleteDataTypicalDay(req, res) {
  try {
    const { typicalday_id } = req.body;
    
    // الحصول على معلومات اليوم النموذجي قبل حذفه
    const typicaldayData = await getData("typicalday", "typicalday_id = ?", [typicalday_id]);
    
    if (typicaldayData.status === "success" && typicaldayData.data) {
      // حذف الصورة إذا كانت موجودة
      if (typicaldayData.data.typicalday_img && typicaldayData.data.typicalday_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/typicalday/typicaldayImages/images",
          typicaldayData.data.typicalday_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("typicalday", "typicalday_id = ?", [
      typicalday_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Typical day and associated images deleted successfully.",
        typicalday_id: typicalday_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Typical day not found or no changes made.",
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
module.exports = { deleteDataTypicalDay };
