import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import * as api from '../api/lookups';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import LookupForm from '../components/forms/LookupForm';

const columns = [
  { key: 'lookup_id', label: 'ID' },
  { key: 'category', label: 'Category' },
  { key: 'code', label: 'Code' },
  { key: 'label', label: 'Label' },
  { key: 'is_active', label: 'Status', render: (row) => <StatusBadge active={row.is_active} /> },
];

export default function Lookups() {
  const { data, loading, handleCreate, handleUpdate, handleDelete } = useCrud(api);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onSubmit = async (formData) => {
    let ok;
    if (modal === 'create') {
      ok = await handleCreate(formData);
    } else {
      ok = await handleUpdate(modal.lookup_id, formData);
    }
    if (ok) setModal(null);
  };

  const onConfirmDelete = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget.lookup_id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <DataTable
        title="Lookup Master"
        columns={columns}
        data={data}
        loading={loading}
        addLabel="Add Lookup"
        onAdd={() => setModal('create')}
        onEdit={(row) => setModal(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      {modal && (
        <Modal title={modal === 'create' ? 'New Lookup' : 'Edit Lookup'} onClose={() => setModal(null)}>
          <LookupForm initialData={modal === 'create' ? null : modal} onSubmit={onSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Deactivate lookup "${deleteTarget.label}"?`} onConfirm={onConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
