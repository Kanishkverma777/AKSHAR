import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/employees';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import EmployeeForm from '../components/forms/EmployeeForm';

const columns = [
  { key: 'emp_code', label: 'Code' },
  { key: 'emp_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'designation', label: 'Designation' },
  { key: 'dept_name', label: 'Department' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function Employees() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null); // null | 'create' | row
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.emp_id, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.emp_id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Employees"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Employee"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />

      {modal && (
        <Modal title={modal === 'create' ? 'New Employee' : 'Edit Employee'} onClose={() => setModal(null)}>
          <EmployeeForm
            initialData={modal === 'create' ? null : modal}
            onSubmit={onSubmit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Deactivate employee "${deleteTarget.emp_name}"?`}
          onConfirm={onConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
