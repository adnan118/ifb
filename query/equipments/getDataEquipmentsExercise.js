const { getAllData, getData } = require("../../controllers/functions");

const getAllEquipmentsExercise = async (req, res) => {
  try {
    // Get exercise IDs from request body
    const { exercise_ids } = req.body;

    // Validate that exercise_ids is provided and is an array
    if (!exercise_ids || !Array.isArray(exercise_ids) || exercise_ids.length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide a valid array of exercise_ids",
      });
    }

    // Create placeholders for the IN clause
    const placeholders = exercise_ids.map(() => '?').join(',');
    
    // Get exercises with the specified IDs
    const exercisesResult = await getAllData(
      "exercise", 
      `exercise_id IN (${placeholders})`, 
      exercise_ids
    );
    
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
      if (exercise.exercise_equipment) {
        try {
          // Parse the equipment IDs from the JSON string
          const equipmentIds = JSON.parse(exercise.exercise_equipment);
          
          // Add each equipment ID to the set
          if (Array.isArray(equipmentIds)) {
            equipmentIds.forEach(id => equipmentIdsSet.add(id));
          }
        } catch (err) {
          console.error("Error parsing exercise_equipment:", err);
        }
      }
    });
    
    // Convert the set to an array
    const equipmentIds = Array.from(equipmentIdsSet);
    
    // If no equipment IDs found
    if (equipmentIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No equipment found for the specified exercises",
        data: [],
      });
    }
    
    // Create placeholders for the equipment IDs
    const equipmentPlaceholders = equipmentIds.map(() => '?').join(',');
    
    // Get equipment details
    const equipmentsResult = await getAllData(
      "equipments", 
      `equipment_id IN (${equipmentPlaceholders})`, 
      equipmentIds
    );
    
    // Return the equipment data
    if (equipmentsResult.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Equipment fetched successfully",
        data: equipmentsResult.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Error fetching equipment data",
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
