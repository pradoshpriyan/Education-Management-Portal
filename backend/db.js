import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const storePath = path.join(dbDir, 'portal_store.json');

const initialStore = {
  users: [
    { id: 1, email: "student@portal.edu", password: "password123", role: "student", name: "Pradosh Priyan" },
    { id: 2, email: "teacher@portal.edu", password: "password123", role: "teacher", name: "Dr. Kumar" },
    { id: 3, email: "admin@portal.edu", password: "password123", role: "admin", name: "Administrator" }
  ],
  courses: [
    {
      id: 1,
      code: "CS301",
      title: "Full Stack Development",
      department: "Computer Science",
      category: "Full Stack",
      teacher: "Dr. Arun Kumar",
      instructor: "Dr. Arun Kumar",
      scheduleText: "Mon & Wed • 10:00 AM",
      schedule: ["Monday — 10:00 AM to 11:30 AM", "Wednesday — 10:00 AM to 11:30 AM"],
      duration: "12 Weeks",
      students: 42,
      level: "Intermediate",
      description: "Learn full stack web application development with modern frontend frameworks, RESTful APIs, and backend server design.",
      syllabus: ["HTML5, CSS3 & Responsive UI", "JavaScript ES6+ & React", "Node.js & Express API", "Database Integration", "Full Stack Deployment"]
    },
    {
      id: 2,
      code: "CS302",
      title: "Foundation of Data Science",
      department: "Computer Science",
      category: "Data Science",
      teacher: "Dr. Priya Sharma",
      instructor: "Dr. Priya Sharma",
      scheduleText: "Tue & Thu • 11:00 AM",
      schedule: ["Tuesday — 11:00 AM to 12:30 PM", "Thursday — 11:00 AM to 12:30 PM"],
      duration: "14 Weeks",
      students: 40,
      level: "Intermediate",
      description: "Learn foundational principles of data analysis, exploratory data analysis, statistical modeling, Python data tools, and machine learning.",
      syllabus: ["Python & Pandas", "Data Cleaning & EDA", "Data Visualization", "Statistical Inference", "Machine Learning Basics"]
    },
    {
      id: 3,
      code: "CS303",
      title: "Generative AI",
      department: "Computer Science",
      category: "Artificial Intelligence",
      teacher: "Mr. Kavin Raj",
      instructor: "Mr. Kavin Raj",
      scheduleText: "Mon & Fri • 2:00 PM",
      schedule: ["Monday — 2:00 PM to 3:30 PM", "Friday — 2:00 PM to 3:30 PM"],
      duration: "10 Weeks",
      students: 38,
      level: "Advanced",
      description: "Explore generative AI architectures, large language models (LLMs), prompt engineering, diffusion models, and fine-tuning AI algorithms.",
      syllabus: ["Generative AI Basics", "Transformers & LLMs", "Prompt Engineering", "Diffusion Models", "RAG & Fine-Tuning"]
    },
    {
      id: 4,
      code: "CS304",
      title: "Business Statistics",
      department: "Computer Science",
      category: "Analytics",
      teacher: "Mr. Rahul Dev",
      instructor: "Mr. Rahul Dev",
      scheduleText: "Wed & Fri • 9:00 AM",
      schedule: ["Wednesday — 9:00 AM to 10:30 AM", "Friday — 9:00 AM to 10:30 AM"],
      duration: "12 Weeks",
      students: 45,
      level: "Intermediate",
      description: "Master statistical decision-making, hypothesis testing, probability distributions, regression modeling, and business analytics.",
      syllabus: ["Descriptive Stats", "Probability Distributions", "Hypothesis Testing", "Regression Analysis", "Forecasting"]
    }
  ],
  students: [
    { name: "Arun Kumar", roll: "CS301", attendance: 92, score: 8.60, status: "Good" },
    { name: "Priya Sharma", roll: "CS302", attendance: 84, score: 7.80, status: "Good" },
    { name: "Rahul Dev", roll: "CS303", attendance: 68, score: 6.10, status: "At Risk" },
    { name: "Kavin Raj", roll: "CS304", attendance: 76, score: 6.90, status: "Monitor" }
  ],
  assignments: [
    { id: 1, title: "Full Stack React App", course: "Full Stack Development", due: "Tomorrow", status: "Pending" },
    { id: 2, title: "Exploratory Data Analysis", course: "Foundation of Data Science", due: "Aug 20, 2026", status: "Pending" },
    { id: 3, title: "LLM Fine-Tuning Script", course: "Generative AI", due: "Completed", status: "Completed" },
    { id: 4, title: "Statistical Regression Model", course: "Business Statistics", due: "Aug 24, 2026", status: "Pending" }
  ],
  examinations: [
    { id: 1, title: "CIA 1 Internal Assessment", type: "CIA 1", course: "Full Stack Development", date: "2026-08-25", time: "10:00 AM", venue: "Lab 3", scale: "10.0 CGPA", totalMarks: "10.0 CGPA", status: "Scheduled" },
    { id: 2, title: "CIA 2 Internal Assessment", type: "CIA 2", course: "Foundation of Data Science", date: "2026-08-28", time: "02:00 PM", venue: "Hall B", scale: "10.0 CGPA", totalMarks: "10.0 CGPA", status: "Scheduled" },
    { id: 3, title: "SEMESTER End Examination", type: "SEMESTER", course: "Generative AI", date: "2026-09-10", time: "10:00 AM", venue: "Main Auditorium", scale: "10.0 CGPA", totalMarks: "10.0 CGPA", status: "Scheduled" }
  ],
  results: [
    { code: "CS301", name: "Full Stack Development", cia1: 8.6, cia2: 8.9, semester: 9.1, cgpa: 8.87, grade: "A+" },
    { code: "CS302", name: "Foundation of Data Science", cia1: 6.8, cia2: 7.2, semester: 7.5, cgpa: 7.17, grade: "B+" },
    { code: "CS303", name: "Generative AI", cia1: 8.2, cia2: 8.5, semester: 8.8, cgpa: 8.50, grade: "A" },
    { code: "CS304", name: "Business Statistics", cia1: 9.0, cia2: 9.2, semester: 9.4, cgpa: 9.20, grade: "O" }
  ],
  departments: [
    { id: 1, name: "Computer Science", code: "CS", head: "Dr. Arun Kumar", courses: 5, students: 120 },
    { id: 2, name: "Electronics & Comm.", code: "EC", head: "Dr. Suresh Kumar", courses: 3, students: 65 },
    { id: 3, name: "Mechanical Eng.", code: "ME", head: "Dr. Meena Krishnan", courses: 2, students: 45 },
    { id: 4, name: "Electrical Eng.", code: "EE", head: "Dr. Priya Sharma", courses: 2, students: 50 }
  ],
  attendanceLogs: [
    { id: 1, course: "Data Structures", date: "2026-08-15", presentCount: 3, absentCount: 1, lateCount: 0, total: 4, rate: "75%" }
  ],
  auditLogs: [
    { id: 1, action: "New course added: Artificial Intelligence (CS306)", user: "Dr. Ravi", time: "10 mins ago" },
    { id: 2, action: "User role updated: Faculty -> Head of CS", user: "Admin", time: "1 hour ago" }
  ]
};

function readStore() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(initialStore, null, 2));
    return initialStore;
  }
  try {
    const data = fs.readFileSync(storePath, 'utf8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(storePath, JSON.stringify(initialStore, null, 2));
    return initialStore;
  }
}

function writeStore(store) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export default {
  getUsers: () => readStore().users,
  findUser: (email, role) => readStore().users.find(u => u.email === email && u.role === role),
  getCourses: () => readStore().courses,
  getCourseById: (id) => readStore().courses.find(c => c.id === Number(id)),
  getStudents: () => readStore().students,
  addStudent: (student) => {
    const store = readStore();
    store.students.unshift(student);
    writeStore(store);
    return student;
  },
  updateStudent: (roll, updates) => {
    const store = readStore();
    store.students = store.students.map(s => s.roll === roll ? { ...s, ...updates } : s);
    writeStore(store);
    return store.students;
  },
  getAssignments: () => readStore().assignments,
  toggleAssignment: (id) => {
    const store = readStore();
    store.assignments = store.assignments.map(a =>
      a.id === Number(id)
        ? {
          ...a,
          status: a.status === "Completed" ? "Pending" : "Completed",
          due: a.status === "Completed" ? "Pending Submission" : "Submitted Today"
        }
        : a
    );
    writeStore(store);
    return store.assignments;
  },
  getExams: () => readStore().examinations,
  addExam: (exam) => {
    const store = readStore();
    store.examinations.unshift(exam);
    writeStore(store);
    return exam;
  },
  getResults: () => readStore().results,
  getDepartments: () => readStore().departments,
  addDepartment: (dept) => {
    const store = readStore();
    store.departments.unshift(dept);
    writeStore(store);
    return dept;
  },
  updateDepartment: (id, updates) => {
    const store = readStore();
    store.departments = store.departments.map(d => d.id === Number(id) ? { ...d, ...updates } : d);
    writeStore(store);
    return store.departments;
  },
  getAttendanceLogs: () => readStore().attendanceLogs || [],
  recordAttendanceBatch: ({ course, date, records }) => {
    const store = readStore();
    if (!store.attendanceLogs) store.attendanceLogs = [];

    let present = 0;
    let absent = 0;
    let late = 0;

    records.forEach(rec => {
      if (rec.status === 'Present') present++;
      else if (rec.status === 'Absent') absent++;
      else if (rec.status === 'Late') late++;

      const student = store.students.find(s => s.roll === rec.roll);
      if (student) {
        if (rec.status === 'Present') {
          student.attendance = Math.min(100, student.attendance + 1);
        } else if (rec.status === 'Absent') {
          student.attendance = Math.max(0, student.attendance - 3);
        }
        student.status = student.attendance < 75 || student.score < 5.0 ? 'At Risk' : student.attendance < 80 || student.score < 7.0 ? 'Monitor' : 'Good';
      }
    });

    const total = records.length;
    const rate = total > 0 ? `${Math.round(((present + late) / total) * 100)}%` : '100%';

    const newLog = {
      id: Date.now(),
      course: course || "General Class",
      date: date || new Date().toISOString().split('T')[0],
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      total,
      rate
    };

    store.attendanceLogs.unshift(newLog);
    writeStore(store);
    return { log: newLog, students: store.students, logs: store.attendanceLogs };
  },
  getAuditLogs: () => readStore().auditLogs
};
