import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  GraduationCap,
  BarChart3,
  Brain,
  User,
  LogOut,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Award,
  Calendar,
  CheckSquare,
  X,
  Target,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseData, getInitialEnrollments } from "../../data/courses";
import { fetchStudentDashboardApi, toggleAssignmentApi } from "../../services/api";
import { analyzeStudentProfile } from "../../services/aiAnalyticsEngine";

const initialPerformanceData = [
  { month: "Jan", score: 7.2 },
  { month: "Feb", score: 7.6 },
  { month: "Mar", score: 7.4 },
  { month: "Apr", score: 8.1 },
  { month: "May", score: 8.5 },
  { month: "Jun", score: 8.82 },
];

const initialAssignments = [
  {
    id: 1,
    title: "Full Stack React App",
    course: "Full Stack Development",
    due: "Tomorrow",
    status: "Pending",
  },
  {
    id: 2,
    title: "Exploratory Data Analysis",
    course: "Foundation of Data Science",
    due: "Aug 20, 2026",
    status: "Pending",
  },
  {
    id: 3,
    title: "React Portfolio Project",
    course: "Web Development",
    due: "Completed",
    status: "Completed",
  },
  {
    id: 4,
    title: "Java OOP Mini Project",
    course: "Java Programming",
    due: "Aug 24, 2026",
    status: "Pending",
  },
];

const mockAttendanceBreakdown = [
  { subject: "Full Stack Development (CS301)", attended: 22, total: 24, percentage: 92, status: "Good" },
  { subject: "Foundation of Data Science (CS302)", attended: 18, total: 24, percentage: 75, status: "Monitor" },
  { subject: "Generative AI (CS303)", attended: 20, total: 24, percentage: 83, status: "Good" },
  { subject: "Business Statistics (CS304)", attended: 21, total: 24, percentage: 88, status: "Good" },
];

const mockExaminations = [
  { id: 1, title: "CIA 1 Internal Assessment", type: "CIA 1", course: "Full Stack Development", date: "2026-08-25", time: "10:00 AM", venue: "Lab 3", scale: "10.0 CGPA" },
  { id: 2, title: "CIA 2 Internal Assessment", type: "CIA 2", course: "Foundation of Data Science", date: "2026-08-28", time: "02:00 PM", venue: "Hall B", scale: "10.0 CGPA" },
  { id: 3, title: "SEMESTER End Examination", type: "SEMESTER", course: "Generative AI", date: "2026-09-10", time: "10:00 AM", venue: "Main Auditorium", scale: "10.0 CGPA" },
];

const mockResults = [
  { code: "CS301", name: "Full Stack Development", cia1: 8.6, cia2: 8.9, semester: 9.1, cgpa: 8.87, grade: "A+" },
  { code: "CS302", name: "Foundation of Data Science", cia1: 6.8, cia2: 7.2, semester: 7.5, cgpa: 7.17, grade: "B+" },
  { code: "CS303", name: "Generative AI", cia1: 8.2, cia2: 8.5, semester: 8.8, cgpa: 8.50, grade: "A" },
  { code: "CS304", name: "Business Statistics", cia1: 9.0, cia2: 9.2, semester: 9.4, cgpa: 9.20, grade: "O" },
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

  const [activeTab, setActiveTab] = useState("overview");
  const [assignmentsList, setAssignmentsList] = useState(initialAssignments);
  const [examinationsList, setExaminationsList] = useState(mockExaminations);
  const [resultsList, setResultsList] = useState(mockResults);
  const [enrolledIds] = useState(getInitialEnrollments);

  /* AI DIAGNOSIS MODAL STATE */
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      const data = await fetchStudentDashboardApi();
      if (data) {
        if (data.assignments) setAssignmentsList(data.assignments);
        if (data.examinations) setExaminationsList(data.examinations);
        if (data.results) setResultsList(data.results);
      }
    }
    loadDashboardData();
  }, []);

  const studentCourses = courseData.filter((c) =>
    enrolledIds.length > 0 ? enrolledIds.includes(c.id) : [1, 2, 3].includes(c.id)
  );

  const pendingCount = assignmentsList.filter((a) => a.status === "Pending").length;

  const handleLogout = () => {
    localStorage.removeItem("educationPortalUser");
    navigate("/", { replace: true });
  };

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleAssignmentStatus = async (id) => {
    setAssignmentsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            status: item.status === "Completed" ? "Pending" : "Completed",
            due: item.status === "Completed" ? "Pending Submission" : "Submitted Today",
          }
          : item
      )
    );
    await toggleAssignmentApi(id);
  };

  const triggerAiDiagnosis = () => {
    const analysis = analyzeStudentProfile({
      student: user,
      results: resultsList,
      attendanceLogs: mockAttendanceBreakdown,
      assignments: assignmentsList,
    });
    setAiReport(analysis);
    setShowAiModal(true);
  };

  return (
    <div className="student-dashboard">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2>Education Portal</h2>
            <span>Student Dashboard</span>
          </div>
        </div>

        <nav className="student-nav" aria-label="Student navigation">
          <button
            type="button"
            className={`student-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => scrollToSection("top", "overview")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            type="button"
            className="student-nav-item"
            onClick={() => navigate("/courses")}
          >
            <BookOpen size={18} />
            Courses Catalog
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "assignments" ? "active" : ""}`}
            onClick={() => scrollToSection("assignments", "assignments")}
          >
            <ClipboardList size={18} />
            Assignments
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => scrollToSection("attendance", "attendance")}
          >
            <CalendarCheck size={18} />
            Attendance
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "examinations" ? "active" : ""}`}
            onClick={() => scrollToSection("examinations", "examinations")}
          >
            <GraduationCap size={18} />
            Examinations
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "results" ? "active" : ""}`}
            onClick={() => scrollToSection("results", "results")}
          >
            <BarChart3 size={18} />
            Results (CGPA)
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => scrollToSection("progress", "progress")}
          >
            <TrendingUp size={18} />
            Progress Chart
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => scrollToSection("ai-insights", "ai")}
          >
            <Brain size={18} />
            AI Insights
          </button>
        </nav>

        <button type="button" className="student-logout" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main" id="top">
        {/* HEADER */}
        <header className="student-header">
          <div>
            <p className="student-header-label">Student Portal</p>
            <h1>Welcome back, {user?.name || "Student"}</h1>
            <p>Track your CIA 1, CIA 2, SEMESTER performance and CGPA standing.</p>
          </div>

          <div className="student-profile">
            <div className="student-avatar">
              <User size={20} />
            </div>
            <div>
              <strong>{user?.email || "student@portal.edu"}</strong>
              <span>Computer Science Major</span>
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="student-stats" aria-label="Academic statistics">
          <div className="student-stat-card">
            <div className="stat-icon blue">
              <BookOpen size={20} />
            </div>
            <div>
              <span>Enrolled Courses</span>
              <strong>{studentCourses.length}</strong>
              <small>Active this semester</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon green">
              <CalendarCheck size={20} />
            </div>
            <div>
              <span>Attendance Average</span>
              <strong>84.5%</strong>
              <small>Good standing</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon purple">
              <BarChart3 size={20} />
            </div>
            <div>
              <span>Cumulative CGPA</span>
              <strong>8.44 / 10.0</strong>
              <small>+0.32 scale growth</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon orange">
              <ClipboardList size={20} />
            </div>
            <div>
              <span>Pending Tasks</span>
              <strong>{pendingCount}</strong>
              <small>Assignments remaining</small>
            </div>
          </div>
        </section>

        {/* CHART + AI */}
        <section className="student-grid">
          <div className="student-panel performance-panel" id="progress">
            <div className="panel-header">
              <div>
                <h2>CGPA Performance Trend</h2>
                <p>Monthly grade point average progression (1.0 - 10.0 scale)</p>
              </div>
              <TrendingUp size={20} />
            </div>

            <div className="performance-chart">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={initialPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} CGPA`, "Score"]} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="student-panel ai-panel" id="ai-insights">
            <div className="ai-title">
              <div className="ai-icon">
                <Brain size={21} />
              </div>
              <div>
                <h2>AI Learning Assistant</h2>
                <p>CIA & SEMESTER Target Recommendations</p>
              </div>
            </div>

            <div className="ai-risk">
              <AlertTriangle size={18} />
              <div>
                <strong>DBMS CIA 2 Needs Attention</strong>
                <p>Your CIA 1 score in Database Management was 6.80 CGPA. Target 8.0+ in CIA 2 to raise your overall grade.</p>
              </div>
            </div>

            <div className="ai-recommendation">
              <CheckCircle size={18} />
              <div>
                <strong>Recommended Next Action</strong>
                <p>Practice SQL Queries & ER diagrams before the upcoming CIA 2 assessment on Aug 28.</p>
              </div>
            </div>

            <button
              type="button"
              className="ai-button"
              onClick={triggerAiDiagnosis}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Sparkles size={16} />
              Run Full AI Academic Diagnosis
            </button>
          </div>
        </section>

        {/* MY COURSES */}
        <section className="student-panel">
          <div className="panel-header">
            <div>
              <h2>My Enrolled Courses</h2>
              <p>Active courses for current term</p>
            </div>

            <button
              type="button"
              className="view-button"
              onClick={() => navigate("/courses")}
            >
              Explore All Courses
            </button>
          </div>

          <div className="course-list">
            {studentCourses.map((course) => (
              <div className="student-course" key={course.code}>
                <div className="course-info">
                  <div className="course-icon">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <strong>{course.title}</strong>
                    <span>{course.code} • {course.teacher}</span>
                  </div>
                </div>

                <div className="course-progress">
                  <div className="progress-label">
                    <span>Target CGPA</span>
                    <strong>8.50 / 10.0</strong>
                  </div>
                  <div className="progress-bar">
                    <div style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="course-grade" aria-label="Grade A">
                  A
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ASSIGNMENTS */}
        <section className="student-panel" id="assignments">
          <div className="panel-header">
            <div>
              <h2>Assignments & Submissions</h2>
              <p>Click on any assignment to toggle completed status</p>
            </div>
            <ClipboardList size={20} />
          </div>

          <div className="assignment-list">
            {assignmentsList.map((assignment) => (
              <div
                className="assignment-row"
                key={assignment.id}
                style={{ cursor: "pointer" }}
                onClick={() => toggleAssignmentStatus(assignment.id)}
              >
                <div className="assignment-icon">
                  <CheckSquare
                    size={18}
                    color={assignment.status === "Completed" ? "#16a34a" : "#ea580c"}
                  />
                </div>

                <div className="assignment-info">
                  <strong>{assignment.title}</strong>
                  <span>{assignment.course}</span>
                </div>

                <div className="assignment-due">
                  <Clock size={15} />
                  {assignment.due}
                </div>

                <span
                  className={
                    assignment.status === "Completed"
                      ? "status completed"
                      : "status pending"
                  }
                >
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ATTENDANCE */}
        <section className="student-panel" id="attendance">
          <div className="panel-header">
            <div>
              <h2>Attendance Breakdown</h2>
              <p>Subject-wise attendance tracker</p>
            </div>
            <CalendarCheck size={20} />
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Classes Attended</th>
                  <th>Total Classes</th>
                  <th>Attendance Rate</th>
                  <th>Standing</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendanceBreakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.subject}</strong>
                    </td>
                    <td>{item.attended}</td>
                    <td>{item.total}</td>
                    <td>
                      <strong style={{ color: item.percentage >= 80 ? "#16a34a" : "#ea580c" }}>
                        {item.percentage}%
                      </strong>
                    </td>
                    <td>
                      <span className={`teacher-status ${item.status === "Good" ? "completed" : "pending"}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* EXAMINATIONS */}
        <section className="student-panel" id="examinations">
          <div className="panel-header">
            <div>
              <h2>Upcoming Examinations (CIA 1, CIA 2, SEMESTER)</h2>
              <p>Scheduled internal assessments and semester end examinations</p>
            </div>
            <GraduationCap size={20} />
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Exam Category</th>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Evaluation Scale</th>
                </tr>
              </thead>
              <tbody>
                {examinationsList.map((exam) => (
                  <tr key={exam.id}>
                    <td>
                      <span className="teacher-status completed" style={{ background: exam.type === "SEMESTER" ? "#eff6ff" : "#f0fdf4", color: exam.type === "SEMESTER" ? "#2563eb" : "#16a34a" }}>
                        {exam.type}
                      </span>
                    </td>
                    <td>
                      <strong>{exam.title}</strong>
                    </td>
                    <td>{exam.course}</td>
                    <td>
                      <div className="teacher-date">
                        <Calendar size={14} /> {exam.date} • {exam.time}
                      </div>
                    </td>
                    <td>{exam.venue}</td>
                    <td><strong>{exam.scale || exam.totalMarks}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RESULTS & CGPA MARKS */}
        <section className="student-panel" id="results">
          <div className="panel-header">
            <div>
              <h2>Semester Results & CGPA Breakdown</h2>
              <p>CIA 1, CIA 2, SEMESTER evaluation scores on a 1.0 - 10.0 double scale</p>
            </div>
            <Award size={20} />
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Subject Title</th>
                  <th>CIA 1 (10.0)</th>
                  <th>CIA 2 (10.0)</th>
                  <th>SEMESTER (10.0)</th>
                  <th>Final CGPA</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {resultsList.map((res) => (
                  <tr key={res.code}>
                    <td>{res.code}</td>
                    <td>
                      <strong>{res.name}</strong>
                    </td>
                    <td>{Number(res.cia1).toFixed(2)}</td>
                    <td>{Number(res.cia2).toFixed(2)}</td>
                    <td>{Number(res.semester).toFixed(2)}</td>
                    <td>
                      <strong style={{ color: "#2563eb", fontSize: "14px" }}>
                        {Number(res.cgpa).toFixed(2)} / 10.0
                      </strong>
                    </td>
                    <td>
                      <span className="teacher-status completed">{res.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* AI PERSONAL DIAGNOSIS MODAL */}
      {showAiModal && aiReport && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "650px", width: "95%" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAiModal(false)}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "#eff6ff", color: "#2563eb" }}>
                <Brain size={28} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px" }}>AI Personal Academic Diagnosis</h2>
                <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "13px" }}>
                  Analyzed for {aiReport.studentName} ({aiReport.studentEmail})
                </p>
              </div>
            </div>

            {/* STATUS BADGES */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, padding: "14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Overall CGPA</span>
                <strong style={{ display: "block", fontSize: "22px", color: "#2563eb", marginTop: "4px" }}>
                  {aiReport.avgCGPA} / 10.0
                </strong>
              </div>

              <div style={{ flex: 1, padding: "14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Academic Risk Tier</span>
                <strong style={{ display: "block", fontSize: "16px", color: aiReport.riskBadgeColor, marginTop: "6px" }}>
                  {aiReport.riskLevel}
                </strong>
              </div>
            </div>

            {/* WEAK SUBJECTS DIAGNOSIS */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <AlertTriangle size={17} color="#ea580c" />
                Weak Subjects Identified ({aiReport.weakSubjects.length})
              </h3>
              {aiReport.weakSubjects.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#16a34a" }}>✓ No critical weak subjects detected! All course scores are above target thresholds.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {aiReport.weakSubjects.map((sub) => (
                    <div key={sub.code} style={{ padding: "12px", borderRadius: "8px", background: "#fff7ed", border: "1px solid #fed7aa" }}>
                      <strong style={{ color: "#c2410c", fontSize: "14px" }}>{sub.name} ({sub.code})</strong>
                      <div style={{ fontSize: "12px", color: "#7c2d12", marginTop: "4px" }}>
                        Current Standing: <strong>{sub.cgpa.toFixed(2)} CGPA</strong> • CIA 1: {sub.cia1.toFixed(2)} • CIA 2: {sub.cia2.toFixed(2)}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ea580c" }}>{sub.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PERSONALIZED ACTION PLAN */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <Target size={17} color="#2563eb" />
                Personalized Improvement Action Plan
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {aiReport.actionPlan.map((action, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "13px", color: "#14532d" }}>
                    <CheckCircle size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowAiModal(false)}
              style={{ width: "100%", padding: "12px" }}
            >
              Close Diagnostic Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;