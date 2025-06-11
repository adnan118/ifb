const {
  updateData,
  handleImageUpload,
  handleImageDeletion,
  getData,
} = require("../../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصورة
const uploadImages = handleImageUpload(
  "query/managePersonalData/typicalday/typicaldayImages/images",
  [{ name: "typicalday_img", maxCount: 1 }]
);

// دالة لحذف الصور
const deleteImages = handleImageDeletion(
  "query/managePersonalData/typicalday/typicaldayImages/images", // مسار الصور
  "typicalday", // اسم الجدول
  "typicalday_id", // حقل المعرف
  "typicalday_img" // حقل صورة
);

async function updateDataTypicalDay(req, res) {
  try {
    const typicalday_img_file = req.files["typicalday_img"]
      ? req.files["typicalday_img"][0]
      : null;

    const {
      typicalday_id,
      typicalday_titleEn,
      typicalday_titleAr, 
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldTypicalDayData = await getData("typicalday", "typicalday_id = ?", [
      typicalday_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_typicalday_img =
      oldTypicalDayData && oldTypicalDayData.status === "success" && oldTypicalDayData.data
        ? oldTypicalDayData.data.typicalday_img
        : null;

    let typicalday_img_path = old_typicalday_img || "img.svg"; // الافتراضي

    if (typicalday_img_file) {
      const newFileName = typicalday_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_typicalday_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_typicalday_img && old_typicalday_img !== "img.svg") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/managePersonalData/typicalday/typicaldayImages/images",
            old_typicalday_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        typicalday_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    // تحديث البيانات
    const updateTypicalDayData = {
      typicalday_titleEn: typicalday_titleEn,
      typicalday_titleAr: typicalday_titleAr,
      typicalday_img: typicalday_img_path,
    };

    const result = await updateData(
      "typicalday",
      updateTypicalDayData,
      "typicalday_id = ?",
      [typicalday_id]
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
module.exports = { updateDataTypicalDay };
