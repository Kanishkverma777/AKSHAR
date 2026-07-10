import { useState, useEffect } from 'react';

export default function LookupForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ category: '', code: '', label: '' });

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || '',
        code: initialData.code ?? '',
        label: initialData.label || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, code: Number(form.code) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
            <option value="">— Select —</option>
            <option value="PAPER_TYPE">PAPER_TYPE</option>
            <option value="EXAM_TYPE">EXAM_TYPE</option>
            <option value="PAPER_MODE">PAPER_MODE</option>
            <option value="PAPER_KIND">PAPER_KIND</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Code *</label>
          <input className="form-input" name="code" type="number" value={form.code} onChange={handleChange} required />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Label *</label>
          <input className="form-input" name="label" value={form.label} onChange={handleChange} required maxLength={50} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
