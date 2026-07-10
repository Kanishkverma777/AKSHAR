-- ============================================================
-- Akshar ERP — Seed Data (v2)
-- ============================================================

-- ── Lookup Master (replaces magic numbers) ─────────────────
INSERT INTO lookup_master (category, code, label) VALUES
-- Paper Type
('PAPER_TYPE', 1, 'Theory'),
('PAPER_TYPE', 2, 'Practical'),
-- Exam Type
('EXAM_TYPE', 1, 'UES'),
('EXAM_TYPE', 2, 'NUES'),
-- Paper Mode
('PAPER_MODE', 1, 'Compulsory'),
('PAPER_MODE', 2, 'Elective'),
-- Paper Kind
('PAPER_KIND', 1, 'Mandatory'),
('PAPER_KIND', 2, 'Droppable');

-- ── Academic Sessions ──────────────────────────────────────
INSERT INTO academic_sessions (acad_year, session_name, start_date, end_date, is_current) VALUES
(2023, '2023-24', '2023-07-01', '2024-06-30', false),
(2024, '2024-25', '2024-07-01', '2025-06-30', false),
(2025, '2025-26', '2025-07-01', '2026-06-30', true);

-- ── Departments ────────────────────────────────────────────
INSERT INTO departments (dept_code, dept_name) VALUES
('CSE', 'Computer Science & Engineering'),
('ECE', 'Electronics & Communication Engineering'),
('ME',  'Mechanical Engineering'),
('CE',  'Civil Engineering'),
('MBA', 'Management Studies');

-- ── Employees ──────────────────────────────────────────────
INSERT INTO employees (emp_code, emp_name, email, phone, designation, dept_id) VALUES
('EMP001', 'Dr. Rajesh Kumar',    'rajesh@akshar.edu',  '9876543210', 'Professor & HOD',     1),
('EMP002', 'Dr. Priya Sharma',    'priya@akshar.edu',   '9876543211', 'Professor & HOD',     2),
('EMP003', 'Dr. Anil Gupta',      'anil@akshar.edu',    '9876543212', 'Professor & HOD',     3),
('EMP004', 'Dr. Meena Verma',     'meena@akshar.edu',   '9876543213', 'Associate Professor', 1),
('EMP005', 'Dr. Suresh Patil',    'suresh@akshar.edu',  '9876543214', 'Professor & HOD',     5);

-- ── Assign HODs to departments ─────────────────────────────
UPDATE departments SET hod_emp_id = 1 WHERE dept_code = 'CSE';
UPDATE departments SET hod_emp_id = 2 WHERE dept_code = 'ECE';
UPDATE departments SET hod_emp_id = 3 WHERE dept_code = 'ME';
UPDATE departments SET hod_emp_id = 5 WHERE dept_code = 'MBA';

-- ── Programmes ─────────────────────────────────────────────
INSERT INTO programmes (prog_id, prog_name, prog_short_name, regulatory_body_name, regulatory_body_shortname, min_duration_in_years, max_duration_in_years) VALUES
('UG',   'Under Graduate',    'UG',   'AICTE', 'AICTE', 3, 6),
('PG',   'Post Graduate',     'PG',   'AICTE', 'AICTE', 2, 4),
('PHD',  'Doctorate',         'PhD',  'UGC',   'UGC',   3, 7);

-- ── Courses ────────────────────────────────────────────────
INSERT INTO courses (course_id, course_name, course_short_name, prog_id, dept_id, regulatory_body_name, regulatory_body_shortname, uss_name, uss_shortname, annual_sem_trimester, min_duration_in_years, max_duration_in_years, total_semester_annual) VALUES
('CS1', 'B.Tech Computer Science',    'B.Tech CSE',  'UG', 1, 'AICTE', 'AICTE', 'Semester', 'SEM', 2, 4, 6, 8),
('EC1', 'B.Tech Electronics',         'B.Tech ECE',  'UG', 2, 'AICTE', 'AICTE', 'Semester', 'SEM', 2, 4, 6, 8),
('MB1', 'MBA',                        'MBA',         'PG', 5, 'AICTE', 'AICTE', 'Semester', 'SEM', 2, 2, 4, 4);

-- ── Course Intake ──────────────────────────────────────────
INSERT INTO course_intake (course_id, acad_year, approved_intake, total_admitted) VALUES
('CS1', 2024, 120, 118),
('CS1', 2025, 120, NULL),
('EC1', 2024, 60,  55),
('MB1', 2024, 60,  58);

-- ── Course Scheme ──────────────────────────────────────────
INSERT INTO course_scheme (scheme_id, course_id, acad_year, semester_annual, min_duration_in_years, max_duration_in_years, total_semester_annual, min_credits, max_credits) VALUES
('CS1-2024-S',  'CS1', 2024, 2, 4, 6, 8, 160, 200),
('EC1-2024-S',  'EC1', 2024, 2, 4, 6, 8, 160, 200),
('MB1-2024-S',  'MB1', 2024, 2, 2, 4, 4, 80,  100);

-- ── Subject Master ─────────────────────────────────────────
INSERT INTO subject_master (paper_id, scheme_id, paper_code, paper_name, course_id, year_semester, credits, type_id, exam_id, mode_id, paper_group, paper_sub_group, kind_id, minor_max_marks, major_max_marks, total_max_marks, pass_marks) VALUES
('SUB001', 'CS1-2024-S', 'CS101', 'Data Structures',            'CS1', 1, 4, 1, 3, 5, 'CORE', NULL, 7, 30, 70, 100, 40),
('SUB002', 'CS1-2024-S', 'CS102', 'Database Management Systems', 'CS1', 1, 4, 1, 3, 5, 'CORE', NULL, 7, 30, 70, 100, 40),
('SUB003', 'CS1-2024-S', 'CS103', 'Operating Systems',           'CS1', 2, 4, 1, 3, 5, 'CORE', NULL, 7, 30, 70, 100, 40),
('SUB004', 'CS1-2024-S', 'CS1P1', 'DS Lab',                      'CS1', 1, 2, 2, 3, 5, 'CORE', NULL, 7, 20, 30,  50, 25),
('SUB005', 'EC1-2024-S', 'EC101', 'Signals & Systems',           'EC1', 1, 4, 1, 3, 5, 'CORE', NULL, 7, 30, 70, 100, 40);
