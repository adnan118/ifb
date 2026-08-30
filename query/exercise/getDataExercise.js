const { getData } = require("../../controllers/functions");
const { getConnection } = require("../../controllers/db");
const {
  getTrainingPhaseExercisesData,
} = require("../training_phase_exercises/trainingPhaseExercises");

const normalizeGender = (gender) => {
  if (!gender) return null;

  const normalized = gender.toString().trim().toLowerCase();
  if (["1", "male", "ذكر"].includes(normalized)) return 1;
  if (["2", "female", "femal", "أنثى", "انثى"].includes(normalized)) return 2;
  return null;
};

const parseEquipmentWeights = (exercise) => {
  if (!exercise.exercise_equipment_weights) return exercise;

  try {
    exercise.exercise_equipment_weights_parsed = JSON.parse(
      exercise.exercise_equipment_weights
    );
  } catch (_) {
    exercise.exercise_equipment_weights_parsed =
      exercise.exercise_equipment_weights;
  }

  return exercise;
};

const getDataExercise = async (req, res) => {
  let connection;

  try {
    const { exercise_idTraining, personalData_users_id } = req.body;

    const trainingId = Number.parseInt(exercise_idTraining, 10);
    if (!Number.isInteger(trainingId) || trainingId <= 0) {
      return res.status(400).json({
        status: "failure",
        message: "exercise_idTraining must be a positive integer",
      });
    }

    let userGender = null;
    if (personalData_users_id) {
      const personalData = await getData(
        "personaldataregister",
        "personalData_users_id = ?",
        [personalData_users_id]
      );
      if (personalData.status === "success" && personalData.data) {
        userGender = normalizeGender(personalData.data.personalData_gender_id);
      }
    }

    const conditions = ["exercise_idTraining = ?"];
    const values = [trainingId];

    if (userGender) {
      conditions.push("(gender = ? OR gender IS NULL OR gender = '')");
      values.push(userGender);
    }

    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT *
       FROM exercise
       WHERE ${conditions.join(" AND ")}
       ORDER BY exercise_musclesTargetedEn ASC,
                exercise_id ASC`,
      values
    );

    const exercises = rows.map(parseEquipmentWeights);
    const phases = await getTrainingPhaseExercisesData(trainingId, connection);

    return res.status(200).json({
      status: "success",
      message: "Exercises fetched successfully",
      data: exercises,
      phases,
    });
  } catch (error) {
    console.error("Error in getDataExercise:", error);
    return res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = { getDataExercise };
