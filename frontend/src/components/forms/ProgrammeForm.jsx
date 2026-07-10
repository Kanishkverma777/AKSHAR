import { useState, useEffect } from 'react';

export default function ProgrammeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    prog_id: '', prog_name: '', prog_short_name: '',
    regulatory_body_name: '', regulatory_body_shortname: '',
    min_duration_in_years: '', max_duration_in_years: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        prog_id: initialData.prog_id || '',
        prog_name: initialData.prog_name || '',
        prog_short_name: initialData.prog_short_name || '',
        regulatory_body_name: initialData.regulatory_body_name || '',
        regulatory_body_shortname: initialData.regulatory_body_shortname || '',
        min_duration_in_years: initialData.min_duration_in_years || '',
        max_duration_in_years: initialData.max_duration_in_years || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      min_duration_in_years: Number(form.min_duration_in_years),
      max_duration_in_years: Number(form.max_duration_in_years),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Programme ID *</label>
          <input className="form-input" name="prog_id" value={form.prog_id} onChange={handleChange} required maxLength={10} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Programme Name *</label>
          <input className="form-input" name="prog_name" value={form.prog_name} onChange={handleChange} required maxLength={50} />
        </div>
        <div className="form-group">
          <label className="form-label">Short Name *</label>
          <input className="form-input" name="prog_short_name" value={form.prog_short_name} onChange={handleChange} required maxLength={20} />
        </div>
        <div className="form-group">
          <label className="form-label">Regulatory Body</label>
          <input className="form-input" name="regulatory_body_name" value={form.regulatory_body_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Body Short Name</label>
          <input className="form-input" name="regulatory_body_shortname" value={form.regulatory_body_shortname} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Min Duration (Years) *</label>
          <input className="form-input" name="min_duration_in_years" type="number" min={1} value={form.min_duration_in_years} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Max Duration (Years) *</label>
          <input className="form-input" name="max_duration_in_years" type="number" min={1} value={form.max_duration_in_years} onChange={handleChange} required />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
