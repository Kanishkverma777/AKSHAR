const pool = require('../db/pool');

// GET /api/departments
exports.getAll = async (req, res, next) => {
  try {
    const { is_active } = req.query;
    let query = `SELECT d.*, e.emp_name AS hod_name
                 FROM departments d
                 LEFT JOIN employees e ON d.hod_emp_id = e.emp_id`;
    const params = [];
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ' WHERE d.is_active = $1';
    }
    query += ' ORDER BY d.dept_id';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/departments/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT d.*, e.emp_name AS hod_name
       FROM departments d
       LEFT JOIN employees e ON d.hod_emp_id = e.emp_id
       WHERE d.dept_id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/departments
exports.create = async (req, res, next) => {
  try {
    const { dept_code, dept_name, hod_emp_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO departments (dept_code, dept_name, hod_emp_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dept_code, dept_name, hod_emp_id || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/departments/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dept_code, dept_name, hod_emp_id, is_active } = req.body;
    const { rows } = await pool.query(
      `UPDATE departments
       SET dept_code = $1, dept_name = $2, hod_emp_id = $3, is_active = $4
       WHERE dept_id = $5
       RETURNING *`,
      [dept_code, dept_name, hod_emp_id || null,
       is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/departments/:id  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM departments WHERE dept_id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
