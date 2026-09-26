const { getConnection } = require('../../../controllers/db');

// Serialize a user's day across workers without a destructive schema migration.
async function updateOrInsertSteps(req, res) {
  const body = req.body || {};
  const user = Number(body.steps_user_id);
  const hasGoal = body.steps_goal !== '' && body.steps_goal != null;
  const value = Number(body.steps_value_day || 0);
  const goal = hasGoal ? Number(body.steps_goal) : 10000;
  const date = body.steps_date_day || new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Damascus', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const parsed = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(date + 'T00:00:00Z') : new Date(NaN);
  if (!Number.isSafeInteger(user) || user <= 0 ||
      !Number.isSafeInteger(value) || value < 0 || value > 1000000 ||
      !Number.isSafeInteger(goal) || goal <= 0 || goal > 1000000 ||
      !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ status: 'failure', message: 'Invalid steps, goal, user or date.' });
  }
  let connection;
  let locked = false;
  const lockName = 'steps:' + user + ':' + date;
  try {
    connection = await getConnection();
    const [locks] = await connection.execute('SELECT GET_LOCK(?, 10) AS acquired', [lockName]);
    locked = Number(locks[0].acquired) === 1;
    if (!locked) return res.status(503).json({ status: 'failure', message: 'Retry steps synchronization.' });
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      'SELECT MAX(steps_value_day) AS total, COUNT(*) AS count FROM steps WHERE steps_user_id = ? AND DATE(steps_date_day) = ?',
      [user, date]);
    const total = Math.max(Number(rows[0].total) || 0, value);
    if (Number(rows[0].count) > 0) {
      await connection.execute(
        'UPDATE steps SET steps_value_day = GREATEST(COALESCE(steps_value_day, 0), ?)' +
        (hasGoal ? ', steps_goal = ?' : '') +
        ' WHERE steps_user_id = ? AND DATE(steps_date_day) = ?',
        hasGoal ? [total, goal, user, date] : [total, user, date]);
    } else {
      await connection.execute(
        'INSERT INTO steps (steps_user_id, steps_goal, steps_value_day, steps_date_day) VALUES (?, ?, ?, ?)',
        [user, goal, total, date]);
    }
    await connection.commit();
    return res.json({ status: 'success', data: { steps_value_day: total, steps_date_day: date } });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    console.error('Steps synchronization failed:', error.code || error.message);
    return res.status(500).json({ status: 'failure', message: 'Unable to save steps. Retry later.' });
  } finally {
    if (connection) {
      try {
        if (locked) await connection.execute('SELECT RELEASE_LOCK(?)', [lockName]);
      } finally {
        await connection.end();
      }
    }
  }
}

module.exports = { updateOrInsertSteps };
