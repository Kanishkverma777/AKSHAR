import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, GraduationCap,
  BookOpen, TrendingUp, FileSpreadsheet, BookMarked,
  Tag, CalendarDays, PanelLeftClose, PanelLeft,
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Human Resources',
    items: [
      { to: '/employees', icon: Users, label: 'Employees' },
      { to: '/departments', icon: Building2, label: 'Departments' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { to: '/programmes', icon: GraduationCap, label: 'Programmes' },
      { to: '/courses', icon: BookOpen, label: 'Courses' },
      { to: '/course-intake', icon: TrendingUp, label: 'Course Intake' },
      { to: '/course-schemes', icon: FileSpreadsheet, label: 'Course Schemes' },
      { to: '/subjects', icon: BookMarked, label: 'Subjects' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/lookups', icon: Tag, label: 'Lookups' },
      { to: '/academic-sessions', icon: CalendarDays, label: 'Sessions' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-item-icon" size={20} />
                  <span className="nav-item-label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          <span className="nav-item-label">{collapsed ? '' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  );
}
