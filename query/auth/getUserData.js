const { getData } = require("../../controllers/functions");

 
async function getUserData(req, res) {
  try {
    const { users_id } = req.body;
 
    const result = await getData("users", "users_id = ?", [users_id]);
 
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success", 
        data: result.data,
      });
    }
    
    else {
      res.status(500).json({
        status: "failure",
        message: "Failed to get data.",
      });
    }
  } catch (error) {
    console.error("Error getting data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting data",
    });
  }
}
// تصدير الدالة
module.exports = { getUserData };