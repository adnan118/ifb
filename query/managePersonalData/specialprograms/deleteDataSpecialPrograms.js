const {
  deleteData,
  getData
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataSpecialPrograms(req, res) {
  try {
    const { specialPrograms_id } = req.body;
    
    // الحصول على معلومات البرنامج الخاص قبل حذفه
    const specialProgramsData = await getData("specialprograms", "specialPrograms_id = ?", [specialPrograms_id]);
    
    if (specialProgramsData.status === "success" && specialProgramsData.data) {
      // حذف الصورة إذا كانت موجودة
      if (specialProgramsData.data.specialPrograms_img && specialProgramsData.data.specialPrograms_img !== "img.svg") {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/specialprograms/specialprogramsImages/images",
          specialProgramsData.data.specialPrograms_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("specialprograms", "specialPrograms_id = ?", [
      specialPrograms_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Special program and associated images deleted successfully.",
        specialPrograms_id: specialPrograms_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Special program not found or no changes made.",
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
module.exports = { deleteDataSpecialPrograms }; 