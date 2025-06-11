const { getAllData } = require("../../controllers/functions");

const getDataChallenges = async (req, res) => {
  try {
    const result = await getAllData("challenges");
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Challenges fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching challenges",
      });
    }
  } catch (error) {
    console.error("Error in getData challenges:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataChallenges
}; 