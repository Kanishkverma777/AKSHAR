import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/programmes';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import ProgrammeForm from '../components/forms/ProgrammeForm';

const columns = [
  { key: 'prog_id', label: 'ID' },
  { key: 'prog_name', label: 'Programme' },
  { key: 'prog_short_name', label: 'Short Name' },
  { key: 'regulatory_body_shortname', label: 'Reg. Body' },
  { key: 'min_duration_in_years', label: 'Min Years' },
  { key: 'max_duration_in_years', label: 'Max Years' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function Programmes() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.prog_id, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.prog_id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Programmes"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Programme"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Programme' : 'Edit Programme'} onClose={() => setModal(null)}>
          <ProgrammeForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate programme "${deleteTarget.prog_name}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
