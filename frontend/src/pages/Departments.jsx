import { useState, useEffect } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/departments';
import * as employeesApi from '../api/employees';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import DepartmentForm from '../components/forms/DepartmentForm';

export default function Departments() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    employeesApi.getAll().then((r) => setEmployees(r.data || [])).catch(() => {});
  }, []);

  const getHodName = (hodId) => {
    const emp = employees.find((e) => e.emp_id === hodId);
    return emp ? emp.emp_name : '—';
  };

  const columns = [
    { key: 'dept_code', label: 'Code' },
    { key: 'dept_name', label: 'Department Name' },
    { key: 'hod_emp_id', label: 'HOD', render: (row) => getHodName(row.hod_emp_id) },
    { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
  ];

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.dept_id, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.dept_id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Departments"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Department"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Department' : 'Edit Department'} onClose={() => setModal(null)}>
          <DepartmentForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate department "${deleteTarget.dept_name}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
