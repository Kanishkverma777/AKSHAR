import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/academicSessions';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AcademicSessionForm from '../components/forms/AcademicSessionForm';
import { formatDate } from '../utils/formatters';

const columns = [
  { key: 'acad_year', label: 'Year' },
  { key: 'session_name', label: 'Session' },
  { key: 'start_date', label: 'Start Date', render: (row) => formatDate(row.start_date) },
  { key: 'end_date', label: 'End Date', render: (row) => formatDate(row.end_date) },
  {
    key: 'is_current', label: 'Current',
    render: (row) => row.is_current
      ? <span className="status-badge current"><span className="status-dot" />Current</span>
      : <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>—</span>,
  },
];

export default function AcademicSessions() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.acad_year, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.acad_year);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Academic Sessions"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Session"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Session' : 'Edit Session'} onClose={() => setModal(null)}>
          <AcademicSessionForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Delete session "${deleteTarget.session_name}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
