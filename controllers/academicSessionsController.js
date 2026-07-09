const pool = require('../db/pool');

// GET /api/academic-sessions
exports.getAll = async (req, res, next) => {
  try {
    const { is_current } = req.query;
    let query = 'SELECT * FROM academic_sessions';
    const params = [];
    if (is_current !== undefined) {
      params.push(is_current === 'true');
      query += ' WHERE is_current = $1';
    }
    query += ' ORDER BY acad_year DESC';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/academic-sessions/:year
exports.getById = async (req, res, next) => {
  try {
    const { year } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM academic_sessions WHERE acad_year = $1',
      [year]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Academic session not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/academic-sessions
exports.create = async (req, res, next) => {
  try {
    const { acad_year, session_name, start_date, end_date, is_current } = req.body;

    // If marking as current, unset any existing current session
    if (is_current) {
      await pool.query('UPDATE academic_sessions SET is_current = false WHERE is_current = true');
    }

    const { rows } = await pool.query(
      `INSERT INTO academic_sessions (acad_year, session_name, start_date, end_date, is_current)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [acad_year, session_name, start_date, end_date, is_current || false]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/academic-sessions/:year
exports.update = async (req, res, next) => {
  try {
    const { year } = req.params;
    const { session_name, start_date, end_date, is_current } = req.body;

    // If marking as current, unset any existing current session
    if (is_current) {
      await pool.query('UPDATE academic_sessions SET is_current = false WHERE is_current = true');
    }

    const { rows } = await pool.query(
      `UPDATE academic_sessions
       SET session_name=$1, start_date=$2, end_date=$3, is_current=$4
       WHERE acad_year=$5
       RETURNING *`,
      [session_name, start_date, end_date, is_current || false, year]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Academic session not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/academic-sessions/:year
exports.remove = async (req, res, next) => {
  try {
    const { year } = req.params;
    const { rowCount } = await pool.query(
      'DELETE FROM academic_sessions WHERE acad_year = $1',
      [year]
    );
    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Academic session not found' });
    }
    res.json({ success: true, message: 'Academic session deleted' });
  } catch (err) {
    next(err);
  }
};
