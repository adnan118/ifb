const { getConnection } = require("../../../controllers/db");

function normalizeToIdArray(value) {
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return [...new Set(value.map((v) => parseInt(v, 10)).filter((v) => Number.isInteger(v) && v > 0))];
  }

  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? [value] : [];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "null") return [];

    // JSON array form: "[1,2,3]"
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return [...new Set(parsed.map((v) => parseInt(v, 10)).filter((v) => Number.isInteger(v) && v > 0))];
        }
      } catch (_) {
        // fall through to CSV parse
      }
    }

    // CSV / single form
    return [
      ...new Set(
        trimmed
          .split(",")
          .map((v) => parseInt(v.trim(), 10))
          .filter((v) => Number.isInteger(v) && v > 0)
      ),
    ];
  }

  return [];
}

function isProvided(value) {
  return !(value === undefined || value === null || (typeof value === "string" && value.trim() === ""));
}

function firstOrFallback(ids, fallback) {
  return ids.length > 0 ? ids[0] : fallback;
}

async function ensureMultiSelectTables(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS personaldataregister_specialprograms (
      personalData_id INT NOT NULL,
      specialPrograms_id INT NOT NULL,
      PRIMARY KEY (personalData_id, specialPrograms_id),
      INDEX idx_pdsp_sp (specialPrograms_id),
      CONSTRAINT fk_pdsp_pd
        FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_pdsp_sp
        FOREIGN KEY (specialPrograms_id) REFERENCES specialprograms(specialPrograms_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS personaldataregister_areasattention (
      personalData_id INT NOT NULL,
      areasAttention_id INT NOT NULL,
      PRIMARY KEY (personalData_id, areasAttention_id),
      INDEX idx_pdaa_area (areasAttention_id),
      CONSTRAINT fk_pdaa_pd
        FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_pdaa_area
        FOREIGN KEY (areasAttention_id) REFERENCES areasattention(areasattention_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS personaldataregister_badhabits (
      personalData_id INT NOT NULL,
      badHabits_id INT NOT NULL,
      PRIMARY KEY (personalData_id, badHabits_id),
      INDEX idx_pdbh_bad (badHabits_id),
      CONSTRAINT fk_pdbh_pd
        FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_pdbh_bad
        FOREIGN KEY (badHabits_id) REFERENCES badhabits(badHabits_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS personaldataregister_specialevents (
      personalData_id INT NOT NULL,
      specialEvent_id INT NOT NULL,
      specialEvent_date DATE NULL,
      PRIMARY KEY (personalData_id, specialEvent_id),
      INDEX idx_pdse_event (specialEvent_id),
      CONSTRAINT fk_pdse_pd
        FOREIGN KEY (personalData_id) REFERENCES personaldataregister(personalData_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_pdse_event
        FOREIGN KEY (specialEvent_id) REFERENCES specialevent(specialevent_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function syncSimplePivot(connection, tableName, idColumn, personalDataId, ids) {
  await connection.execute(`DELETE FROM ${tableName} WHERE personalData_id = ?`, [personalDataId]);
  if (!ids || ids.length === 0) return;

  const placeholders = ids.map(() => "(?, ?)").join(", ");
  const values = [];
  ids.forEach((id) => {
    values.push(personalDataId, id);
  });
  await connection.execute(
    `INSERT INTO ${tableName} (personalData_id, ${idColumn}) VALUES ${placeholders}`,
    values
  );
}

async function syncSpecialEventsPivot(connection, personalDataId, ids, defaultDate) {
  await connection.execute("DELETE FROM personaldataregister_specialevents WHERE personalData_id = ?", [personalDataId]);
  if (!ids || ids.length === 0) return;

  const placeholders = ids.map(() => "(?, ?, ?)").join(", ");
  const values = [];
  ids.forEach((id) => {
    values.push(personalDataId, id, defaultDate || null);
  });
  await connection.execute(
    `INSERT INTO personaldataregister_specialevents (personalData_id, specialEvent_id, specialEvent_date) VALUES ${placeholders}`,
    values
  );
}

async function getPivotIds(connection, query, params = []) {
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    // In case table doesn't exist yet in some environments
    if (error && error.code === "ER_NO_SUCH_TABLE") return [];
    throw error;
  }
}

async function loadMultiSelectForPersonalData(connection, personalDataId) {
  const [specialProgramsRows, areasRows, badHabitsRows, specialEventRows] = await Promise.all([
    getPivotIds(
      connection,
      "SELECT specialPrograms_id FROM personaldataregister_specialprograms WHERE personalData_id = ? ORDER BY specialPrograms_id ASC",
      [personalDataId]
    ),
    getPivotIds(
      connection,
      "SELECT areasAttention_id FROM personaldataregister_areasattention WHERE personalData_id = ? ORDER BY areasAttention_id ASC",
      [personalDataId]
    ),
    getPivotIds(
      connection,
      "SELECT badHabits_id FROM personaldataregister_badhabits WHERE personalData_id = ? ORDER BY badHabits_id ASC",
      [personalDataId]
    ),
    getPivotIds(
      connection,
      "SELECT specialEvent_id, specialEvent_date FROM personaldataregister_specialevents WHERE personalData_id = ? ORDER BY specialEvent_id ASC",
      [personalDataId]
    ),
  ]);

  return {
    specialProgramsIds: specialProgramsRows.map((r) => r.specialPrograms_id),
    areasAttentionIds: areasRows.map((r) => r.areasAttention_id),
    badHabitsIds: badHabitsRows.map((r) => r.badHabits_id),
    specialEventIds: specialEventRows.map((r) => r.specialEvent_id),
    specialEventDates: specialEventRows.map((r) => ({
      specialEvent_id: r.specialEvent_id,
      specialEvent_date: r.specialEvent_date,
    })),
  };
}

module.exports = {
  normalizeToIdArray,
  isProvided,
  firstOrFallback,
  ensureMultiSelectTables,
  syncSimplePivot,
  syncSpecialEventsPivot,
  loadMultiSelectForPersonalData,
  getConnection,
};

