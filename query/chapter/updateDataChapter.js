const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload("query/chapter/chapterImages/images", [
  { name: "chapter_img", maxCount: 1 },
]);

async function updateDataChapter(req, res) {
  try {
    const chapter_img_file = req.files["chapter_img"]
      ? req.files["chapter_img"][0]
      : null;

    const { chapter_id, chapter_textEn, chapter_textAr } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldChapterData = await getData("chapter", "chapter_id = ?", [
      chapter_id,
    ]);

    // استخرج الصورة القديمة إن وجدت
    const old_chapter_img =
      oldChapterData &&
      oldChapterData.status === "success" &&
      oldChapterData.data
        ? oldChapterData.data.chapter_img
        : null;

    let chapter_img_path = old_chapter_img || "img.png"; // الافتراضي

    if (chapter_img_file) {
      const newFileName = chapter_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_chapter_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_chapter_img && old_chapter_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/chapter/chapterImages/images",
            old_chapter_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        chapter_img_path = newFileName;
      }
    }

    const updateChapterData = {
      chapter_textEn: chapter_textEn,
      chapter_textAr: chapter_textAr,
      chapter_img: chapter_img_path,
    };

    const result = await updateData(
      "chapter",
      updateChapterData,
      "chapter_id = ?",
      [chapter_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Chapter data updated successfully.",
        data: {
          chapter_id,
          ...updateChapterData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update chapter data.",
      });
    }
  } catch (error) {
    console.error("Error updating chapter data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating chapter data",
    });
  }
}

module.exports = { updateDataChapter, uploadImages };
