import { useState, useEffect } from 'react';

export default function AcademicSessionForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    acad_year: '', session_name: '', start_date: '', end_date: '', is_current: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        acad_year: initialData.acad_year || '',
        session_name: initialData.session_name || '',
        start_date: initialData.start_date ? initialData.start_date.split('T')[0] : '',
        end_date: initialData.end_date ? initialData.end_date.split('T')[0] : '',
        is_current: initialData.is_current || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, acad_year: Number(form.acad_year) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Academic Year *</label>
          <input className="form-input" name="acad_year" type="number" min={1900} value={form.acad_year} onChange={handleChange} required disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Session Name *</label>
          <input className="form-input" name="session_name" value={form.session_name} onChange={handleChange} required maxLength={20} placeholder="e.g. 2025-26" />
        </div>
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input className="form-input" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">End Date *</label>
          <input className="form-input" name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
        </div>
        <div className="form-group full-width">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
            <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange} style={{ width: 16, height: 16 }} />
            Mark as Current Session
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
