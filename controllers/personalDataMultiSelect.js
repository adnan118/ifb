// START ADDED: personal data multi-select normalization helpers
const MULTI_SELECT_FIELDS = [
  "personalData_badHabits_id",
  "personalData_areasAttention_id",
  "personalData_specialPrograms_id",
  "personalData_specialEvent_id",
];

function parseMultiIdValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const rawValues = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((item) => item.trim());

  const normalizedValues = [];
  const seen = new Set();

  for (const rawValue of rawValues) {
    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      continue;
    }

    const parsedValue = Number(rawValue);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      continue;
    }

    if (!seen.has(parsedValue)) {
      seen.add(parsedValue);
      normalizedValues.push(parsedValue);
    }
  }

  if (normalizedValues.length === 0) {
    return null;
  }

  return normalizedValues.join(",");
}

function normalizeMultiSelectPayload(payload) {
  const normalizedPayload = { ...payload };

  for (const fieldName of MULTI_SELECT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(normalizedPayload, fieldName)) {
      const originalValue = normalizedPayload[fieldName];
      const normalizedValue = parseMultiIdValue(normalizedPayload[fieldName]);

      if (normalizedValue !== null) {
        normalizedPayload[fieldName] = normalizedValue;
      } else if (Array.isArray(originalValue)) {
        normalizedPayload[fieldName] = "";
      }
    }
  }

  return normalizedPayload;
}

function attachMultiSelectArrays(record) {
  if (!record || typeof record !== "object") {
    return record;
  }

  const normalizedRecord = { ...record };

  for (const fieldName of MULTI_SELECT_FIELDS) {
    const value = normalizedRecord[fieldName];
    const arrayFieldName = `${fieldName}s`;

    if (value === undefined || value === null || value === "") {
      normalizedRecord[arrayFieldName] = [];
      continue;
    }

    normalizedRecord[arrayFieldName] = String(value)
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0);
  }

  return normalizedRecord;
}

module.exports = {
  MULTI_SELECT_FIELDS,
  attachMultiSelectArrays,
  normalizeMultiSelectPayload,
  parseMultiIdValue,
};
// END ADDED: personal data multi-select normalization helpers
