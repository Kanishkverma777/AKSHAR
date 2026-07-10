const pool = require('../db/pool');

// GET /api/courses
exports.getAll = async (req, res, next) => {
  try {
    const { is_active, prog_id, dept_id } = req.query;
    let query = `SELECT c.*, p.prog_name, d.dept_name
                 FROM courses c
                 LEFT JOIN programmes p ON c.prog_id = p.prog_id
                 LEFT JOIN departments d ON c.dept_id = d.dept_id`;
    const params = [];
    const conditions = [];

    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`c.is_active = $${params.length}`);
    }
    if (prog_id) {
      params.push(prog_id);
      conditions.push(`c.prog_id = $${params.length}`);
    }
    if (dept_id) {
      params.push(dept_id);
      conditions.push(`c.dept_id = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY c.course_id';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT c.*, p.prog_name, d.dept_name
       FROM courses c
       LEFT JOIN programmes p ON c.prog_id = p.prog_id
       LEFT JOIN departments d ON c.dept_id = d.dept_id
       WHERE c.course_id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses
exports.create = async (req, res, next) => {
  try {
    const {
      course_id, course_name, course_short_name, prog_id, dept_id,
      regulatory_body_name, regulatory_body_shortname,
      uss_name, uss_shortname, annual_sem_trimester,
      min_duration_in_years, max_duration_in_years, total_semester_annual,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO courses
         (course_id, course_name, course_short_name, prog_id, dept_id,
          regulatory_body_name, regulatory_body_shortname,
          uss_name, uss_shortname, annual_sem_trimester,
          min_duration_in_years, max_duration_in_years, total_semester_annual)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [course_id, course_name, course_short_name, prog_id || null, dept_id || null,
       regulatory_body_name || null, regulatory_body_shortname || null,
       uss_name, uss_shortname, annual_sem_trimester,
       min_duration_in_years, max_duration_in_years, total_semester_annual]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/courses/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      course_name, course_short_name, prog_id, dept_id,
      regulatory_body_name, regulatory_body_shortname,
      uss_name, uss_shortname, annual_sem_trimester,
      min_duration_in_years, max_duration_in_years, total_semester_annual, is_active,
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE courses
       SET course_name=$1, course_short_name=$2, prog_id=$3, dept_id=$4,
           regulatory_body_name=$5, regulatory_body_shortname=$6,
           uss_name=$7, uss_shortname=$8, annual_sem_trimester=$9,
           min_duration_in_years=$10, max_duration_in_years=$11,
           total_semester_annual=$12, is_active=$13
       WHERE course_id=$14
       RETURNING *`,
      [course_name, course_short_name, prog_id || null, dept_id || null,
       regulatory_body_name || null, regulatory_body_shortname || null,
       uss_name, uss_shortname, annual_sem_trimester,
       min_duration_in_years, max_duration_in_years, total_semester_annual,
       is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM courses WHERE course_id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
