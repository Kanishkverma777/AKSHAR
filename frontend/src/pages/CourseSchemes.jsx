import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/courseSchemes';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import CourseSchemeForm from '../components/forms/CourseSchemeForm';

const columns = [
  { key: 'scheme_id', label: 'Scheme ID' },
  { key: 'course_id', label: 'Course', render: (row) => row.course_id?.trim() },
  { key: 'acad_year', label: 'Year' },
  { key: 'semester_annual', label: 'Sem/Annual' },
  { key: 'min_credits', label: 'Min Credits' },
  { key: 'max_credits', label: 'Max Credits' },
  { key: 'total_semester_annual', label: 'Total Sem' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function CourseSchemes() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.scheme_id, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.scheme_id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Course Schemes"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Scheme"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Scheme' : 'Edit Scheme'} onClose={() => setModal(null)}>
          <CourseSchemeForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate scheme "${deleteTarget.scheme_id}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
