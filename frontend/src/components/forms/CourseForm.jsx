import { useState, useEffect } from 'react';
import * as programmesApi from '../../api/programmes';
import * as departmentsApi from '../../api/departments';

export default function CourseForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    course_id: '', course_name: '', course_short_name: '',
    prog_id: '', dept_id: '',
    regulatory_body_name: '', regulatory_body_shortname: '',
    uss_name: '', uss_shortname: '',
    annual_sem_trimester: '', min_duration_in_years: '',
    max_duration_in_years: '', total_semester_annual: '',
  });
  const [programmes, setProgrammes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        course_id: initialData.course_id?.trim() || '',
        course_name: initialData.course_name || '',
        course_short_name: initialData.course_short_name || '',
        prog_id: initialData.prog_id || '',
        dept_id: initialData.dept_id || '',
        regulatory_body_name: initialData.regulatory_body_name || '',
        regulatory_body_shortname: initialData.regulatory_body_shortname || '',
        uss_name: initialData.uss_name || '',
        uss_shortname: initialData.uss_shortname || '',
        annual_sem_trimester: initialData.annual_sem_trimester || '',
        min_duration_in_years: initialData.min_duration_in_years || '',
        max_duration_in_years: initialData.max_duration_in_years || '',
        total_semester_annual: initialData.total_semester_annual || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    programmesApi.getAll().then((r) => setProgrammes(r.data || [])).catch(() => {});
    departmentsApi.getAll().then((r) => setDepartments(r.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      dept_id: form.dept_id ? Number(form.dept_id) : null,
      annual_sem_trimester: Number(form.annual_sem_trimester),
      min_duration_in_years: Number(form.min_duration_in_years),
      max_duration_in_years: Number(form.max_duration_in_years),
      total_semester_annual: Number(form.total_semester_annual),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Course ID *</label>
          <input className="form-input" name="course_id" value={form.course_id} onChange={handleChange} required maxLength={3} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Course Name *</label>
          <input className="form-input" name="course_name" value={form.course_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Short Name *</label>
          <input className="form-input" name="course_short_name" value={form.course_short_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Programme</label>
          <select className="form-select" name="prog_id" value={form.prog_id} onChange={handleChange}>
            <option value="">— Select —</option>
            {programmes.map((p) => <option key={p.prog_id} value={p.prog_id}>{p.prog_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-select" name="dept_id" value={form.dept_id} onChange={handleChange}>
            <option value="">— Select —</option>
            {departments.map((d) => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">USS Name *</label>
          <input className="form-input" name="uss_name" value={form.uss_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">USS Short *</label>
          <input className="form-input" name="uss_shortname" value={form.uss_shortname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Annual/Sem/Tri *</label>
          <input className="form-input" name="annual_sem_trimester" type="number" value={form.annual_sem_trimester} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Min Duration *</label>
          <input className="form-input" name="min_duration_in_years" type="number" min={1} value={form.min_duration_in_years} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Max Duration *</label>
          <input className="form-input" name="max_duration_in_years" type="number" min={1} value={form.max_duration_in_years} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Total Semesters *</label>
          <input className="form-input" name="total_semester_annual" type="number" min={1} value={form.total_semester_annual} onChange={handleChange} required />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
