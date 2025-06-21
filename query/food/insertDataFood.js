const { insertData, handleImageUpload } = require("../../controllers/functions");

// دالة لرفع الصور
const uploadImages = handleImageUpload(
  "query/food/foodImages",
  [{ name: "food_img", maxCount: 1 }]
);

async function insertDataFood(req, res) {
  try {
    const food_img_file = req.files["food_img"]
      ? req.files["food_img"][0]
      : null;

    
    const {
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

    // تحديد مسار الصورة المرفوعة
    const food_img_path = food_img_file
      ? food_img_file.filename
      : req.body.food_img || "img.png";

    // إعداد بيانات الإدخال
    const insertFoodData = {
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

    const result = await insertData("food", insertFoodData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Food data inserted successfully.",
        data: insertFoodData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert food data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting food data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting food data",
      error: error.message,
    });
  }
}

module.exports = { uploadImages, insertDataFood }; 
