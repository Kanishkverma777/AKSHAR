const pool = require('../db/pool');

// GET /api/programmes
exports.getAll = async (req, res, next) => {
  try {
    const { is_active } = req.query;
    let query = 'SELECT * FROM programmes';
    const params = [];
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ' WHERE is_active = $1';
    }
    query += ' ORDER BY prog_id';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/programmes/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM programmes WHERE prog_id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Programme not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/programmes
exports.create = async (req, res, next) => {
  try {
    const {
      prog_id, prog_name, prog_short_name,
      regulatory_body_name, regulatory_body_shortname,
      min_duration_in_years, max_duration_in_years,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO programmes
         (prog_id, prog_name, prog_short_name, regulatory_body_name,
          regulatory_body_shortname, min_duration_in_years, max_duration_in_years)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [prog_id, prog_name, prog_short_name,
       regulatory_body_name || null, regulatory_body_shortname || null,
       min_duration_in_years, max_duration_in_years]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/programmes/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      prog_name, prog_short_name,
      regulatory_body_name, regulatory_body_shortname,
      min_duration_in_years, max_duration_in_years, is_active,
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE programmes
       SET prog_name=$1, prog_short_name=$2, regulatory_body_name=$3,
           regulatory_body_shortname=$4, min_duration_in_years=$5,
           max_duration_in_years=$6, is_active=$7
       WHERE prog_id=$8
       RETURNING *`,
      [prog_name, prog_short_name,
       regulatory_body_name || null, regulatory_body_shortname || null,
       min_duration_in_years, max_duration_in_years,
       is_active !== undefined ? is_active : true, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Programme not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/programmes/:id  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM programmes WHERE prog_id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Programme not found' });
    }
    res.json({ success: true, message: 'Programme deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
