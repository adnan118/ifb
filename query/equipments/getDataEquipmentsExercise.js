const { getAllData, getData } = require("../../controllers/functions");
const { getConnection } = require("../../controllers/db");

const getAllEquipmentsExercise = async (req, res) => {
  try {
    console.log("Request received with body:", req.body);
    
    // Get exercise IDs from request body
    const { exercise_ids } = req.body;

    // Validate that exercise_ids is provided and is an array
    if (!exercise_ids || !Array.isArray(exercise_ids) || exercise_ids.length === 0) {
      console.log("Invalid exercise_ids:", exercise_ids);
      return res.status(400).json({
        status: "failure",
        message: "Please provide a valid array of exercise_ids",
      });
    }

    console.log("Processing exercise IDs:", exercise_ids);

    // Create placeholders for the IN clause
    const placeholders = exercise_ids.map(() => '?').join(',');
    
    // Get exercises with the specified IDs
    console.log(`Querying exercise table with IDs: ${exercise_ids.join(', ')}`);
    const exercisesResult = await getAllData(
      "exercise", 
      `exercise_id IN (${placeholders})`, 
      exercise_ids
    );
    
    console.log("Exercise query result status:", exercisesResult.status);
    console.log("Exercise data count:", exercisesResult.data ? exercisesResult.data.length : 0);
    
    // If no exercises found
    if (exercisesResult.status !== "success" || exercisesResult.data.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No exercises found with the provided IDs",
      });
    }

    // Extract unique equipment IDs from the exercises
    const equipmentIdsSet = new Set();
    
    exercisesResult.data.forEach(exercise => {
      console.log(`Processing exercise ID ${exercise.exercise_id}, equipment data:`, exercise.exercise_equipment);
      
      if (exercise.exercise_equipment) {
        try {
          // Try different parsing approaches based on the data format
          let equipmentIds;
          
          // First try: Parse as JSON array
          try {
            equipmentIds = JSON.parse(exercise.exercise_equipment);
            console.log("Parsed equipment IDs as JSON:", equipmentIds);
          } catch (jsonErr) {
            console.log("Failed to parse as JSON, trying as comma-separated string");
            
            // Second try: Parse as comma-separated string
            if (typeof exercise.exercise_equipment === 'string') {
              equipmentIds = exercise.exercise_equipment.split(',').map(id => id.trim());
              console.log("Parsed equipment IDs as comma-separated string:", equipmentIds);
            } else {
              // If it's already a number or other format
              equipmentIds = [exercise.exercise_equipment];
              console.log("Using equipment ID as is:", equipmentIds);
            }
          }
          
          // Add each equipment ID to the set
          if (Array.isArray(equipmentIds)) {
            equipmentIds.forEach(id => {
              // Convert to number if it's a string number
              const numId = Number(id);
              if (!isNaN(numId)) {
                equipmentIdsSet.add(numId);
              } else {
                equipmentIdsSet.add(id);
              }
            });
          } else if (equipmentIds && typeof equipmentIds === 'object') {
            // If it's an object with keys as IDs
            Object.keys(equipmentIds).forEach(key => {
              const id = Number(key);
              if (!isNaN(id)) {
                equipmentIdsSet.add(id);
              }
            });
          } else if (equipmentIds) {
            // If it's a single value
            const numId = Number(equipmentIds);
            if (!isNaN(numId)) {
              equipmentIdsSet.add(numId);
            } else {
              equipmentIdsSet.add(equipmentIds);
            }
          }
        } catch (err) {
          console.error("Error processing exercise_equipment:", err);
          console.log("Raw exercise_equipment value:", exercise.exercise_equipment);
        }
      } else {
        console.log(`Exercise ID ${exercise.exercise_id} has no equipment data`);
      }
    });
    
    // Convert the set to an array
    const equipmentIds = Array.from(equipmentIdsSet);
    console.log("Unique equipment IDs extracted:", equipmentIds);
    
    // If no equipment IDs found
    if (equipmentIds.length === 0) {
      console.log("No equipment IDs found for the exercises");
      return res.status(200).json({
        status: "success",
        message: "No equipment found for the specified exercises",
        data: [],
      });
    }
    
    // Use direct database connection for more control
    try {
      const connection = await getConnection();
      
      try {
        // Create placeholders for the equipment IDs
        const equipmentPlaceholders = equipmentIds.map(() => '?').join(',');
        
        // Query to get equipment details
        const query = `SELECT * FROM equipments WHERE equipment_id IN (${equipmentPlaceholders})`;
        console.log("Equipment query:", query);
        console.log("Equipment query params:", equipmentIds);
        
        // Execute the query
        const [equipments] = await connection.execute(query, equipmentIds);
        console.log("Equipment query result:", equipments ? equipments.length : 0, "items found");
        
        // Return the equipment data
        res.status(200).json({
          status: "success",
          message: "Equipment fetched successfully",
          data: equipments || [],
        });
      } catch (dbError) {
        console.error("Database query error:", dbError);
        res.status(500).json({
          status: "failure",
          message: "Error executing equipment query",
          error: dbError.message,
        });
      } finally {
        // Close the connection
        await connection.end();
      }
    } catch (connError) {
      console.error("Database connection error:", connError);
      res.status(500).json({
        status: "failure",
        message: "Error connecting to database",
        error: connError.message,
      });
    }
  } catch (error) {
    console.error("Error in getAllEquipmentsExercise:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllEquipmentsExercise,
};
