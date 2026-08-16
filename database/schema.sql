-- Education Management Portal Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'admin')) NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    teacher TEXT NOT NULL,
    instructor TEXT NOT NULL,
    schedule_text TEXT NOT NULL,
    duration TEXT NOT NULL,
    students_count INTEGER DEFAULT 0,
    level TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS syllabus_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    course_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    total_marks INTEGER DEFAULT 100,
    submissions INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 40,
    status TEXT DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS examinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT CHECK(type IN ('CIA 1', 'CIA 2', 'SEMESTER')) NOT NULL,
    course_name TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    exam_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    total_marks TEXT DEFAULT '10.0 CGPA',
    status TEXT DEFAULT 'Scheduled'
);

CREATE TABLE IF NOT EXISTS student_roster (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    attendance INTEGER DEFAULT 85,
    cgpa_score REAL DEFAULT 8.00,
    status TEXT DEFAULT 'Good'
);

CREATE TABLE IF NOT EXISTS student_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_roll TEXT NOT NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    cia1 REAL DEFAULT 8.0,
    cia2 REAL DEFAULT 8.5,
    semester REAL DEFAULT 8.8,
    cgpa REAL DEFAULT 8.5,
    grade TEXT DEFAULT 'A',
    FOREIGN KEY(student_roll) REFERENCES student_roster(roll) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    head TEXT NOT NULL,
    courses_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
