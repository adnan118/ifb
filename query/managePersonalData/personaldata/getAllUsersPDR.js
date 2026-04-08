
const { getConnection } = require("../../../controllers/db");
const { ensureMultiSelectTables } = require("./personalDataMultiSelect");

async function getAllUsersPDR(req, res) {
  try {
    // Handle empty body for POST requests
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
      // Continue with empty body
    }
    
    // Get all users' personal data register with offers_id and users_id only
    const connection = await getConnection();
    
    await ensureMultiSelectTables(connection);

    const query = `
      SELECT
        p.personalData_users_id,
        p.personalData_offers_id,
        p.personalData_goal_id,
        p.personalData_dietType_id,
        p.personalData_gender_id,
        GROUP_CONCAT(DISTINCT ps.specialPrograms_id ORDER BY ps.specialPrograms_id ASC) AS personalData_specialPrograms_ids,
        GROUP_CONCAT(DISTINCT pa.areasAttention_id ORDER BY pa.areasAttention_id ASC) AS personalData_areasAttention_ids,
        GROUP_CONCAT(DISTINCT pb.badHabits_id ORDER BY pb.badHabits_id ASC) AS personalData_badHabits_ids,
        GROUP_CONCAT(DISTINCT pe.specialEvent_id ORDER BY pe.specialEvent_id ASC) AS personalData_specialEvent_ids
      FROM personaldataregister p
      LEFT JOIN personaldataregister_specialprograms ps
        ON ps.personalData_id = p.personalData_id
      LEFT JOIN personaldataregister_areasattention pa
        ON pa.personalData_id = p.personalData_id
      LEFT JOIN personaldataregister_badhabits pb
        ON pb.personalData_id = p.personalData_id
      LEFT JOIN personaldataregister_specialevents pe
        ON pe.personalData_id = p.personalData_id
      WHERE p.personalData_offers_id IS NOT NULL
        AND p.personalData_users_id IS NOT NULL
        AND p.personalData_gender_id IS NOT NULL
      GROUP BY
        p.personalData_id,
        p.personalData_users_id,
        p.personalData_offers_id,
        p.personalData_goal_id,
        p.personalData_dietType_id,
        p.personalData_gender_id
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

/*
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
      SELECT personalData_users_id, personalData_offers_id, personalData_goal_id, personalData_dietType_id, personalData_gender_id
      FROM personaldataregister 
      WHERE personalData_offers_id IS NOT NULL AND personalData_users_id IS NOT NULL AND personalData_gender_id IS NOT NULL
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
*/
