import { useState, useEffect } from 'react';
import * as coursesApi from '../../api/courses';
import * as sessionsApi from '../../api/academicSessions';

export default function CourseIntakeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    course_id: '', acad_year: '', approved_intake: '', total_admitted: '',
  });
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        course_id: initialData.course_id?.trim() || '',
        acad_year: initialData.acad_year || '',
        approved_intake: initialData.approved_intake || '',
        total_admitted: initialData.total_admitted ?? '',
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
      course_id: form.course_id,
      acad_year: Number(form.acad_year),
      approved_intake: Number(form.approved_intake),
      total_admitted: form.total_admitted !== '' ? Number(form.total_admitted) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Course *</label>
          <select className="form-select" name="course_id" value={form.course_id} onChange={handleChange} required disabled={!!initialData}>
            <option value="">— Select —</option>
            {courses.map((c) => <option key={c.course_id} value={c.course_id.trim()}>{c.course_short_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Academic Year *</label>
          <select className="form-select" name="acad_year" value={form.acad_year} onChange={handleChange} required disabled={!!initialData}>
            <option value="">— Select —</option>
            {sessions.map((s) => <option key={s.acad_year} value={s.acad_year}>{s.session_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Approved Intake *</label>
          <input className="form-input" name="approved_intake" type="number" min={0} value={form.approved_intake} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Total Admitted</label>
          <input className="form-input" name="total_admitted" type="number" min={0} value={form.total_admitted} onChange={handleChange} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
