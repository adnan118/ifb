const {
  updateData,
  insertData,
  getAllData
} = require("../../../controllers/functions");
const { getConnection } = require("../../../controllers/db");

async function updateOrInsertTrackingWeight(req, res) {
  try {
    const { 
      trakingWeight_user_id, 
      trakingWeight_current 
    } = req.body;

    // Validate required fields
    if (!trakingWeight_user_id || !trakingWeight_current) {
      return res.status(400).json({
        status: "failure",
        message: "trakingWeight_user_id and trakingWeight_current are required."
      });
    }

    // Get current date and time
    const now = new Date();
    const currentTimestamp = now.toISOString();

    // 1. Check if user has a record
    const checkResult = await getAllData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [trakingWeight_user_id]
    );

    console.log("Check Result:", checkResult); // Debug log

    // Check if we have a valid record
    if (checkResult && checkResult.status === "success" && checkResult.data && checkResult.data.length > 0) {
      console.log("Found existing record:", checkResult.data); // Debug log

                    // Update existing record
       const updateDataObj = {
         trakingWeight_pre: checkResult.data[0].trakingWeight_current,
         trakingWeight_current: trakingWeight_current,
         trakingWeight_lastedit: currentTimestamp
       };
       
       console.log("Update Data Object:", updateDataObj);
       console.log("Where Condition: trakingWeight_id = ?");
       console.log("Where Values:", [checkResult.data[0].trakingWeight_id]);
       
        // Try direct database update for debugging
        const connection = await getConnection();
        const setClause = Object.keys(updateDataObj)
          .map((key) => `\`${key}\` = ?`)
          .join(", ");
        
        const query = `UPDATE \`trakingweight\` SET ${setClause} WHERE \`trakingWeight_id\` = ?`;
        const queryValues = [...Object.values(updateDataObj), checkResult.data[0].trakingWeight_id];
        
        console.log("Generated Query:", query);
        console.log("Query Values:", queryValues);
        
        try {
          const [updateResult] = await connection.execute(query, queryValues);
          await connection.end();
          
          console.log("Direct Update Result:", updateResult);
          
          if (updateResult.affectedRows > 0) {
            res.json({
              status: "success",
              message: "Weight tracking data updated successfully.",
              data: { affectedRows: updateResult.affectedRows }
            });
            return;
          } else {
            res.status(500).json({
              status: "failure",
              message: "No rows were updated.",
              debug: {
                user_id: trakingWeight_user_id,
                current_weight: trakingWeight_current,
                existing_record: checkResult.data[0],
                query: query,
                values: queryValues
              }
            });
            return;
          }
        } catch (dbError) {
          console.error("Database Error:", dbError);
          await connection.end();
          res.status(500).json({
            status: "failure",
            message: "Database error occurred.",
            error: dbError.message,
            debug: {
              user_id: trakingWeight_user_id,
              current_weight: trakingWeight_current,
              existing_record: checkResult.data[0],
              query: query,
              values: queryValues
            }
          });
          return;
        }

      console.log("Update Result:", result); // Debug log

      if (result && result.status === "success") {
        res.json({
          status: "success",
          message: "Weight tracking data updated successfully.",
          data: result.data,
        });
      } else {
        console.error("Update failed:", result);
        res.status(500).json({
          status: "failure",
          message: "Failed to update weight tracking data.",
          error: result?.message || "Unknown error",
          debug: {
            user_id: trakingWeight_user_id,
            current_weight: trakingWeight_current,
            existing_record: checkResult.data[0]
          }
        });
      }
    } else {
      console.log("No existing record found, creating new one"); // Debug log

      // Create new record
      const insertResult = await insertData("trakingweight", {
        trakingWeight_user_id: trakingWeight_user_id,
        trakingWeight_pre: trakingWeight_current,
        trakingWeight_current: trakingWeight_current,
        trakingWeight_lastedit: currentTimestamp
      });

      console.log("Insert Result:", insertResult); // Debug log

      if (insertResult && insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New weight tracking record inserted successfully.",
        });
      } else {
        console.error("Insert failed:", insertResult);
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new weight tracking record.",
          error: insertResult?.message || "Unknown error"
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertTrackingWeight:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertTrackingWeight };
