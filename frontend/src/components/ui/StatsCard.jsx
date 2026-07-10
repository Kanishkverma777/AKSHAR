export default function StatsCard({ icon: Icon, label, value, footer, accentColor, delay = 0 }) {
  return (
    <div
      className="stats-card"
      style={{
        '--card-accent': accentColor || 'var(--accent-primary)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="stats-card-header">
        <div
          className="stats-card-icon"
          style={{
            '--icon-bg': `${accentColor || 'var(--accent-primary)'}18`,
            '--icon-color': accentColor || 'var(--accent-primary)',
            background: 'var(--icon-bg)',
            color: 'var(--icon-color)',
          }}
        >
          <Icon size={20} />
        </div>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      {footer && <div className="stats-card-footer">{footer}</div>}
    </div>
  );
}
