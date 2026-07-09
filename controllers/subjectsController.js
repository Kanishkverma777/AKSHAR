const pool = require('../db/pool');

// GET /api/subjects
exports.getAll = async (req, res, next) => {
  try {
    const { scheme_id, course_id, year_semester, is_active } = req.query;
    let query = `SELECT sm.*, c.course_name, cs.acad_year AS scheme_year,
                        lt.label AS type_label, le.label AS exam_label,
                        lm.label AS mode_label, lk.label AS kind_label
                 FROM subject_master sm
                 JOIN courses c ON sm.course_id = c.course_id
                 JOIN course_scheme cs ON sm.scheme_id = cs.scheme_id
                 LEFT JOIN lookup_master lt ON lt.lookup_id = sm.type_id
                 LEFT JOIN lookup_master le ON le.lookup_id = sm.exam_id
                 LEFT JOIN lookup_master lm ON lm.lookup_id = sm.mode_id
                 LEFT JOIN lookup_master lk ON lk.lookup_id = sm.kind_id`;
    const params = [];
    const conditions = [];

    if (scheme_id) {
      params.push(scheme_id);
      conditions.push(`sm.scheme_id = $${params.length}`);
    }
    if (course_id) {
      params.push(course_id);
      conditions.push(`sm.course_id = $${params.length}`);
    }
    if (year_semester) {
      params.push(year_semester);
      conditions.push(`sm.year_semester = $${params.length}`);
    }
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`sm.is_active = $${params.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY sm.scheme_id, sm.year_semester, sm.paper_id';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/subjects/:paperId/:schemeId
exports.getById = async (req, res, next) => {
  try {
    const { paperId, schemeId } = req.params;
    const { rows } = await pool.query(
      `SELECT sm.*, c.course_name,
              lt.label AS type_label, le.label AS exam_label,
              lm.label AS mode_label, lk.label AS kind_label
       FROM subject_master sm
       JOIN courses c ON sm.course_id = c.course_id
       LEFT JOIN lookup_master lt ON lt.lookup_id = sm.type_id
       LEFT JOIN lookup_master le ON le.lookup_id = sm.exam_id
       LEFT JOIN lookup_master lm ON lm.lookup_id = sm.mode_id
       LEFT JOIN lookup_master lk ON lk.lookup_id = sm.kind_id
       WHERE sm.paper_id = $1 AND sm.scheme_id = $2`,
      [paperId, schemeId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/subjects
exports.create = async (req, res, next) => {
  try {
    const {
      paper_id, scheme_id, paper_code, paper_name, course_id,
      year_semester, credits, type_id, exam_id, mode_id,
      paper_group, paper_sub_group, kind_id,
      minor_max_marks, major_max_marks, total_max_marks, pass_marks,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO subject_master
         (paper_id, scheme_id, paper_code, paper_name, course_id,
          year_semester, credits, type_id, exam_id, mode_id,
          paper_group, paper_sub_group, kind_id,
          minor_max_marks, major_max_marks, total_max_marks, pass_marks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [paper_id, scheme_id, paper_code, paper_name, course_id,
       year_semester, credits, type_id, exam_id, mode_id,
       paper_group || null, paper_sub_group || null, kind_id,
       minor_max_marks, major_max_marks, total_max_marks, pass_marks]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/subjects/:paperId/:schemeId
exports.update = async (req, res, next) => {
  try {
    const { paperId, schemeId } = req.params;
    const {
      paper_code, paper_name, course_id,
      year_semester, credits, type_id, exam_id, mode_id,
      paper_group, paper_sub_group, kind_id,
      minor_max_marks, major_max_marks, total_max_marks, pass_marks, is_active,
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE subject_master
       SET paper_code=$1, paper_name=$2, course_id=$3,
           year_semester=$4, credits=$5, type_id=$6, exam_id=$7, mode_id=$8,
           paper_group=$9, paper_sub_group=$10, kind_id=$11,
           minor_max_marks=$12, major_max_marks=$13, total_max_marks=$14,
           pass_marks=$15, is_active=$16
       WHERE paper_id=$17 AND scheme_id=$18
       RETURNING *`,
      [paper_code, paper_name, course_id,
       year_semester, credits, type_id, exam_id, mode_id,
       paper_group || null, paper_sub_group || null, kind_id,
       minor_max_marks, major_max_marks, total_max_marks, pass_marks,
       is_active !== undefined ? is_active : true,
       paperId, schemeId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/subjects/:paperId/:schemeId  (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const { paperId, schemeId } = req.params;
    const { rows } = await pool.query(
      `UPDATE subject_master SET is_active = false
       WHERE paper_id = $1 AND scheme_id = $2 RETURNING *`,
      [paperId, schemeId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.json({ success: true, message: 'Subject deactivated', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
