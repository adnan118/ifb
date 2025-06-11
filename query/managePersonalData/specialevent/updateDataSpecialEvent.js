const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/managePersonalData/specialevent/specialeventImages/images",
  [{ name: "specialevent_img", maxCount: 1 }]
);

async function updateDataSpecialEvent(req, res) {
  try {
    const specialevent_img_file = req.files["specialevent_img"]
      ? req.files["specialevent_img"][0]
      : null;

    const {
      specialevent_id,
      specialevent_titleEn,
      specialevent_titleAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldSpecialEventData = await getData("specialevent", "specialevent_id = ?", [
      specialevent_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_specialevent_img =
      oldSpecialEventData && oldSpecialEventData.status === "success" && oldSpecialEventData.data
        ? oldSpecialEventData.data.specialevent_img
        : null;

    let specialevent_img_path = old_specialevent_img || "img.svg"; // الافتراضي

    if (specialevent_img_file) {
      const newFileName = specialevent_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_specialevent_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_specialevent_img && old_specialevent_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/specialevent/specialeventImages/images",
            old_specialevent_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        specialevent_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateSpecialEventData = {
      specialevent_titleEn,
      specialevent_titleAr,
      specialevent_img: specialevent_img_path,
    };

    const result = await updateData(
      "specialevent",
      updateSpecialEventData,
      "specialevent_id = ?",
      [specialevent_id]
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
module.exports = { updateDataSpecialEvent, uploadImages }; 