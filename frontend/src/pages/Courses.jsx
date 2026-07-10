import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/courses';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import CourseForm from '../components/forms/CourseForm';

const columns = [
  { key: 'course_id', label: 'ID', render: (row) => row.course_id?.trim() },
  { key: 'course_name', label: 'Course Name' },
  { key: 'course_short_name', label: 'Short Name' },
  { key: 'prog_name', label: 'Programme' },
  { key: 'dept_name', label: 'Department' },
  { key: 'uss_shortname', label: 'USS' },
  { key: 'total_semester_annual', label: 'Semesters' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function Courses() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.course_id?.trim(), formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.course_id?.trim());
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Courses"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Course"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Course' : 'Edit Course'} onClose={() => setModal(null)}>
          <CourseForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate course "${deleteTarget.course_short_name}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
