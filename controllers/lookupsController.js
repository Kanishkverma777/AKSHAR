const pool = require('../db/pool');

// GET /api/lookups
exports.getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM lookup_master';
    const params = [];
    if (category) {
      params.push(category.toUpperCase());
      query += ' WHERE category = $1';
    }
    query += ' ORDER BY category, code';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/lookups/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM lookup_master WHERE lookup_id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Lookup entry not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/lookups
exports.create = async (req, res, next) => {
  try {
    const { category, code, label } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO lookup_master (category, code, label)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [category.toUpperCase(), code, label]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/lookups/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, code, label, is_active } = req.body;
    const { rows } = await pool.query(
      `UPDATE lookup_master
       SET category=$1, code=$2, label=$3, is_active=$4
       WHERE lookup_id=$5
       RETURNING *`,
      [category.toUpperCase(), code, label, is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Lookup entry not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/lookups/:id
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'UPDATE lookup_master SET is_active = false WHERE lookup_id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Lookup entry not found' });
    }
    res.json({ success: true, message: 'Lookup deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
