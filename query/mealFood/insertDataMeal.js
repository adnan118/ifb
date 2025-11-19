const {
  insertData, 
} = require("../../controllers/functions");

 

async function insertDataMeal(req, res) {
  try {
     
     
    const {
      mealFastFood_nameAr,
      mealFastFood_nameAEn,
      mealFastFood_periodAr,
      mealFastFood_periodEn,
      mealFastFood_Kcal,
      mealFastFood_carb,
      mealFastFood_Protein,
      mealFastFood_Fat,
      mealFastFood_wight,
    } = req.body;

   
    // إعداد بيانات الإدخال
    const insertMealData = {
      mealFastFood_nameAr: mealFastFood_nameAr,
      mealFastFood_nameAEn: mealFastFood_nameAEn,
      mealFastFood_periodAr: mealFastFood_periodAr,
      mealFastFood_periodEn: mealFastFood_periodEn,
      mealFastFood_Kcal: mealFastFood_Kcal,
      mealFastFood_carb: mealFastFood_carb,
      mealFastFood_Protein: mealFastFood_Protein,
      mealFastFood_Fat: mealFastFood_Fat,
      mealFastFood_wight: mealFastFood_wight,
    };

     const result = await insertData("mealfastfood", insertMealData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Meal data inserted successfully.",
        data: insertMealData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert meal data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting meal data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting meal data",
      error: error.message,
    });
  }
}

module.exports = {  insertDataMeal };
