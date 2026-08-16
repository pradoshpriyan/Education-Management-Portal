import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CalendarCheck,
  GraduationCap,
  BarChart3,
  Brain,
  User,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Save,
  Plus,
  Search,
  X,
  Calendar,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTeacherDashboardApi,
  addStudentApi,
  updateStudentApi,
  scheduleExamApi,
  recordAttendanceApi,
} from "../../services/api";
import { analyzeClassMetrics } from "../../services/aiAnalyticsEngine";

const defaultPerformanceData = [
  { subject: "Full Stack", average: 8.20 },
  { subject: "Data Science", average: 6.80 },
  { subject: "Gen AI", average: 7.80 },
  { subject: "Statistics", average: 8.50 },
  { subject: "Robotics", average: 7.40 },
];

const defaultStudents = [
  { name: "Arun Kumar", roll: "CS301", attendance: 92, score: 8.60, status: "Good" },
  { name: "Priya Sharma", roll: "CS302", attendance: 84, score: 7.80, status: "Good" },
  { name: "Rahul Dev", roll: "CS303", attendance: 68, score: 6.10, status: "At Risk" },
  { name: "Kavin Raj", roll: "CS304", attendance: 76, score: 6.90, status: "Monitor" },
];

const defaultExams = [
  {
    id: 1,
    title: "CIA 1 Internal Assessment",
    type: "CIA 1",
    course: "Full Stack Development",
    date: "2026-08-25",
    time: "10:00 AM - 12:00 PM",
    venue: "Lab 3",
    totalMarks: "10.0 CGPA",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "CIA 2 Internal Assessment",
    type: "CIA 2",
    course: "Foundation of Data Science",
    date: "2026-08-28",
    time: "02:00 PM - 04:00 PM",
    venue: "Hall B",
    totalMarks: "10.0 CGPA",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "SEMESTER End Examination",
    type: "SEMESTER",
    course: "Generative AI",
    date: "2026-09-10",
    time: "10:00 AM - 01:00 PM",
    venue: "Main Auditorium",
    totalMarks: "10.0 CGPA",
    status: "Scheduled",
  },
];

const defaultAttendanceLogs = [
  { id: 1, course: "Full Stack Development (CS301)", date: "2026-08-15", presentCount: 3, absentCount: 1, lateCount: 0, total: 4, rate: "75%" }
];

function getStoredUser() {
  const storedUser = localStorage.getItem("educationPortalUser");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("educationPortalUser");
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [students, setStudents] = useState(defaultStudents);
  const [exams, setExams] = useState(defaultExams);
  const [attendanceLogs, setAttendanceLogs] = useState(defaultAttendanceLogs);

  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showMarksForm, setShowMarksForm] = useState(false);

  /* RECORD ATTENDANCE SYSTEM MODAL STATE */
  const [showRecordAttendanceModal, setShowRecordAttendanceModal] = useState(false);
  const [attendanceCourse, setAttendanceCourse] = useState("Data Structures (CS301)");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  /* AI TEACHER REPORT MODAL STATE */
  const [showTeacherAiModal, setShowTeacherAiModal] = useState(false);
  const [teacherAiReport, setTeacherAiReport] = useState(null);

  /* MODALS */
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    roll: "",
    attendance: 85,
    score: 7.50,
  });

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    type: "CIA 1",
    course: "Data Structures",
    date: "",
    time: "10:00 AM - 12:00 PM",
    venue: "Lab 1",
    totalMarks: "10.0 CGPA",
  });

  useEffect(() => {
    async function loadTeacherData() {
      const data = await fetchTeacherDashboardApi();
      if (data) {
        if (data.students) setStudents(data.students);
        if (data.examinations) setExams(data.examinations);
        if (data.attendanceLogs) setAttendanceLogs(data.attendanceLogs);
      }
    }
    loadTeacherData();
  }, []);

  const openRecordAttendanceModal = () => {
    const initialRecs = {};
    students.forEach((s) => {
      initialRecs[s.roll] = "Present";
    });
    setAttendanceRecords(initialRecs);
    setShowRecordAttendanceModal(true);
  };

  const handleStudentAttendanceChange = (roll, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [roll]: status }));
  };

  const markAllAttendance = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.roll] = status;
    });
    setAttendanceRecords(updated);
  };

  const totalStudentsInClass = students.length;
  const presentCount = Object.values(attendanceRecords).filter((st) => st === "Present").length;
  const absentCount = Object.values(attendanceRecords).filter((st) => st === "Absent").length;
  const lateCount = Object.values(attendanceRecords).filter((st) => st === "Late").length;
  const todayRate = totalStudentsInClass > 0 ? `${Math.round(((presentCount + lateCount) / totalStudentsInClass) * 100)}%` : "100%";

  const handleRecordAttendanceSubmit = async (e) => {
    e.preventDefault();
    const payloadRecords = Object.entries(attendanceRecords).map(([roll, status]) => ({ roll, status }));

    try {
      const result = await recordAttendanceApi({
        course: attendanceCourse,
        date: attendanceDate,
        records: payloadRecords,
      });

      if (result.students) setStudents(result.students);
      if (result.logs) setAttendanceLogs(result.logs);
      alert(`Attendance recorded successfully for ${attendanceCourse} on ${attendanceDate}!`);
    } catch {
      setStudents((prev) =>
        prev.map((s) => {
          const st = attendanceRecords[s.roll];
          let att = s.attendance;
          if (st === "Present") att = Math.min(100, att + 1);
          else if (st === "Absent") att = Math.max(0, att - 3);
          const status = att < 75 ? "At Risk" : att < 80 ? "Monitor" : "Good";
          return { ...s, attendance: att, status };
        })
      );

      setAttendanceLogs((prev) => [
        {
          id: Date.now(),
          course: attendanceCourse,
          date: attendanceDate,
          presentCount,
          absentCount,
          lateCount,
          total: totalStudentsInClass,
          rate: todayRate,
        },
        ...prev,
      ]);
      alert(`Attendance saved for ${attendanceCourse}!`);
    }

    setShowRecordAttendanceModal(false);
  };

  const triggerTeacherAiAnalysis = () => {
    const analysis = analyzeClassMetrics({
      students,
      exams,
      courses: defaultPerformanceData,
    });
    setTeacherAiReport(analysis);
    setShowTeacherAiModal(true);
  };

  const averageAttendance =
    students.length > 0
      ? Math.round(
        students.reduce((total, s) => total + Number(s.attendance), 0) /
        students.length
      )
      : 0;

  const averageScoreCGPA =
    students.length > 0
      ? (
        students.reduce((total, s) => total + Number(s.score), 0) /
        students.length
      ).toFixed(2)
      : "0.00";

  const handleLogout = () => {
    localStorage.removeItem("educationPortalUser");
    navigate("/", { replace: true });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateMarks = (roll, score) => {
    setStudents((prev) =>
      prev.map((s) => (s.roll === roll ? { ...s, score } : s))
    );
  };

  const handleBlurMarks = async (roll, score) => {
    const num = Math.max(0, Math.min(10, Number(score) || 0));
    const formatted = Number(num.toFixed(2));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.roll === roll) {
          const status = s.attendance < 75 || formatted < 5.0 ? "At Risk" : s.attendance < 80 || formatted < 7.0 ? "Monitor" : "Good";
          return { ...s, score: formatted, status };
        }
        return s;
      })
    );
    await updateStudentApi(roll, { score: formatted });
  };

  const handleDeleteStudent = (roll, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${roll}) from the class roster?`)) {
      setStudents((prev) => prev.filter((s) => s.roll !== roll));
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roll) {
      alert("Please provide student name and roll number.");
      return;
    }

    try {
      const created = await addStudentApi(newStudent);
      setStudents((prev) => [created, ...prev]);
    } catch {
      const att = Number(newStudent.attendance);
      const scr = Number(newStudent.score);
      const created = {
        name: newStudent.name.trim(),
        roll: newStudent.roll.trim().toUpperCase(),
        attendance: att,
        score: Number(scr.toFixed(2)),
        status: att < 75 || scr < 5.0 ? "At Risk" : att < 80 || scr < 7.0 ? "Monitor" : "Good",
      };
      setStudents((prev) => [created, ...prev]);
    }
    setNewStudent({ name: "", roll: "", attendance: 85, score: 7.50 });
    setShowAddStudentModal(false);
  };

  const handleAddExamSubmit = async (e) => {
    e.preventDefault();
    if (!newExam.title || !newExam.date) {
      alert("Please fill in exam title and date.");
      return;
    }

    try {
      const createdExam = await scheduleExamApi(newExam);
      setExams((prev) => [createdExam, ...prev]);
    } catch {
      const createdExam = {
        id: Date.now(),
        ...newExam,
        status: "Scheduled",
      };
      setExams((prev) => [createdExam, ...prev]);
    }

    setNewExam({
      title: "",
      type: "CIA 1",
      course: "Data Structures",
      date: "",
      time: "10:00 AM - 12:00 PM",
      venue: "Lab 1",
      totalMarks: "10.0 CGPA",
    });
    setShowAddExamModal(false);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.roll.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="teacher-dashboard">
      {/* SIDEBAR */}
      <aside className="teacher-sidebar">
        <div className="teacher-brand">
          <div className="teacher-brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2>Education Portal</h2>
            <span>Teacher Control</span>
          </div>
        </div>

        <nav className="teacher-nav" aria-label="Teacher navigation">
          <button
            type="button"
            className="teacher-nav-item active"
            onClick={() => scrollToSection("top")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => scrollToSection("courses")}
          >
            <BookOpen size={18} />
            My Courses
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => scrollToSection("attendance")}
          >
            <CalendarCheck size={18} />
            Attendance Recording
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => navigate("/teacher/assignments")}
          >
            <ClipboardList size={18} />
            Assignments
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => scrollToSection("examinations")}
          >
            <GraduationCap size={18} />
            Examinations (CIA)
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => scrollToSection("student-monitoring")}
          >
            <BarChart3 size={18} />
            Student CGPA Roster
          </button>

          <button
            type="button"
            className="teacher-nav-item"
            onClick={() => scrollToSection("ai-insights")}
          >
            <Brain size={18} />
            AI Insights
          </button>
        </nav>

        <button type="button" className="teacher-logout" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="teacher-main" id="top">
        {/* HEADER */}
        <header className="teacher-header">
          <div>
            <p className="teacher-header-label">Teacher Dashboard</p>
            <h1>Welcome back, {user?.name || "Dr. Kumar"}</h1>
            <p>Manage daily attendance recording, CIA assessments, and CGPA standings.</p>
          </div>

          <div className="teacher-profile">
            <div className="teacher-avatar">
              <User size={20} />
            </div>
            <div>
              <strong>{user?.email || "teacher@portal.edu"}</strong>
              <span>Faculty Member</span>
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="teacher-stats" aria-label="Teacher statistics">
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon blue">
              <BookOpen size={20} />
            </div>
            <div>
              <span>My Courses</span>
              <strong>4</strong>
              <small>Active courses</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon purple">
              <Users size={20} />
            </div>
            <div>
              <span>Total Students</span>
              <strong>{students.length}</strong>
              <small>Currently monitored</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon green">
              <CalendarCheck size={20} />
            </div>
            <div>
              <span>Average Attendance</span>
              <strong>{averageAttendance}%</strong>
              <small>This semester</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon orange">
              <BarChart3 size={20} />
            </div>
            <div>
              <span>Average Class CGPA</span>
              <strong>{averageScoreCGPA} / 10.0</strong>
              <small>1.0 to 10.0 double scale</small>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used academic activities</p>
            </div>
          </div>

          <div className="teacher-actions">
            <button
              type="button"
              className="teacher-action"
              onClick={openRecordAttendanceModal}
              style={{ border: "2px solid #2563eb", background: "#eff6ff" }}
            >
              <div className="teacher-action-icon green">
                <CalendarCheck size={18} />
              </div>
              <div>
                <strong style={{ color: "#2563eb" }}>Record Daily Attendance</strong>
                <span>Take class attendance sheet</span>
              </div>
            </button>

            <button
              type="button"
              className="teacher-action"
              onClick={() => navigate("/teacher/assignments")}
            >
              <div className="teacher-action-icon blue">
                <ClipboardList size={18} />
              </div>
              <div>
                <strong>Create Assignment</strong>
                <span>Open assignment management</span>
              </div>
            </button>

            <button
              type="button"
              className="teacher-action"
              onClick={() => setShowAddExamModal(true)}
            >
              <div className="teacher-action-icon purple">
                <GraduationCap size={18} />
              </div>
              <div>
                <strong>Schedule CIA / Exam</strong>
                <span>CIA 1, CIA 2 & SEMESTER</span>
              </div>
            </button>

            <button
              type="button"
              className="teacher-action"
              onClick={() => {
                setShowMarksForm(true);
                setTimeout(() => scrollToSection("student-monitoring"), 100);
              }}
            >
              <div className="teacher-action-icon orange">
                <BarChart3 size={18} />
              </div>
              <div>
                <strong>Enter CGPA Marks</strong>
                <span>1.0 to 10.0 scale</span>
              </div>
            </button>
          </div>
        </section>

        {/* ATTENDANCE RECORDING HISTORY PANEL */}
        <section className="teacher-panel" id="attendance">
          <div className="teacher-panel-header">
            <div>
              <h2>Attendance Recording & History Log</h2>
              <p>Take daily attendance or review submitted class logs</p>
            </div>

            <button
              type="button"
              className="view-button"
              onClick={openRecordAttendanceModal}
              style={{ background: "#2563eb", color: "white", padding: "10px 16px" }}
            >
              <CalendarCheck size={16} style={{ display: "inline", marginRight: "6px" }} />
              Take Attendance Sheet
            </button>
          </div>

          <div className="teacher-table-wrapper" style={{ marginTop: "15px" }}>
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Subject / Course</th>
                  <th>Date Recorded</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Total Students</th>
                  <th>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong>{log.course}</strong>
                    </td>
                    <td>
                      <div className="teacher-date">
                        <Calendar size={14} /> {log.date}
                      </div>
                    </td>
                    <td>
                      <span className="teacher-status completed" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                        {log.presentCount} Present
                      </span>
                    </td>
                    <td>
                      <span className="teacher-status danger">
                        {log.absentCount} Absent
                      </span>
                    </td>
                    <td>
                      <span className="teacher-status pending">
                        {log.lateCount} Late
                      </span>
                    </td>
                    <td>{log.total} Students</td>
                    <td>
                      <strong style={{ color: "#2563eb", fontSize: "14px" }}>{log.rate}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PERFORMANCE + AI */}
        <section className="teacher-grid">
          <div className="teacher-panel">
            <div className="teacher-panel-header">
              <div>
                <h2>Class Average CGPA by Subject</h2>
                <p>Calculated on a 1.0 to 10.0 scale</p>
              </div>
              <BarChart3 size={20} />
            </div>

            <div className="teacher-chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={defaultPerformanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <Tooltip formatter={(val) => [`${Number(val).toFixed(2)} CGPA`, "Average Score"]} />
                  <Bar dataKey="average" fill="#2563eb" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="teacher-panel" id="ai-insights">
            <div className="teacher-ai-title">
              <div className="teacher-ai-icon">
                <Brain size={21} />
              </div>
              <div>
                <h2>AI Academic Insights</h2>
                <p>CIA & SEMESTER CGPA performance alerts</p>
              </div>
            </div>

            <div className="teacher-alert warning">
              <AlertTriangle size={18} />
              <div>
                <strong>
                  {
                    students.filter(
                      (s) => s.attendance < 75 || s.score < 6.5
                    ).length
                  }{" "}
                  students need attention
                </strong>
                <p>
                  Their attendance or CGPA score is below 6.50 CGPA.
                </p>
              </div>
            </div>

            <div className="teacher-alert success">
              <CheckCircle size={18} />
              <div>
                <strong>Class performance standing</strong>
                <p>Current average class CGPA is {averageScoreCGPA} / 10.0.</p>
              </div>
            </div>

            <button
              type="button"
              className="teacher-ai-button"
              onClick={triggerTeacherAiAnalysis}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Sparkles size={16} />
              Open AI Class Intelligence & Risk Radar
            </button>
          </div>
        </section>

        {/* MY COURSES */}
        <section className="teacher-panel" id="courses">
          <div className="teacher-panel-header">
            <div>
              <h2>My Courses</h2>
              <p>Courses currently assigned to you</p>
            </div>
            <BookOpen size={20} />
          </div>

          <div className="teacher-simple-grid">
            {defaultPerformanceData.map((course) => (
              <div className="teacher-simple-card" key={course.subject}>
                <strong>{course.subject}</strong>
                <span>Average CGPA: {course.average.toFixed(2)} / 10.0</span>
              </div>
            ))}
          </div>
        </section>

        {/* EXAMINATIONS SCHEDULE */}
        <section className="teacher-panel" id="examinations">
          <div className="teacher-panel-header">
            <div>
              <h2>Examinations Schedule (CIA 1, CIA 2, SEMESTER)</h2>
              <p>Manage internal evaluations and semester examinations</p>
            </div>
            <button
              type="button"
              className="view-button"
              onClick={() => setShowAddExamModal(true)}
            >
              <Plus size={15} style={{ display: "inline", marginRight: "4px" }} />
              Schedule Exam
            </button>
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Exam Title</th>
                  <th>Course</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Evaluation Scale</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      <span className="teacher-status completed" style={{ background: exam.type === "SEMESTER" ? "#eff6ff" : "#f0fdf4", color: exam.type === "SEMESTER" ? "#2563eb" : "#16a34a" }}>
                        {exam.type || "CIA 1"}
                      </span>
                    </td>
                    <td>
                      <strong>{exam.title}</strong>
                    </td>
                    <td>{exam.course}</td>
                    <td>
                      <div className="teacher-date">
                        <Calendar size={13} /> {exam.date} • {exam.time}
                      </div>
                    </td>
                    <td>{exam.venue}</td>
                    <td><strong>{exam.totalMarks || "10.0 CGPA"}</strong></td>
                    <td>
                      <span className="teacher-status completed">
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* STUDENT CGPA MONITORING */}
        <section className="teacher-panel" id="student-monitoring">
          <div className="teacher-panel-header">
            <div>
              <h2>Student Roster & CGPA Marks</h2>
              <p>Attendance and CGPA evaluation (1.0 to 10.0 scale)</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="view-button"
                onClick={() => setShowMarksForm(!showMarksForm)}
                style={{ background: showMarksForm ? "#f0fdf4" : "#eff6ff", color: showMarksForm ? "#16a34a" : "#2563eb", border: "1px solid #bfdbfe" }}
              >
                <BarChart3 size={15} style={{ display: "inline", marginRight: "4px" }} />
                {showMarksForm ? "Done Editing Marks" : "Enter / Edit CGPA Marks"}
              </button>

              <button
                type="button"
                className="view-button"
                onClick={() => setShowAddStudentModal(true)}
              >
                <Plus size={15} style={{ display: "inline", marginRight: "4px" }} />
                Add Student
              </button>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ display: "flex", gap: "12px", marginTop: "15px", marginBottom: "15px" }}>
            <div className="assignment-search" style={{ flex: 1 }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search student by name or roll number..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="course-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Good">Good</option>
              <option value="Monitor">Monitor</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Attendance</th>
                  <th>CGPA Score (1.0 - 10.0)</th>
                  <th>Academic Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.roll}>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>{student.roll}</td>
                    <td>
                      <span
                        className={
                          student.attendance < 75 ? "teacher-low" : "teacher-good"
                        }
                      >
                        {student.attendance}%
                      </span>
                    </td>
                    <td>
                      {showMarksForm ? (
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={student.score}
                          onChange={(e) => updateMarks(student.roll, e.target.value)}
                          onBlur={(e) => handleBlurMarks(student.roll, e.target.value)}
                          style={{ width: "85px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #bfdbfe", fontWeight: "700", color: "#2563eb" }}
                        />
                      ) : (
                        <strong style={{ color: "#2563eb", fontSize: "14px" }}>
                          {Number(student.score).toFixed(2)} / 10.0
                        </strong>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          student.status === "Good"
                            ? "teacher-status completed"
                            : student.status === "At Risk"
                              ? "teacher-status danger"
                              : "teacher-status pending"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student.roll, student.name)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          color: "#dc2626",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showMarksForm && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="teacher-ai-button"
                onClick={() => {
                  setShowMarksForm(false);
                  alert("Student CGPA marks saved to backend successfully!");
                }}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Save size={16} />
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMarksForm(false);
                }}
                style={{
                  padding: "10px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </main>

      {/* AI TEACHER REPORT MODAL */}
      {showTeacherAiModal && teacherAiReport && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "650px", width: "95%" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowTeacherAiModal(false)}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "#faf5ff", color: "#9333ea" }}>
                <Brain size={28} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px" }}>AI Class Intelligence & Risk Radar</h2>
                <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "13px" }}>
                  Automated class performance analysis & intervention recommendations
                </p>
              </div>
            </div>

            {/* METRIC CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Class Average CGPA</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#2563eb", marginTop: "4px" }}>
                  {teacherAiReport.averageClassCGPA} / 10.0
                </strong>
              </div>

              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Avg Attendance</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#16a34a", marginTop: "4px" }}>
                  {teacherAiReport.averageAttendanceRate}%
                </strong>
              </div>

              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>At-Risk Students</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#dc2626", marginTop: "4px" }}>
                  {teacherAiReport.atRiskCount} Student(s)
                </strong>
              </div>
            </div>

            {/* AT-RISK STUDENTS RADAR */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <AlertTriangle size={17} color="#dc2626" />
                Students Requiring Immediate Faculty Support
              </h3>
              {teacherAiReport.atRiskStudents.map((st) => (
                <div key={st.roll} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", marginBottom: "6px" }}>
                  <div>
                    <strong style={{ color: "#991b1b", fontSize: "14px" }}>{st.name} ({st.roll})</strong>
                    <span style={{ display: "block", fontSize: "12px", color: "#b91c1c" }}>
                      Attendance: {st.attendance}% • CGPA: {Number(st.score).toFixed(2)} / 10.0
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`AI Academic Alert sent to ${st.name} (${st.roll})`)}
                    style={{ padding: "6px 10px", borderRadius: "6px", border: "none", background: "#dc2626", color: "white", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Send Warning Alert
                  </button>
                </div>
              ))}
            </div>

            {/* TEACHER DECISION INSIGHTS */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <Target size={17} color="#2563eb" />
                Faculty Action Recommendations
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {teacherAiReport.teacherInsights.map((insight, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "8px", fontSize: "13px", color: "#6b21a8" }}>
                    <CheckCircle size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowTeacherAiModal(false)}
              style={{ width: "100%", padding: "12px" }}
            >
              Close Intelligence Report
            </button>
          </div>
        </div>
      )}

      {/* RECORD DAILY ATTENDANCE SYSTEM MODAL */}
      {showRecordAttendanceModal && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "600px", width: "95%" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowRecordAttendanceModal(false)}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ padding: "10px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb" }}>
                <CalendarCheck size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px" }}>Record Class Attendance</h2>
                <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px" }}>
                  Take attendance sheet for current lecture
                </p>
              </div>
            </div>

            <form onSubmit={handleRecordAttendanceSubmit}>
              {/* COURSE & DATE SELECTORS */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Select Course / Class *
                  </label>
                  <select
                    value={attendanceCourse}
                    onChange={(e) => setAttendanceCourse(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Full Stack Development (CS301)">Full Stack Development (CS301)</option>
                    <option value="Foundation of Data Science (CS302)">Foundation of Data Science (CS302)</option>
                    <option value="Generative AI (CS303)">Generative AI (CS303)</option>
                    <option value="Business Statistics (CS304)">Business Statistics (CS304)</option>
                    <option value="Robotics (CS305)">Robotics (CS305)</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    required
                  />
                </div>
              </div>

              {/* BATCH QUICK ACTIONS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>
                  Quick Batch Mark:
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => markAllAttendance("Present")}
                    style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAllAttendance("Absent")}
                    style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* STUDENT ATTENDANCE LIST */}
              <div style={{ maxHeight: "280px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px", marginBottom: "18px" }}>
                {students.map((student) => {
                  const currentStatus = attendanceRecords[student.roll] || "Present";
                  return (
                    <div
                      key={student.roll}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{student.name}</strong>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>Roll: {student.roll} • Standing: {student.attendance}%</span>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleStudentAttendanceChange(student.roll, "Present")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: currentStatus === "Present" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                            background: currentStatus === "Present" ? "#f0fdf4" : "white",
                            color: currentStatus === "Present" ? "#16a34a" : "#64748b",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          ✓ Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStudentAttendanceChange(student.roll, "Late")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: currentStatus === "Late" ? "2px solid #ea580c" : "1px solid #cbd5e1",
                            background: currentStatus === "Late" ? "#fff7ed" : "white",
                            color: currentStatus === "Late" ? "#ea580c" : "#64748b",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          ⏱ Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStudentAttendanceChange(student.roll, "Absent")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: currentStatus === "Absent" ? "2px solid #dc2626" : "1px solid #cbd5e1",
                            background: currentStatus === "Absent" ? "#fef2f2" : "white",
                            color: currentStatus === "Absent" ? "#dc2626" : "#64748b",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          ✕ Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LIVE STATS SUMMARY */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#eff6ff", borderRadius: "10px", marginBottom: "18px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e40af" }}>
                  Class Rate: <strong>{todayRate}</strong>
                </span>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "700" }}>✓ {presentCount} Present</span>
                  <span style={{ color: "#ea580c", fontWeight: "700" }}>⏱ {lateCount} Late</span>
                  <span style={{ color: "#dc2626", fontWeight: "700" }}>✕ {absentCount} Absent</span>
                </div>
              </div>

              <button
                type="submit"
                className="primary-button"
                style={{ width: "100%", padding: "12px", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <Send size={16} />
                Submit Attendance Sheet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "450px" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAddStudentModal(false)}
            >
              <X size={19} />
            </button>
            <h2>Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit} style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Student Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Roll Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS305"
                  value={newStudent.roll}
                  onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Attendance %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudent.attendance}
                    onChange={(e) => setNewStudent({ ...newStudent, attendance: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    CGPA (1.0 - 10.0)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newStudent.score}
                    onChange={(e) => setNewStudent({ ...newStudent, score: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%" }}>
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXAM MODAL */}
      {showAddExamModal && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "450px" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAddExamModal(false)}
            >
              <X size={19} />
            </button>
            <h2>Schedule Examination</h2>
            <form onSubmit={handleAddExamSubmit} style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Examination Type *
                </label>
                <select
                  value={newExam.type}
                  onChange={(e) => setNewExam({ ...newExam, type: e.target.value, title: `${e.target.value} Examination` })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="CIA 1">CIA 1 (Continuous Internal Assessment 1)</option>
                  <option value="CIA 2">CIA 2 (Continuous Internal Assessment 2)</option>
                  <option value="SEMESTER">SEMESTER (End Semester Examination)</option>
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Exam Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CIA 1 Internal Assessment"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Course
                </label>
                <select
                  value={newExam.course}
                  onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Foundation of Data Science">Foundation of Data Science</option>
                  <option value="Generative AI">Generative AI</option>
                  <option value="Business Statistics">Business Statistics</option>
                  <option value="Robotics">Robotics</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Venue
                  </label>
                  <input
                    type="text"
                    value={newExam.venue}
                    onChange={(e) => setNewExam({ ...newExam, venue: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%" }}>
                Schedule Examination
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;