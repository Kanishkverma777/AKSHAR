const pool = require('../db/pool');

// GET /api/course-intake
exports.getAll = async (req, res, next) => {
  try {
    const { course_id, acad_year, is_active } = req.query;
    let query = `SELECT ci.*, c.course_name, acs.session_name
                 FROM course_intake ci
                 JOIN courses c ON ci.course_id = c.course_id
                 JOIN academic_sessions acs ON ci.acad_year = acs.acad_year`;
    const params = [];
    const conditions = [];

    if (course_id) {
      params.push(course_id);
      conditions.push(`ci.course_id = $${params.length}`);
    }
    if (acad_year) {
      params.push(acad_year);
      conditions.push(`ci.acad_year = $${params.length}`);
    }
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`ci.is_active = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY ci.course_id, ci.acad_year';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/course-intake/:courseId/:acadYear
exports.getById = async (req, res, next) => {
  try {
    const { courseId, acadYear } = req.params;
    const { rows } = await pool.query(
      `SELECT ci.*, c.course_name, acs.session_name
       FROM course_intake ci
       JOIN courses c ON ci.course_id = c.course_id
       JOIN academic_sessions acs ON ci.acad_year = acs.acad_year
       WHERE ci.course_id = $1 AND ci.acad_year = $2`,
      [courseId, acadYear]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course intake record not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/course-intake
exports.create = async (req, res, next) => {
  try {
    const { course_id, acad_year, approved_intake, total_admitted } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO course_intake (course_id, acad_year, approved_intake, total_admitted)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [course_id, acad_year, approved_intake, total_admitted || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/course-intake/:courseId/:acadYear
exports.update = async (req, res, next) => {
  try {
    const { courseId, acadYear } = req.params;
    const { approved_intake, total_admitted, is_active } = req.body;
    const { rows } = await pool.query(
      `UPDATE course_intake
       SET approved_intake = $1, total_admitted = $2, is_active = $3
       WHERE course_id = $4 AND acad_year = $5
       RETURNING *`,
      [approved_intake, total_admitted || null,
       is_active !== undefined ? is_active : true, courseId, acadYear]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course intake record not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/course-intake/:courseId/:acadYear
exports.remove = async (req, res, next) => {
  try {
    const { courseId, acadYear } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM course_intake
       WHERE course_id = $1 AND acad_year = $2
       RETURNING *`,
      [courseId, acadYear]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course intake record not found' });
    }
    res.json({ success: true, message: 'Course intake deleted', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
