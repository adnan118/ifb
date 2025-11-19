const {
  deleteData,
  handleImageDeletion,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لحذف الصور الخاصة بجنر
const deleteImages = handleImageDeletion(
  "query/managePersonalData/gender/genderImages", // مسار الصور الخاص بجنسية
  "gender", // اسم جدول الجنس
  "gender_id", // حقل المعرف
  "gender_img" // حقل صورة الجنس
);

// دالة لحذف بيانات الجنس
async function deleteDataGender(req, res) {
  try {
    const { gender_id } = req.body;

    // الحصول على معلومات الجنس قبل حذفه
    const genderData = await getData("gender", "gender_id = ?", [gender_id]);

    if (genderData.status === "success" && genderData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        genderData.data.gender_img &&
        genderData.data.gender_img !== "img.svg"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/managePersonalData/gender/genderImages/images",
          genderData.data.gender_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("gender", "gender_id = ?", [gender_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Gender and associated images deleted successfully.",
        gender_id: gender_id,
      });
    } else {
      res.json({
        status: "failure",
        message: "Gender not found or no changes made.",
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
module.exports = { deleteDataGender, deleteImages };
