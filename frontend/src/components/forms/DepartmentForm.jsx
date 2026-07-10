import { useState, useEffect } from 'react';
import * as employeesApi from '../../api/employees';

export default function DepartmentForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ dept_code: '', dept_name: '', hod_emp_id: '' });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        dept_code: initialData.dept_code || '',
        dept_name: initialData.dept_name || '',
        hod_emp_id: initialData.hod_emp_id || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    employeesApi.getAll().then((res) => setEmployees(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, hod_emp_id: form.hod_emp_id ? Number(form.hod_emp_id) : null });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Department Code *</label>
          <input className="form-input" name="dept_code" value={form.dept_code} onChange={handleChange} required maxLength={10} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Department Name *</label>
          <input className="form-input" name="dept_name" value={form.dept_name} onChange={handleChange} required maxLength={50} />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Head of Department</label>
          <select className="form-select" name="hod_emp_id" value={form.hod_emp_id} onChange={handleChange}>
            <option value="">— Select HOD —</option>
            {employees.map((e) => (
              <option key={e.emp_id} value={e.emp_id}>{e.emp_name} ({e.emp_code})</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}
