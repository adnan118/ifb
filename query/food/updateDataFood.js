const {
  updateData,
  handleImageUpload,
  getData,
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/food/foodImages/images",

  [{ name: "food_img", maxCount: 1 }]
);

async function updateDataFood(req, res) {
  try {
    const food_img_file = req.files["food_img"]
      ? req.files["food_img"][0]
      : null;
    const {
      food_id,
      food_nameEn,
      food_nameAr,
      food_kcal,
      food_protein,
      food_fat,
      food_carbs,
      food_cookingtime,
      food_noteEn,
      food_noteAr,
      food_ingredientsEn,
      food_ingredientsAr,
    } = req.body;

    // استعلام للحصول على الصورة القديمة
    const oldFoodData = await getData("food", "food_id = ?", [
      food_id,
    ]);

    // تأكد من أن البيانات موجودة داخل الكائن
    const old_food_img =
      oldFoodData && oldFoodData.status === "success" && oldFoodData.data
        ? oldFoodData.data.food_img
        : null;

    let food_img_path = old_food_img || "img.png"; // الافتراضي

    if (food_img_file) {
      const newFileName = food_img_file.filename;

      // إذا كانت الصورة الجديدة مختلفة عن القديمة
      if (newFileName !== old_food_img) {
        // حذف الصورة القديمة إن وجدت
        if (old_food_img && old_food_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/food/foodImages/images",
            old_food_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        food_img_path = newFileName;
      }
      // إذا كانت الصورة الجديدة نفس القديمة، نحتفظ بالصورة القديمة
    }

    const updateFoodData = {
      food_nameEn: food_nameEn,
      food_nameAr: food_nameAr,
      food_kcal: food_kcal,
      food_protein: food_protein,
      food_fat: food_fat,
      food_carbs: food_carbs,
      food_cookingtime: food_cookingtime,
      food_noteEn: food_noteEn,
      food_noteAr: food_noteAr,
      food_ingredientsEn: food_ingredientsEn,
      food_ingredientsAr: food_ingredientsAr,
      food_img: food_img_path,
    };

    const result = await updateData(
      "food",
      updateFoodData,
      "food_id = ?",
      [food_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Food data updated successfully.",
        data: {
          food_id,
          ...updateFoodData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update food data.",
      });
    }
  } catch (error) {
    console.error("Error updating food data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating food data",
    });
  }
}

module.exports = { updateDataFood, uploadImages }; 
