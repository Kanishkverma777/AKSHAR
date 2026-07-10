const pool = require('../db/pool');

// GET /api/employees
exports.getAll = async (req, res, next) => {
  try {
    const { dept_id, is_active } = req.query;
    let query = `SELECT e.*, d.dept_name
                 FROM employees e
                 LEFT JOIN departments d ON e.dept_id = d.dept_id`;
    const params = [];
    const conditions = [];

    if (dept_id) {
      params.push(dept_id);
      conditions.push(`e.dept_id = $${params.length}`);
    }
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`e.is_active = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY e.emp_id';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/employees/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT e.*, d.dept_name
       FROM employees e
       LEFT JOIN departments d ON e.dept_id = d.dept_id
       WHERE e.emp_id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/employees
exports.create = async (req, res, next) => {
  try {
    const { emp_code, emp_name, email, phone, designation, dept_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO employees (emp_code, emp_name, email, phone, designation, dept_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [emp_code, emp_name, email || null, phone || null, designation || null, dept_id || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/employees/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { emp_code, emp_name, email, phone, designation, dept_id, is_active } = req.body;
    const { rows } = await pool.query(
      `UPDATE employees
       SET emp_code=$1, emp_name=$2, email=$3, phone=$4, designation=$5, dept_id=$6, is_active=$7
       WHERE emp_id=$8
       RETURNING *`,
      [emp_code, emp_name, email || null, phone || null, designation || null,
       dept_id || null, is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/employees/:id  (soft delete — sets is_active = false)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM employees WHERE emp_id = $1 RETURNING *`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
