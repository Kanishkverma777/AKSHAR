import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="" onClose={onCancel}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>
        <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>Are you sure?</h3>
        <p className="confirm-message">{message || 'This action will deactivate the record.'}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Confirm Delete</button>
      </div>
    </Modal>
  );
}
