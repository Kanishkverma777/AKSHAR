export default function StatusBadge({ active, label }) {
  const isActive = active === true || active === 'true';
  return (
    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      <span className="status-dot" />
      {label || (isActive ? 'Active' : 'Inactive')}
    </span>
  );
}
