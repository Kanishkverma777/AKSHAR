import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/courseIntake';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import CourseIntakeForm from '../components/forms/CourseIntakeForm';

const columns = [
  { key: 'course_id', label: 'Course', render: (row) => row.course_id?.trim() },
  { key: 'acad_year', label: 'Academic Year' },
  { key: 'approved_intake', label: 'Approved Intake' },
  { key: 'total_admitted', label: 'Total Admitted', render: (row) => row.total_admitted ?? '—' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function CourseIntake() {
  const { data, loading, handleCreate, handleDelete, refresh } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      try {
        await api.update(modal.course_id?.trim(), modal.acad_year, formData);
        await refresh();
        ok = true;
      } catch (err) {
        ok = false;
      }
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.remove(deleteTarget.course_id?.trim(), deleteTarget.acad_year);
        await refresh();
      } catch (err) { /* handled by interceptor */ }
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Course Intake"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Intake"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Intake' : 'Edit Intake'} onClose={() => setModal(null)}>
          <CourseIntakeForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate intake for course "${deleteTarget.course_id?.trim()}" year ${deleteTarget.acad_year}?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
