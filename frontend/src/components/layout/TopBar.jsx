import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/': { title: 'Dashboard', crumb: 'Overview' },
  '/employees': { title: 'Employees', crumb: 'Human Resources' },
  '/departments': { title: 'Departments', crumb: 'Human Resources' },
  '/programmes': { title: 'Programmes', crumb: 'Academics' },
  '/courses': { title: 'Courses', crumb: 'Academics' },
  '/course-intake': { title: 'Course Intake', crumb: 'Academics' },
  '/course-schemes': { title: 'Course Schemes', crumb: 'Academics' },
  '/subjects': { title: 'Subjects', crumb: 'Academics' },
  '/lookups': { title: 'Lookups', crumb: 'Configuration' },
  '/academic-sessions': { title: 'Academic Sessions', crumb: 'Configuration' },
};

export default function TopBar() {
  const location = useLocation();

  const route = routeTitles[location.pathname] || { title: 'Not Found', crumb: '' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{route.title}</h1>
        <div className="topbar-breadcrumb">
          Akshar ERP / {route.crumb} / <span>{route.title}</span>
        </div>
      </div>
      <div className="topbar-right">
      </div>
    </header>
  );
}
