const { getConnection } = require("../../../controllers/db");
const {
  ensureMultiSelectTables,
  loadMultiSelectForPersonalData,
} = require("./personalDataMultiSelect");

async function getPDR(req, res) {
  let connection;
  try {
    const { personalData_users_id } = req.body;
    connection = await getConnection();

    await ensureMultiSelectTables(connection);

    const [rows] = await connection.execute(
      "SELECT * FROM personaldataregister WHERE personalData_users_id = ? LIMIT 1",
      [personalData_users_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(500).json({
        status: "failure",
        message: "Failed to get data.",
      });
    }

    const base = rows[0];
    const multi = await loadMultiSelectForPersonalData(connection, base.personalData_id);

    const data = {
      ...base,
      personalData_specialPrograms_ids:
        multi.specialProgramsIds.length > 0
          ? multi.specialProgramsIds
          : base.personalData_specialPrograms_id
          ? [base.personalData_specialPrograms_id]
          : [],
      personalData_areasAttention_ids:
        multi.areasAttentionIds.length > 0
          ? multi.areasAttentionIds
          : base.personalData_areasAttention_id
          ? [base.personalData_areasAttention_id]
          : [],
      personalData_badHabits_ids:
        multi.badHabitsIds.length > 0
          ? multi.badHabitsIds
          : base.personalData_badHabits_id
          ? [base.personalData_badHabits_id]
          : [],
      personalData_specialEvent_ids:
        multi.specialEventIds.length > 0
          ? multi.specialEventIds
          : base.personalData_specialEvent_id
          ? [base.personalData_specialEvent_id]
          : [],
      personalData_specialEvent_dates: multi.specialEventDates,
    };

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error getting data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting data",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { getPDR };


/*
const { getData } = require("../../../controllers/functions");
// START ADDED: expose parsed arrays while keeping original DB fields unchanged
const {
  attachMultiSelectArrays,
} = require("../../../controllers/personalDataMultiSelect");
// END ADDED: expose parsed arrays while keeping original DB fields unchanged

async function getPDR(req, res) {
  try {
    const { personalData_users_id } = req.body;

    const result = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id]
    );

    if (result.status === "success") {
      // START ADDED: keep original CSV fields and add derived array fields
      res.status(200).json({
        status: "success",
        data: attachMultiSelectArrays(result.data),
      });
      // END ADDED: keep original CSV fields and add derived array fields
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

module.exports = { getPDR };
*/
/*
const { getData } = require("../../../controllers/functions");

 async function getPDR(req, res) {
  try {
    const { personalData_users_id } = req.body;

     const result = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id], 
    );
 
    
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
module.exports = { getPDR };
*/
