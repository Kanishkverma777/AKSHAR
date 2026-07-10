import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/subjects';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import SubjectForm from '../components/forms/SubjectForm';

const columns = [
  { key: 'paper_code', label: 'Code' },
  { key: 'paper_name', label: 'Subject Name' },
  { key: 'course_name', label: 'Course' },
  { key: 'year_semester', label: 'Semester' },
  { key: 'credits', label: 'Credits' },
  { key: 'type_label', label: 'Type' },
  { key: 'exam_label', label: 'Exam' },
  { key: 'mode_label', label: 'Mode' },
  { key: 'kind_label', label: 'Kind' },
  { key: 'total_max_marks', label: 'Total Marks' },
  { key: 'pass_marks', label: 'Pass' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function Subjects() {
  const { data, loading, handleCreate, refresh } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      try {
        await api.update(modal.paper_id, modal.scheme_id, formData);
        await refresh();
        ok = true;
      } catch { ok = false; }
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.remove(deleteTarget.paper_id, deleteTarget.scheme_id);
        await refresh();
      } catch { /* handled */ }
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Subjects"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Subject"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Subject' : 'Edit Subject'} onClose={() => setModal(null)}>
          <SubjectForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate subject "${deleteTarget.paper_name}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
