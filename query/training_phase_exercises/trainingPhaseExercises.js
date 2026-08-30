const { getConnection } = require("../../controllers/db");

const PHASE_TYPES = new Set(["warmup", "cooldown"]);

const cleanText = (value) =>
  value === undefined || value === null ? "" : value.toString().trim();

const normalizeBilingualText = (arabicValue, englishValue) => {
  const arabic = cleanText(arabicValue);
  const english = cleanText(englishValue);

  if (arabic && english) return { arabic, english };
  if (arabic) return { arabic, english: arabic };
  if (english) return { arabic: english, english };
  return { arabic: "", english: "" };
};

const normalizePositiveInt = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeSortOrder = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
};

const insertTrainingPhaseExercise = async (req, res) => {
  let connection;
  try {
    const phaseType = cleanText(req.body.phase_type).toLowerCase();
    if (!PHASE_TYPES.has(phaseType)) {
      return res.status(400).json({
        status: "failure",
        message: "phase_type must be warmup or cooldown",
      });
    }

    const name = normalizeBilingualText(req.body.nameAr, req.body.nameEn);
    if (!name.arabic) {
      return res.status(400).json({
        status: "failure",
        message: "nameAr or nameEn is required",
      });
    }

    const instructions = normalizeBilingualText(
      req.body.instructionsAr,
      req.body.instructionsEn
    );
    const durationSeconds = normalizePositiveInt(req.body.duration_seconds, 30);

    connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO training_phase_exercises
       (phase_type, nameAr, nameEn, duration_seconds,
        instructionsAr, instructionsEn, exercise_img, exercise_video)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        phaseType,
        name.arabic,
        name.english,
        durationSeconds,
        instructions.arabic,
        instructions.english,
        cleanText(req.body.exercise_img),
        cleanText(req.body.exercise_video),
      ]
    );

    return res.status(201).json({
      status: "success",
      message: "Training phase exercise created successfully",
      data: { training_phase_exercise_id: result.insertId },
    });
  } catch (error) {
    console.error("Error creating training phase exercise:", error);
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

const updateTrainingPhaseExercise = async (req, res) => {
  let connection;
  try {
    const exerciseId = normalizePositiveInt(
      req.body.training_phase_exercise_id
    );
    if (!exerciseId) {
      return res.status(400).json({
        status: "failure",
        message: "training_phase_exercise_id is required",
      });
    }

    connection = await getConnection();
    const [existingRows] = await connection.execute(
      `SELECT * FROM training_phase_exercises
       WHERE training_phase_exercise_id = ?`,
      [exerciseId]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Training phase exercise not found",
      });
    }

    const existing = existingRows[0];
    const phaseType = cleanText(req.body.phase_type || existing.phase_type).toLowerCase();
    if (!PHASE_TYPES.has(phaseType)) {
      return res.status(400).json({
        status: "failure",
        message: "phase_type must be warmup or cooldown",
      });
    }

    const name =
      req.body.nameAr !== undefined || req.body.nameEn !== undefined
        ? normalizeBilingualText(req.body.nameAr, req.body.nameEn)
        : { arabic: existing.nameAr, english: existing.nameEn };
    if (!name.arabic) {
      return res.status(400).json({
        status: "failure",
        message: "nameAr or nameEn is required",
      });
    }

    const instructions =
      req.body.instructionsAr !== undefined || req.body.instructionsEn !== undefined
        ? normalizeBilingualText(
            req.body.instructionsAr,
            req.body.instructionsEn
          )
        : {
            arabic: existing.instructionsAr || "",
            english: existing.instructionsEn || "",
          };

    const durationSeconds =
      req.body.duration_seconds === undefined
        ? existing.duration_seconds
        : normalizePositiveInt(req.body.duration_seconds, 30);

    await connection.execute(
      `UPDATE training_phase_exercises
       SET phase_type = ?, nameAr = ?, nameEn = ?, duration_seconds = ?,
           instructionsAr = ?, instructionsEn = ?, exercise_img = ?,
           exercise_video = ?
       WHERE training_phase_exercise_id = ?`,
      [
        phaseType,
        name.arabic,
        name.english,
        durationSeconds,
        instructions.arabic,
        instructions.english,
        req.body.exercise_img === undefined
          ? existing.exercise_img || ""
          : cleanText(req.body.exercise_img),
        req.body.exercise_video === undefined
          ? existing.exercise_video || ""
          : cleanText(req.body.exercise_video),
        exerciseId,
      ]
    );

    return res.json({
      status: "success",
      message: "Training phase exercise updated successfully",
    });
  } catch (error) {
    console.error("Error updating training phase exercise:", error);
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

const deleteTrainingPhaseExercise = async (req, res) => {
  let connection;
  try {
    const exerciseId = normalizePositiveInt(
      req.body.training_phase_exercise_id
    );
    if (!exerciseId) {
      return res.status(400).json({
        status: "failure",
        message: "training_phase_exercise_id is required",
      });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `DELETE FROM training_phase_exercises
       WHERE training_phase_exercise_id = ?`,
      [exerciseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Training phase exercise not found",
      });
    }

    return res.json({
      status: "success",
      message: "Training phase exercise deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting training phase exercise:", error);
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

const getTrainingPhaseExerciseLibrary = async (req, res) => {
  let connection;
  try {
    const requestedType = cleanText(req.body.phase_type).toLowerCase();
    if (requestedType && !PHASE_TYPES.has(requestedType)) {
      return res.status(400).json({
        status: "failure",
        message: "phase_type must be warmup or cooldown",
      });
    }

    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM training_phase_exercises
       ${requestedType ? "WHERE phase_type = ?" : ""}
       ORDER BY phase_type ASC, nameEn ASC, training_phase_exercise_id ASC`,
      requestedType ? [requestedType] : []
    );

    return res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching training phase exercise library:", error);
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

const assignTrainingPhaseExercise = async (req, res) => {
  let connection;
  try {
    const trainingId = normalizePositiveInt(req.body.idTraining);
    const exerciseId = normalizePositiveInt(
      req.body.training_phase_exercise_id
    );
    if (!trainingId || !exerciseId) {
      return res.status(400).json({
        status: "failure",
        message: "idTraining and training_phase_exercise_id are required",
      });
    }

    connection = await getConnection();
    await connection.execute(
      `INSERT INTO training_phase_exercise_assignments
       (training_id, training_phase_exercise_id, sort_order)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order)`,
      [trainingId, exerciseId, normalizeSortOrder(req.body.sort_order)]
    );

    return res.status(201).json({
      status: "success",
      message: "Exercise assigned to training successfully",
    });
  } catch (error) {
    const status = error.code === "ER_NO_REFERENCED_ROW_2" ? 404 : 500;
    return res.status(status).json({
      status: "failure",
      message:
        status === 404
          ? "Training or phase exercise not found"
          : error.message,
    });
  } finally {
    if (connection) await connection.end();
  }
};

const unassignTrainingPhaseExercise = async (req, res) => {
  let connection;
  try {
    const trainingId = normalizePositiveInt(req.body.idTraining);
    const exerciseId = normalizePositiveInt(
      req.body.training_phase_exercise_id
    );
    if (!trainingId || !exerciseId) {
      return res.status(400).json({
        status: "failure",
        message: "idTraining and training_phase_exercise_id are required",
      });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `DELETE FROM training_phase_exercise_assignments
       WHERE training_id = ? AND training_phase_exercise_id = ?`,
      [trainingId, exerciseId]
    );

    return res.json({
      status: "success",
      message: "Exercise unassigned from training successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

const getTrainingPhaseExercisesData = async (trainingId, connection) => {
  const [rows] = await connection.execute(
    `SELECT pe.*, assignment.sort_order
     FROM training_phase_exercise_assignments assignment
     INNER JOIN training_phase_exercises pe
       ON pe.training_phase_exercise_id = assignment.training_phase_exercise_id
     WHERE assignment.training_id = ?
     ORDER BY pe.phase_type ASC, assignment.sort_order ASC,
              pe.training_phase_exercise_id ASC`,
    [trainingId]
  );

  return {
    warmup: rows.filter((row) => row.phase_type === "warmup"),
    cooldown: rows.filter((row) => row.phase_type === "cooldown"),
  };
};

const getTrainingPhaseExercises = async (req, res) => {
  let connection;
  try {
    const trainingId = normalizePositiveInt(req.body.idTraining);
    if (!trainingId) {
      return res.status(400).json({
        status: "failure",
        message: "idTraining is required",
      });
    }

    connection = await getConnection();
    const phases = await getTrainingPhaseExercisesData(trainingId, connection);
    return res.json({ status: "success", data: phases });
  } catch (error) {
    return res.status(500).json({ status: "failure", message: error.message });
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = {
  insertTrainingPhaseExercise,
  updateTrainingPhaseExercise,
  deleteTrainingPhaseExercise,
  getTrainingPhaseExerciseLibrary,
  assignTrainingPhaseExercise,
  unassignTrainingPhaseExercise,
  getTrainingPhaseExercises,
  getTrainingPhaseExercisesData,
};
