const {
  updateData,
  getData,
} = require("../../controllers/functions");
 

 

async function updateDataMeal(req, res) {
  try {
     

    const {
      mealFastFood_id,
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

     

    const updateMealData = {
      mealFastFood_nameAr,
      mealFastFood_nameAEn,
      mealFastFood_periodAr,
      mealFastFood_periodEn,
      mealFastFood_Kcal,
      mealFastFood_carb,
      mealFastFood_Protein,
      mealFastFood_Fat,
      mealFastFood_wight,
     };

    const result = await updateData(
      "mealfastfood",
      updateMealData,
      "mealFastFood_id = ?",
      [mealFastFood_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Meal data updated successfully.",
        data: {
          mealFastFood_id,
          ...updateMealData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update meal data.",
      });
    }
  } catch (error) {
    console.error("Error updating meal data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating meal data",
    });
  }
}

module.exports = {  updateDataMeal };
