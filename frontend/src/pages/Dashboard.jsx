import { useEffect, useState } from 'react';
import { Users, Building2, BookOpen, CalendarDays, GraduationCap, BookMarked, TrendingUp, FileSpreadsheet } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import * as employeesApi from '../api/employees';
import * as departmentsApi from '../api/departments';
import * as coursesApi from '../api/courses';
import * as programmesApi from '../api/programmes';
import * as sessionsApi from '../api/academicSessions';
import * as subjectsApi from '../api/subjects';
import * as courseIntakeApi from '../api/courseIntake';
import * as courseSchemesApi from '../api/courseSchemes';

export default function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0, departments: 0, courses: 0, programmes: 0,
    sessions: 0, subjects: 0, intakes: 0, schemes: 0,
    currentSession: '—',
    recentEmployees: [], recentCourses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [emp, dept, crs, prog, sess, sub, intake, sch] = await Promise.all([
          employeesApi.getAll(),
          departmentsApi.getAll(),
          coursesApi.getAll(),
          programmesApi.getAll(),
          sessionsApi.getAll(),
          subjectsApi.getAll(),
          courseIntakeApi.getAll(),
          courseSchemesApi.getAll(),
        ]);
        const currentSess = (sess.data || []).find((s) => s.is_current);
        setStats({
          employees: emp.count || 0,
          departments: dept.count || 0,
          courses: crs.count || 0,
          programmes: prog.count || 0,
          sessions: sess.count || 0,
          subjects: sub.count || 0,
          intakes: intake.count || 0,
          schemes: sch.count || 0,
          currentSession: currentSess ? currentSess.session_name : '—',
          recentEmployees: (emp.data || []).slice(0, 5),
          recentCourses: (crs.data || []).slice(0, 5),
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="loader"><div className="spinner" /></div>;
  }

  return (
    <div>
      <div className="dashboard-welcome">
        <h2>Welcome to Akshar ERP</h2>
        <p>Academic session {stats.currentSession} • Manage your institution from one place</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={Users} label="Employees" value={stats.employees} footer="Active staff members" accentColor="#3b82f6" delay={0} />
        <StatsCard icon={Building2} label="Departments" value={stats.departments} footer="Academic departments" accentColor="#8b5cf6" delay={50} />
        <StatsCard icon={BookOpen} label="Courses" value={stats.courses} footer="Offered courses" accentColor="#10b981" delay={100} />
        <StatsCard icon={GraduationCap} label="Programmes" value={stats.programmes} footer="UG / PG / PhD" accentColor="#f59e0b" delay={150} />
        <StatsCard icon={BookMarked} label="Subjects" value={stats.subjects} footer="Across all schemes" accentColor="#ef4444" delay={200} />
        <StatsCard icon={TrendingUp} label="Intakes" value={stats.intakes} footer="Course intake records" accentColor="#06b6d4" delay={250} />
        <StatsCard icon={FileSpreadsheet} label="Schemes" value={stats.schemes} footer="Course schemes defined" accentColor="#ec4899" delay={300} />
        <StatsCard icon={CalendarDays} label="Sessions" value={stats.sessions} footer={`Current: ${stats.currentSession}`} accentColor="#14b8a6" delay={350} />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section" style={{ animationDelay: '400ms' }}>
          <div className="dashboard-section-title">
            <Users size={16} /> Recent Employees
          </div>
          <div className="quick-list">
            {stats.recentEmployees.map((e) => (
              <div key={e.emp_id} className="quick-list-item">
                <span>{e.emp_name}</span>
                <span>{e.designation || e.emp_code}</span>
              </div>
            ))}
            {stats.recentEmployees.length === 0 && (
              <div className="quick-list-item"><span style={{ color: 'var(--text-tertiary)' }}>No employees yet</span></div>
            )}
          </div>
        </div>

        <div className="dashboard-section" style={{ animationDelay: '450ms' }}>
          <div className="dashboard-section-title">
            <BookOpen size={16} /> Active Courses
          </div>
          <div className="quick-list">
            {stats.recentCourses.map((c) => (
              <div key={c.course_id} className="quick-list-item">
                <span>{c.course_short_name}</span>
                <span>{c.prog_name || c.course_id}</span>
              </div>
            ))}
            {stats.recentCourses.length === 0 && (
              <div className="quick-list-item"><span style={{ color: 'var(--text-tertiary)' }}>No courses yet</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
