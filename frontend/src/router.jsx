import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Programmes from './pages/Programmes';
import Courses from './pages/Courses';
import CourseIntake from './pages/CourseIntake';
import CourseSchemes from './pages/CourseSchemes';
import Subjects from './pages/Subjects';
import Lookups from './pages/Lookups';
import AcademicSessions from './pages/AcademicSessions';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/employees', element: <Employees /> },
      { path: '/departments', element: <Departments /> },
      { path: '/programmes', element: <Programmes /> },
      { path: '/courses', element: <Courses /> },
      { path: '/course-intake', element: <CourseIntake /> },
      { path: '/course-schemes', element: <CourseSchemes /> },
      { path: '/subjects', element: <Subjects /> },
      { path: '/lookups', element: <Lookups /> },
      { path: '/academic-sessions', element: <AcademicSessions /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
