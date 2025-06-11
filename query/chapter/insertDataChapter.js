const {
  insertData,
  handleImageUpload,
} = require("../../controllers/functions");

// دالة لرفع الصور للشابتر
const uploadImages = handleImageUpload(
  "query/chapter/chapterImages", // تغيير المسار ليكون خاص بالشابتر
  [{ name: "chapter_img", maxCount: 1 }] // تغيير اسم الحقل ليكون chapter_img
);

async function insertDataChapter(req, res) {
  try {
    const chapter_img_file = req.files["chapter_img"]
      ? req.files["chapter_img"][0]
      : null;

    const {   chapter_text } = req.body;

    // تحديد مسار الصورة المرفوعة
    const chapter_img_path = chapter_img_file
      ? chapter_img_file.filename
      : req.body.chapter_img || "img.png";

    // إعداد بيانات الإدخال
    const insertChapterData = { 
      chapter_img: chapter_img_path,
      chapter_text: chapter_text,
    };

    const result = await insertData("chapter", insertChapterData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Chapter data inserted successfully.",
        data: insertChapterData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert chapter data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting chapter data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting chapter data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataChapter };
