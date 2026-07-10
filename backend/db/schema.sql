-- ============================================================
-- Akshar ERP — PostgreSQL Schema (v2 — with improvements)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- UTILITY: auto-update updated_at on every UPDATE
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- NEW TABLE: Employees (resolves the departments FK)
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    emp_id        SERIAL PRIMARY KEY,
    emp_code      VARCHAR(10) UNIQUE NOT NULL,
    emp_name      VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE,
    phone         VARCHAR(15),
    designation   VARCHAR(50),
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_employees_updated
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- NEW TABLE: Lookup Master (replaces magic numbers 1,2,3)
-- ============================================================
CREATE TABLE IF NOT EXISTS lookup_master (
    lookup_id   SERIAL PRIMARY KEY,
    category    VARCHAR(30) NOT NULL,        -- 'PAPER_TYPE', 'EXAM_TYPE', 'PAPER_MODE', 'PAPER_KIND'
    code        INTEGER NOT NULL,
    label       VARCHAR(50) NOT NULL,        -- 'Theory', 'Practical', etc.
    is_active   BOOLEAN DEFAULT true,
    UNIQUE(category, code)
);


-- ============================================================
-- NEW TABLE: Academic Sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS academic_sessions (
    acad_year       INTEGER PRIMARY KEY,
    session_name    VARCHAR(20) NOT NULL,     -- '2024-25'
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    is_current      BOOLEAN DEFAULT false,
    CONSTRAINT chk_session_dates CHECK (end_date > start_date)
);


-- ============================================================
-- 1. Departments
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    dept_id         SERIAL PRIMARY KEY,
    dept_code       VARCHAR(10) UNIQUE NOT NULL,
    dept_name       VARCHAR(50) NOT NULL,
    hod_emp_id      INTEGER REFERENCES employees(emp_id),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_departments_updated
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Add dept_id FK to employees (circular: emp belongs to dept)
ALTER TABLE employees ADD COLUMN dept_id INTEGER REFERENCES departments(dept_id);


-- ============================================================
-- 2. Programmes
-- ============================================================
CREATE TABLE IF NOT EXISTS programmes (
    prog_id                     VARCHAR(10) PRIMARY KEY,
    prog_name                   VARCHAR(50) NOT NULL,
    prog_short_name             VARCHAR(20) NOT NULL,
    regulatory_body_name        VARCHAR(50),
    regulatory_body_shortname   VARCHAR(10),
    min_duration_in_years       INTEGER NOT NULL,
    max_duration_in_years       INTEGER NOT NULL,
    is_active                   BOOLEAN DEFAULT true,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_prog_duration CHECK (max_duration_in_years >= min_duration_in_years)
);

CREATE TRIGGER trg_programmes_updated
    BEFORE UPDATE ON programmes
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- 3. Courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    course_id                   CHAR(3) PRIMARY KEY,
    course_name                 VARCHAR(100) NOT NULL,
    course_short_name           VARCHAR(20) NOT NULL,
    prog_id                     VARCHAR(10) REFERENCES programmes(prog_id),
    dept_id                     INTEGER REFERENCES departments(dept_id),
    regulatory_body_name        VARCHAR(50),
    regulatory_body_shortname   VARCHAR(10),
    uss_name                    VARCHAR(10) NOT NULL,
    uss_shortname               VARCHAR(10) NOT NULL,
    annual_sem_trimester        INTEGER NOT NULL,
    min_duration_in_years       INTEGER NOT NULL,
    max_duration_in_years       INTEGER NOT NULL,
    total_semester_annual       INTEGER NOT NULL,
    is_active                   BOOLEAN DEFAULT true,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_course_duration CHECK (max_duration_in_years >= min_duration_in_years)
);

CREATE TRIGGER trg_courses_updated
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- 4. Course Intake
-- ============================================================
CREATE TABLE IF NOT EXISTS course_intake (
    course_id           CHAR(3) NOT NULL REFERENCES courses(course_id),
    acad_year           INTEGER NOT NULL REFERENCES academic_sessions(acad_year),
    approved_intake     INTEGER NOT NULL CHECK (approved_intake >= 0),
    total_admitted      INTEGER,
    is_active           BOOLEAN DEFAULT true,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id, acad_year)
);

CREATE TRIGGER trg_course_intake_updated
    BEFORE UPDATE ON course_intake
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- 5. Course Scheme
-- ============================================================
CREATE TABLE IF NOT EXISTS course_scheme (
    scheme_id               VARCHAR(12) PRIMARY KEY,
    course_id               CHAR(3) NOT NULL REFERENCES courses(course_id),
    acad_year               INTEGER REFERENCES academic_sessions(acad_year),
    semester_annual         INTEGER NOT NULL,
    min_duration_in_years   INTEGER NOT NULL,
    max_duration_in_years   INTEGER NOT NULL,
    total_semester_annual   INTEGER NOT NULL,
    min_credits             INTEGER NOT NULL,
    max_credits             INTEGER NOT NULL,
    is_active               BOOLEAN DEFAULT true,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_scheme_credits CHECK (max_credits >= min_credits)
);

CREATE TRIGGER trg_course_scheme_updated
    BEFORE UPDATE ON course_scheme
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- 6. Subject Master
-- ============================================================
CREATE TABLE IF NOT EXISTS subject_master (
    paper_id            VARCHAR(6) NOT NULL,
    scheme_id           VARCHAR(12) NOT NULL REFERENCES course_scheme(scheme_id),
    paper_code          VARCHAR(10) NOT NULL,
    paper_name          VARCHAR(100) NOT NULL,
    course_id           CHAR(3) NOT NULL REFERENCES courses(course_id),
    year_semester       INTEGER NOT NULL,
    credits             INTEGER NOT NULL CHECK (credits >= 0),
    type_id             INTEGER NOT NULL REFERENCES lookup_master(lookup_id),
    exam_id             INTEGER NOT NULL REFERENCES lookup_master(lookup_id),
    mode_id             INTEGER NOT NULL REFERENCES lookup_master(lookup_id),
    paper_group         VARCHAR(5),
    paper_sub_group     VARCHAR(5),
    kind_id             INTEGER NOT NULL REFERENCES lookup_master(lookup_id),
    minor_max_marks     INTEGER NOT NULL CHECK (minor_max_marks >= 0),
    major_max_marks     INTEGER NOT NULL CHECK (major_max_marks >= 0),
    total_max_marks     INTEGER NOT NULL,
    pass_marks          INTEGER NOT NULL,
    is_active           BOOLEAN DEFAULT true,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (paper_id, scheme_id),
    CONSTRAINT chk_total_marks CHECK (total_max_marks = minor_max_marks + major_max_marks),
    CONSTRAINT chk_pass_marks  CHECK (pass_marks >= 0 AND pass_marks <= total_max_marks)
);

CREATE TRIGGER trg_subject_master_updated
    BEFORE UPDATE ON subject_master
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- INDEXES on FK columns for faster JOINs
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_employees_dept       ON employees(dept_id);
CREATE INDEX IF NOT EXISTS idx_departments_hod      ON departments(hod_emp_id);
CREATE INDEX IF NOT EXISTS idx_courses_prog         ON courses(prog_id);
CREATE INDEX IF NOT EXISTS idx_courses_dept         ON courses(dept_id);
CREATE INDEX IF NOT EXISTS idx_course_intake_year   ON course_intake(acad_year);
CREATE INDEX IF NOT EXISTS idx_course_scheme_course ON course_scheme(course_id);
CREATE INDEX IF NOT EXISTS idx_course_scheme_year   ON course_scheme(acad_year);
CREATE INDEX IF NOT EXISTS idx_subject_scheme       ON subject_master(scheme_id);
CREATE INDEX IF NOT EXISTS idx_subject_course       ON subject_master(course_id);
CREATE INDEX IF NOT EXISTS idx_subject_semester     ON subject_master(year_semester);
