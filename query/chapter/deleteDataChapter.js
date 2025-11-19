const { deleteData, getData } = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataChapter(req, res) {
  try {
    const { chapter_id } = req.body;

    // الحصول على معلومات الفصل قبل حذفه
    const chapterData = await getData("chapter", "chapter_id = ?", [
      chapter_id,
    ]);

    if (chapterData.status === "success" && chapterData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        chapterData.data.chapter_img &&
        chapterData.data.chapter_img !== "img.png"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/chapter/chapterImages/images",
          chapterData.data.chapter_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // حذف الفصل من قاعدة البيانات
    const result = await deleteData("chapter", "chapter_id = ?", [chapter_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Chapter and associated image deleted successfully.",
        data: {
          chapter_id,
          ...chapterData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete chapter data.",
      });
    }
  } catch (error) {
    console.error("Error deleting chapter data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting chapter data",
    });
  }
}

module.exports = { deleteDataChapter };
