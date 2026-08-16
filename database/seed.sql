-- Initial Seed Data for Education Management Portal

INSERT OR IGNORE INTO users (email, password, role, name) VALUES
('student@portal.edu', 'password123', 'student', 'Pradosh Priyan'),
('teacher@portal.edu', 'password123', 'teacher', 'Dr. Kumar'),
('admin@portal.edu', 'password123', 'admin', 'Administrator');

INSERT OR IGNORE INTO courses (code, title, department, category, teacher, instructor, schedule_text, duration, students_count, level, description) VALUES
('CS301', 'Full Stack Development', 'Computer Science', 'Full Stack', 'Dr. Arun Kumar', 'Dr. Arun Kumar', 'Mon & Wed • 10:00 AM', '12 Weeks', 42, 'Intermediate', 'Learn full stack web application development with modern frontend frameworks, RESTful APIs, and backend server design.'),
('CS302', 'Foundation of Data Science', 'Computer Science', 'Data Science', 'Dr. Priya Sharma', 'Dr. Priya Sharma', 'Tue & Thu • 11:00 AM', '14 Weeks', 40, 'Intermediate', 'Learn foundational principles of data analysis, exploratory data analysis, statistical modeling, Python data tools, and machine learning.'),
('CS303', 'Web Development', 'Computer Science', 'Web Development', 'Mr. Kavin Raj', 'Mr. Kavin Raj', 'Mon & Fri • 2:00 PM', '10 Weeks', 38, 'Beginner', 'Build modern web applications using HTML, CSS, JavaScript and React.'),
('CS304', 'Java Programming', 'Computer Science', 'Programming', 'Mr. Rahul Dev', 'Mr. Rahul Dev', 'Wed & Fri • 9:00 AM', '12 Weeks', 45, 'Intermediate', 'Master Java programming, object-oriented programming, collections and exception handling.'),
('CS305', 'Software Engineering', 'Computer Science', 'Software Development', 'Dr. Meena Krishnan', 'Dr. Meena Krishnan', 'Tue & Thu • 3:00 PM', '12 Weeks', 36, 'Advanced', 'Understand software development methodologies, Agile, Scrum, testing and project management.'),
('EC301', 'Computer Networks', 'Electronics', 'Networking', 'Dr. Suresh Kumar', 'Dr. Suresh Kumar', 'Mon & Thu • 1:00 PM', '14 Weeks', 34, 'Advanced', 'Study networking fundamentals, TCP/IP, routing, protocols and network security.');

INSERT OR IGNORE INTO student_roster (roll, name, attendance, cgpa_score, status) VALUES
('CS301', 'Arun Kumar', 92, 8.60, 'Good'),
('CS302', 'Priya Sharma', 84, 7.80, 'Good'),
('CS303', 'Rahul Dev', 68, 6.10, 'At Risk'),
('CS304', 'Kavin Raj', 76, 6.90, 'Monitor');

INSERT OR IGNORE INTO examinations (title, type, course_name, exam_date, exam_time, venue, total_marks, status) VALUES
('CIA 1 Internal Assessment', 'CIA 1', 'Full Stack Development', '2026-08-25', '10:00 AM', 'Lab 3', '10.0 CGPA', 'Scheduled'),
('CIA 2 Internal Assessment', 'CIA 2', 'Foundation of Data Science', '2026-08-28', '02:00 PM', 'Hall B', '10.0 CGPA', 'Scheduled'),
('SEMESTER End Examination', 'SEMESTER', 'Web Development', '2026-09-10', '10:00 AM', 'Main Auditorium', '10.0 CGPA', 'Scheduled');

INSERT OR IGNORE INTO departments (name, code, head, courses_count, students_count) VALUES
('Computer Science', 'CS', 'Dr. Arun Kumar', 5, 120),
('Electronics & Comm.', 'EC', 'Dr. Suresh Kumar', 3, 65),
('Mechanical Eng.', 'ME', 'Dr. Meena Krishnan', 2, 45),
('Electrical Eng.', 'EE', 'Dr. Priya Sharma', 2, 50);

INSERT OR IGNORE INTO audit_logs (action, user_name) VALUES
('System initialized with default schema', 'System'),
('Database connection established', 'System');
