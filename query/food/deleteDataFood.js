const {
  deleteData,
  getData
} = require("../../controllers/functions");
const path = require("path");
const fs = require("fs");

async function deleteDataFood(req, res) {
  try {
    const { food_id } = req.body;
    
    // الحصول على معلومات  قبل حذفها
    const foodData = await getData("food", "food_id = ?", [food_id]);
    
    if (foodData.status === "success" && foodData.data) {
      // حذف الصورة إذا كانت موجودة
      if (foodData.data.food_img && foodData.data.food_img !== "img.png") {
        const imagePath = path.join(
          process.cwd(),
          "query/food/foodImages/images",
          foodData.data.food_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const result = await deleteData("food", "food_id = ?", [food_id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "food and associated images deleted successfully.",
        data: {
          food_id,
          ...foodData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete food  data.",
      });
    }
  } catch (error) {
    console.error("Error deleting food  data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting food  data",
    });
  }
}

module.exports = { deleteDataFood }; 