# AKSHAR ERP 🎓

> A modern, robust, and scalable Educational Enterprise Resource Planning (ERP) backend API built with Node.js, Express, and PostgreSQL.

AKSHAR ERP provides a strict, highly-relational backend architecture for managing university/college operations. It features a normalized database schema enforcing referential integrity across departments, employees, academic sessions, courses, and subject allocations.

## 🚀 Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/) (v18+)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (pg-pool)
* **Validation:** [express-validator](https://express-validator.github.io/docs/)
* **Frontend:** Vanilla HTML/CSS/JS (Served statically via Express)

## 📂 Project Structure

```text
├── controllers/          # Business logic and database queries
├── db/
│   ├── pool.js           # PostgreSQL connection pool configuration
│   ├── schema.sql        # Highly-normalized DDL schema definitions
│   └── seed.sql          # Initial lookup and mock data for development
├── middleware/
│   ├── errorHandler.js   # Global API error boundary
│   └── validate.js       # Express-validator error formatting
├── public/               # Static frontend assets (HTML, CSS, JS)
├── routes/               # Express route definitions & input validation schemas
├── .env.example          # Environment variable template
└── server.js             # Express application entry point
```

## 🛠️ Local Development Setup

### 1. Prerequisites
* Node.js installed on your machine.
* PostgreSQL server running locally or remotely.

### 2. Clone & Install
```bash
git clone https://github.com/Kanishkverma777/AKSHAR.git
cd AKSHAR
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure your database credentials:
```env
PORT=3000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=akshar_erp
```

### 4. Database Initialization
Ensure you have created a database named `akshar_erp` in your PostgreSQL instance. Then, initialize the schema and seed data:
```bash
# Log into psql
psql -U your_postgres_username

# Run inside psql shell:
CREATE DATABASE akshar_erp;
\c akshar_erp
\i db/schema.sql
\i db/seed.sql
```

### 5. Start the Server
```bash
# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

The API will be available at `http://localhost:3000`.

## 📡 API Modules

The ERP exposes RESTful endpoints for the following core entities. All routes are prefixed with `/api`.

| Module | Route Prefix | Description |
| :--- | :--- | :--- |
| **Health** | `/api/health` | API and Database connection status check. |
| **Lookups** | `/api/lookups` | System-wide Enums/Lookup definitions (Exam types, Employee types, etc). |
| **Academic Sessions** | `/api/academic-sessions` | Management of academic years and active sessions. |
| **Departments** | `/api/departments` | Academic and administrative departments. |
| **Programmes** | `/api/programmes` | Degree programmes (e.g., B.Tech, M.Tech). |
| **Courses** | `/api/courses` | Specific courses mapped to programmes. |
| **Course Intake** | `/api/course-intake` | Batch/Intake capacity management per course. |
| **Course Schemes** | `/api/course-schemes` | Syllabus schemes linked to specific intake years. |
| **Subjects** | `/api/subjects` | Granular subject/paper definitions with strict lookup constraints. |
| **Employees** | `/api/employees` | Faculty and staff management. |

## 🏗️ Architecture & Design Principles

* **Strict Relational Integrity:** Avoids hard-coded strings in the database. Entities like `subject_type`, `exam_type`, and `mode_type` strictly reference the `lookup_master` table using integer Foreign Keys.
* **Controller-Service Pattern:** Route files handle HTTP and validation, offloading pure business and DB logic to isolated controllers.
* **Stateless REST:** The API is purely stateless, returning standard JSON payloads with explicit HTTP status codes.
* **Minimalist Footprint:** Built with zero bloat. Unnecessary dependencies have been stripped out to ensure maximum performance and maintainability.

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
