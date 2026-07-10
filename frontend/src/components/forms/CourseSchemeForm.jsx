import { useState, useEffect } from 'react';
import * as coursesApi from '../../api/courses';
import * as sessionsApi from '../../api/academicSessions';

export default function CourseSchemeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    scheme_id: '', course_id: '', acad_year: '', semester_annual: '',
    min_duration_in_years: '', max_duration_in_years: '',
    total_semester_annual: '', min_credits: '', max_credits: '',
  });
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        scheme_id: initialData.scheme_id || '',
        course_id: initialData.course_id?.trim() || '',
        acad_year: initialData.acad_year || '',
        semester_annual: initialData.semester_annual || '',
        min_duration_in_years: initialData.min_duration_in_years || '',
        max_duration_in_years: initialData.max_duration_in_years || '',
        total_semester_annual: initialData.total_semester_annual || '',
        min_credits: initialData.min_credits || '',
        max_credits: initialData.max_credits || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    coursesApi.getAll().then((r) => setCourses(r.data || [])).catch(() => {});
    sessionsApi.getAll().then((r) => setSessions(r.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      acad_year: form.acad_year ? Number(form.acad_year) : null,
      semester_annual: Number(form.semester_annual),
      min_duration_in_years: Number(form.min_duration_in_years),
      max_duration_in_years: Number(form.max_duration_in_years),
      total_semester_annual: Number(form.total_semester_annual),
      min_credits: Number(form.min_credits),
      max_credits: Number(form.max_credits),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Scheme ID *</label>
          <input className="form-input" name="scheme_id" value={form.scheme_id} onChange={handleChange} required maxLength={12} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Course *</label>
          <select className="form-select" name="course_id" value={form.course_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {courses.map((c) => <option key={c.course_id} value={c.course_id.trim()}>{c.course_short_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Academic Year</label>
          <select className="form-select" name="acad_year" value={form.acad_year} onChange={handleChange}>
            <option value="">— Select —</option>
            {sessions.map((s) => <option key={s.acad_year} value={s.acad_year}>{s.session_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Semester/Annual *</label>
          <input className="form-input" name="semester_annual" type="number" value={form.semester_annual} onChange={handleChange} required />
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
        <div className="form-group">
          <label className="form-label">Min Credits *</label>
          <input className="form-input" name="min_credits" type="number" min={0} value={form.min_credits} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Max Credits *</label>
          <input className="form-input" name="max_credits" type="number" min={0} value={form.max_credits} onChange={handleChange} required />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
