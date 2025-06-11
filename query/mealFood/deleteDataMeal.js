const { deleteData, getData } = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataMeal(req, res) {
  try {
    const { mealFastFood_id } = req.body;

    // الحصول على معلومات الوجبة قبل حذفها
    const mealData = await getData("mealfastfood", "mealFastFood_id = ?", [
      mealFastFood_id,
    ]);

    if (mealData.status === "success" && mealData.data) {
      // حذف الصورة إذا كانت موجودة
      if (
        mealData.data.mealFastFood_img &&
        mealData.data.mealFastFood_img !== "img.png"
      ) {
        const imagePath = path.join(
          process.cwd(),
          "query/meal/mealImages/images",
          mealData.data.mealFastFood_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // حذف البيانات من الجدول
    const result = await deleteData("mealfastfood", "mealFastFood_id = ?", [
      mealFastFood_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Meal and associated image deleted successfully.",
        data: {
          mealFastFood_id,
          ...mealData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete meal data.",
      });
    }
  } catch (error) {
    console.error("Error deleting meal data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting meal data",
    });
  }
}

module.exports = { deleteDataMeal };
