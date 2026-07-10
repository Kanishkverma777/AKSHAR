import { useState, useEffect } from 'react';
import * as departmentsApi from '../../api/departments';

export default function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    emp_code: '', emp_name: '', email: '', phone: '', designation: '', dept_id: '',
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        emp_code: initialData.emp_code || '',
        emp_name: initialData.emp_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        designation: initialData.designation || '',
        dept_id: initialData.dept_id || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    departmentsApi.getAll().then((res) => setDepartments(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dept_id: form.dept_id ? Number(form.dept_id) : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Employee Code *</label>
          <input className="form-input" name="emp_code" value={form.emp_code} onChange={handleChange} required maxLength={10} disabled={!!initialData} />
        </div>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" name="emp_name" value={form.emp_name} onChange={handleChange} required maxLength={100} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" name="phone" value={form.phone} onChange={handleChange} maxLength={15} />
        </div>
        <div className="form-group">
          <label className="form-label">Designation</label>
          <input className="form-input" name="designation" value={form.designation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-select" name="dept_id" value={form.dept_id} onChange={handleChange}>
            <option value="">— Select —</option>
            {departments.map((d) => (
              <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
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
