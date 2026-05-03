# Equitask

A full-stack web application designed to streamline group project management and individual assignment grading for academic classes. Equitask bridges the gap between instructors and students by providing a unified platform for class management, collaborative group work, task tracking, and AI-powered rubric generation (mockup).

---

## ✨ Features

### For Leaders (Instructors)
- **Class Management** — Create and manage classes, invite leaders and members via email.
- **Assignment Creation** — Post group or individual assignments with file attachments and due dates.
- **AI Rubric Generation** — Automatically generate grading rubrics for assignments (mockup).
- **Individual Grading** — View student submissions, enter scores, and return grades with full un-return support.
- **Group Project Overview** — Monitor group progress, task completion, and submission status.

### For Members (Students)
- **Stream (Home)** — View class announcements and all assignment posts in a live feed.
- **Classwork** — Browse all group and individual assignments in one place.
- **Individual Assignment Page** — Upload work, submit and un-submit, and view returned grades.
- **Group Project Dashboard** — Collaborate within groups, manage tasks, and log progress.
- **Task Detail** — View task descriptions, submit attempts, and track personal progress.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7, Vanilla CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MySQL 8 |
| **File Storage** | Local filesystem via Multer |
| **Auth** | bcrypt (password hashing), localStorage (session) |
| **AI Features** | Integrated AI rubric generation (mockup) |

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) 8.0 or higher
- [Git](https://git-scm.com/)

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ping-pnm/Equitask.git
cd Equitask
```

### 2. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench or the `mysql` CLI).
2. Create the database:
   ```sql
   CREATE DATABASE equitask_app;
   ```
3. Import the schema using the provided SQL file in the project root:
   ```bash
   mysql -u root -p equitask_app < equitask_schema.sql
   ```

### 3. Backend Setup

```bash
cd backend
npm install
```

Copy the environment example file and fill in your credentials:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Edit the new `.env` file with your database credentials (see [Environment Variables](#-environment-variables) below).

Start the backend development server:

```bash
npm run dev
```

The server will run on **http://localhost:3000** with hot-reload enabled.

### 4. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on **http://localhost:5173** (or whichever port Vite assigns).

---

## 🔐 Environment Variables

Create a `.env` file inside the `/backend` directory by copying `.env.example`:

```env
PORT=3000
DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='your_password'
DB_NAME='equitask_app'
DB_PORT=3306
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`. Use `.env.example` as the committed reference template.

---

## 📁 Project Structure

```
Equitask/
├── backend/
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # Auth and file upload middleware
│   ├── models/             # Database query logic (MySQL)
│   ├── routes/             # Express route definitions
│   ├── uploads/            # Uploaded files (gitignored, kept via .gitkeep)
│   ├── db.js               # MySQL connection pool
│   ├── server.js           # Express app entry point
│   └── .env.example        # Template for environment variables
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/         # Images and static assets
│       ├── components/     # Reusable UI components
│       │   ├── Dashboard/  # Dashboard-specific components
│       │   ├── Home/       # Stream/Home page components
│       │   ├── LoginRegister/
│       │   └── People/     # People page components
│       ├── pages/          # Full page views (routed via React Router)
│       ├── services/       # API service layer (fetch wrappers)
│       ├── App.jsx         # Router configuration
│       ├── index.css       # Global styles
│       └── main.jsx        # React entry point
│
├── equitask_schema.sql     # Database schema — import this to set up MySQL
└── README.md
```

---

## 📡 API Overview

The backend exposes the following route groups:

| Route Prefix | Description |
|---|---|
| `POST /auth/login` | User authentication |
| `POST /auth/register` | User registration |
| `/api/class/*` | Class management (create, invite, stream) |
| `/api/work/*` | Assignment CRUD, file uploads, grading |
| `/api/group/*` | Group management and submission |
| `/api/task/*` | Task creation and attempt logging |

---

## 🖥️ Available Scripts

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with hot-reload (`node --watch`) |
| `npm start` | Start server in production mode |

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📝 Notes

- Uploaded files are stored locally in `backend/uploads/`. This folder is **gitignored** — the directory is preserved via a `.gitkeep` file but no actual uploads are committed.
- The application currently runs entirely locally. There is no cloud deployment configuration included.
- Authentication is session-based via `localStorage` on the frontend. Logging out clears the stored session.
- The `.env` file is **never committed**. Use `backend/.env.example` as a reference when setting up a new environment.
