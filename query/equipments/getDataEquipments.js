const { getAllData } = require("../../controllers/functions");

const getAllEquipments = async (req, res) => {
  try {
    const result = await getAllData("equipments");

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Equipments fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching equipments",
      });
    }
  } catch (error) {
    console.error("Error in getAllEquipments:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllEquipments,
};
