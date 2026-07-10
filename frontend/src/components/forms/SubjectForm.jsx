import { useState, useEffect } from 'react';
import * as coursesApi from '../../api/courses';
import * as courseSchemesApi from '../../api/courseSchemes';
import * as lookupsApi from '../../api/lookups';

export default function SubjectForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    paper_id: '', scheme_id: '', paper_code: '', paper_name: '',
    course_id: '', year_semester: '', credits: '',
    type_id: '', exam_id: '', mode_id: '', kind_id: '',
    paper_group: '', paper_sub_group: '',
    minor_max_marks: '', major_max_marks: '', total_max_marks: '', pass_marks: '',
  });
  const [courses, setCourses] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [lookups, setLookups] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        paper_id: initialData.paper_id || '',
        scheme_id: initialData.scheme_id || '',
        paper_code: initialData.paper_code || '',
        paper_name: initialData.paper_name || '',
        course_id: initialData.course_id?.trim() || '',
        year_semester: initialData.year_semester || '',
        credits: initialData.credits ?? '',
        type_id: initialData.type_id || '',
        exam_id: initialData.exam_id || '',
        mode_id: initialData.mode_id || '',
        kind_id: initialData.kind_id || '',
        paper_group: initialData.paper_group || '',
        paper_sub_group: initialData.paper_sub_group || '',
        minor_max_marks: initialData.minor_max_marks ?? '',
        major_max_marks: initialData.major_max_marks ?? '',
        total_max_marks: initialData.total_max_marks ?? '',
        pass_marks: initialData.pass_marks ?? '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    coursesApi.getAll().then((r) => setCourses(r.data || [])).catch(() => {});
    courseSchemesApi.getAll().then((r) => setSchemes(r.data || [])).catch(() => {});
    lookupsApi.getAll().then((r) => setLookups(r.data || [])).catch(() => {});
  }, []);

  const lookupsByCategory = (cat) => lookups.filter((l) => l.category === cat);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    // Auto-calculate total marks
    if (e.target.name === 'minor_max_marks' || e.target.name === 'major_max_marks') {
      const minor = Number(updated.minor_max_marks) || 0;
      const major = Number(updated.major_max_marks) || 0;
      updated.total_max_marks = minor + major;
    }
    setForm(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      year_semester: Number(form.year_semester),
      credits: Number(form.credits),
      type_id: Number(form.type_id),
      exam_id: Number(form.exam_id),
      mode_id: Number(form.mode_id),
      kind_id: Number(form.kind_id),
      minor_max_marks: Number(form.minor_max_marks),
      major_max_marks: Number(form.major_max_marks),
      total_max_marks: Number(form.total_max_marks),
      pass_marks: Number(form.pass_marks),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Paper ID *</label>
          <input className="form-input" name="paper_id" value={form.paper_id} onChange={handleChange} required maxLength={6} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Scheme *</label>
          <select className="form-select" name="scheme_id" value={form.scheme_id} onChange={handleChange} required disabled={!!initialData}>
            <option value="">— Select —</option>
            {schemes.map((s) => <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_id}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Paper Code *</label>
          <input className="form-input" name="paper_code" value={form.paper_code} onChange={handleChange} required maxLength={10} />
        </div>
        <div className="form-group">
          <label className="form-label">Paper Name *</label>
          <input className="form-input" name="paper_name" value={form.paper_name} onChange={handleChange} required maxLength={100} />
        </div>
        <div className="form-group">
          <label className="form-label">Course *</label>
          <select className="form-select" name="course_id" value={form.course_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {courses.map((c) => <option key={c.course_id} value={c.course_id.trim()}>{c.course_short_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Year/Semester *</label>
          <input className="form-input" name="year_semester" type="number" min={1} value={form.year_semester} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Credits *</label>
          <input className="form-input" name="credits" type="number" min={0} value={form.credits} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Type *</label>
          <select className="form-select" name="type_id" value={form.type_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {lookupsByCategory('PAPER_TYPE').map((l) => <option key={l.lookup_id} value={l.lookup_id}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Exam *</label>
          <select className="form-select" name="exam_id" value={form.exam_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {lookupsByCategory('EXAM_TYPE').map((l) => <option key={l.lookup_id} value={l.lookup_id}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Mode *</label>
          <select className="form-select" name="mode_id" value={form.mode_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {lookupsByCategory('PAPER_MODE').map((l) => <option key={l.lookup_id} value={l.lookup_id}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Kind *</label>
          <select className="form-select" name="kind_id" value={form.kind_id} onChange={handleChange} required>
            <option value="">— Select —</option>
            {lookupsByCategory('PAPER_KIND').map((l) => <option key={l.lookup_id} value={l.lookup_id}>{l.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Group</label>
          <input className="form-input" name="paper_group" value={form.paper_group} onChange={handleChange} maxLength={5} />
        </div>
        <div className="form-group">
          <label className="form-label">Sub Group</label>
          <input className="form-input" name="paper_sub_group" value={form.paper_sub_group} onChange={handleChange} maxLength={5} />
        </div>
        <div className="form-group">
          <label className="form-label">Minor Marks *</label>
          <input className="form-input" name="minor_max_marks" type="number" min={0} value={form.minor_max_marks} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Major Marks *</label>
          <input className="form-input" name="major_max_marks" type="number" min={0} value={form.major_max_marks} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Total Marks</label>
          <input className="form-input" name="total_max_marks" type="number" value={form.total_max_marks} readOnly style={{ opacity: 0.6 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Pass Marks *</label>
          <input className="form-input" name="pass_marks" type="number" min={0} value={form.pass_marks} onChange={handleChange} required />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
