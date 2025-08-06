const { getConnection } = require("../../../controllers/db");

async function getAllUsersPDR(req, res) {
  try {
    // Handle empty body for POST requests
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
      // Continue with empty body
    }
    
    // Get all users' personal data register with offers_id and users_id only
    const connection = await getConnection();
    
      const query = `
      SELECT personalData_users_id, personalData_offers_id, personalData_goal_id, personalData_dietType_id ,personalData_gender_id,
      FROM personaldataregister 
      WHERE personalData_offers_id IS NOT NULL AND personalData_users_id IS NOT NULL  AND personalData_gender_id IS NOT NULL
    `;
    
    const [results] = await connection.execute(query);
    await connection.end();
    
    const result = { status: "success", data: results };

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        data: result.data,
      });
    } else {
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
module.exports = { getAllUsersPDR }; 
