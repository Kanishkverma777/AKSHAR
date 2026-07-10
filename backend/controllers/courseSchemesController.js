const pool = require('../db/pool');

// GET /api/course-schemes
exports.getAll = async (req, res, next) => {
  try {
    const { is_active, course_id } = req.query;
    let query = `SELECT cs.*, c.course_name
                 FROM course_scheme cs
                 JOIN courses c ON cs.course_id = c.course_id`;
    const params = [];
    const conditions = [];

    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`cs.is_active = $${params.length}`);
    }
    if (course_id) {
      params.push(course_id);
      conditions.push(`cs.course_id = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY cs.scheme_id';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/course-schemes/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT cs.*, c.course_name
       FROM course_scheme cs
       JOIN courses c ON cs.course_id = c.course_id
       WHERE cs.scheme_id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course scheme not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/course-schemes
exports.create = async (req, res, next) => {
  try {
    const {
      scheme_id, course_id, acad_year, semester_annual,
      min_duration_in_years, max_duration_in_years,
      total_semester_annual, min_credits, max_credits,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO course_scheme
         (scheme_id, course_id, acad_year, semester_annual,
          min_duration_in_years, max_duration_in_years,
          total_semester_annual, min_credits, max_credits)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [scheme_id, course_id, acad_year || null, semester_annual,
       min_duration_in_years, max_duration_in_years,
       total_semester_annual, min_credits, max_credits]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/course-schemes/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      course_id, acad_year, semester_annual,
      min_duration_in_years, max_duration_in_years,
      total_semester_annual, min_credits, max_credits, is_active,
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE course_scheme
       SET course_id=$1, acad_year=$2, semester_annual=$3,
           min_duration_in_years=$4, max_duration_in_years=$5,
           total_semester_annual=$6, min_credits=$7, max_credits=$8, is_active=$9
       WHERE scheme_id=$10
       RETURNING *`,
      [course_id, acad_year || null, semester_annual,
       min_duration_in_years, max_duration_in_years,
       total_semester_annual, min_credits, max_credits,
       is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course scheme not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/course-schemes/:id  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM course_scheme WHERE scheme_id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course scheme not found' });
    }
    res.json({ success: true, message: 'Course scheme deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
