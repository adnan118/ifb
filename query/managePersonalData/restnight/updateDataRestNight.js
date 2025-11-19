const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/restnight/restnightImages/images",
  [{ name: "restnight_img", maxCount: 1 }]
);

async function updateDataRestNight(req, res) {
  try {
    const restnight_img_file = req.files["restnight_img"]
      ? req.files["restnight_img"][0]
      : null;

    const {
      restnight_id,
      restnight_titleEn,
      restnight_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldRestNightData = await getData("restnight", "restnight_id = ?", [
      restnight_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_restnight_img =
      oldRestNightData && oldRestNightData.status === "success" && oldRestNightData.data
        ? oldRestNightData.data.restnight_img
        : null;

    let restnight_img_path = old_restnight_img || "img.svg"; // الافتراضي

    if (restnight_img_file) {
      const newFileName = restnight_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_restnight_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_restnight_img && old_restnight_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/restnight/restnightImages/images",
            old_restnight_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        restnight_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateRestNightData = {
      restnight_titleEn,
      restnight_titleAr,
      restnight_img: restnight_img_path,
    };

    const result = await updateData(
      "restnight",
      updateRestNightData,
      "restnight_id = ?",
      [restnight_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Update data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataRestNight, uploadImages }; 