import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Building2,
  BarChart3,
  Brain,
  ShieldCheck,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileSpreadsheet,
  Activity,
  Server,
  X,
  Sparkles,
  Target,
  Edit2,
  Search,
  Cpu,
  Database,
  UserPlus,
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminDashboardApi,
  addDepartmentApi,
  updateDepartmentApi,
} from "../../services/api";
import { analyzeInstitutionalMetrics } from "../../services/aiAnalyticsEngine";

const mockInstitutionalData = [
  { department: "CS", students: 120, avgScore: 8.20 },
  { department: "EC", students: 65, avgScore: 7.80 },
  { department: "ME", students: 45, avgScore: 7.40 },
  { department: "EE", students: 50, avgScore: 7.60 },
  { department: "Civil", students: 30, avgScore: 7.20 },
];

const mockDepartments = [
  { id: 1, name: "Computer Science", code: "CS", head: "Dr. Arun Kumar", courses: 5, students: 120, capacity: 150 },
  { id: 2, name: "Electronics & Comm.", code: "EC", head: "Dr. Suresh Kumar", courses: 3, students: 65, capacity: 80 },
  { id: 3, name: "Mechanical Eng.", code: "ME", head: "Dr. Meena Krishnan", courses: 2, students: 45, capacity: 60 },
  { id: 4, name: "Electrical Eng.", code: "EE", head: "Dr. Priya Sharma", courses: 2, students: 50, capacity: 60 },
];

const mockUsers = [
  { id: 1, name: "Pradosh Priyan", email: "student@portal.edu", role: "Student", dept: "Computer Science", status: "Active", lastLogin: "2 mins ago" },
  { id: 2, name: "Dr. Kumar", email: "teacher@portal.edu", role: "Teacher", dept: "Computer Science", status: "Active", lastLogin: "10 mins ago" },
  { id: 3, name: "System Admin", email: "admin@portal.edu", role: "Admin", dept: "Administration", status: "Active", lastLogin: "Just now" },
  { id: 4, name: "Priya Sharma", email: "priya@portal.edu", role: "Student", dept: "Electronics & Comm.", status: "Active", lastLogin: "1 hour ago" },
  { id: 5, name: "Dr. Suresh", email: "suresh@portal.edu", role: "Teacher", dept: "Electrical Eng.", status: "Active", lastLogin: "Yesterday" },
];

const mockRecentActivity = [
  { id: 1, action: "New course registered: Artificial Intelligence (CS306)", category: "Academic", user: "Dr. Ravi", time: "10 mins ago" },
  { id: 2, action: "User role permission upgraded: Faculty -> Head of CS", category: "User", user: "System Admin", time: "1 hour ago" },
  { id: 3, action: "Semester results compiled for CS department", category: "Academic", user: "System Engine", time: "3 hours ago" },
  { id: 4, action: "Automated database backup completed successfully", category: "System", user: "Cron Job", time: "5 hours ago" },
  { id: 5, action: "Attendance report generated for June 2026", category: "Academic", user: "System Admin", time: "Yesterday" },
];

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("educationPortalUser");
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || typeof parsedUser !== "object") return null;
    return parsedUser;
  } catch {
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [activeTab, setActiveTab] = useState("overview");
  const [departments, setDepartments] = useState(mockDepartments);
  const [userList, setUserList] = useState(mockUsers);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [institutionalData, setInstitutionalData] = useState(mockInstitutionalData);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [stats, setStats] = useState({
    totalStudents: 310,
    facultyMembers: 18,
    activeCourses: 12,
    systemHealth: "99.94%"
  });

  /* MODALS */
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", code: "", head: "", courses: 1, students: 0, capacity: 60 });

  const [showEditDeptModal, setShowEditDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", dept: "Computer Science" });

  const [showAdminAiModal, setShowAdminAiModal] = useState(false);
  const [adminAiReport, setAdminAiReport] = useState(null);

  useEffect(() => {
    async function loadAdminData() {
      const data = await fetchAdminDashboardApi();
      if (data) {
        if (data.departments) setDepartments(data.departments);
        if (data.institutionalData) setInstitutionalData(data.institutionalData);
        if (data.recentActivity) setRecentActivity(data.recentActivity);
        if (data.totalStudents) {
          setStats({
            totalStudents: data.totalStudents,
            facultyMembers: data.facultyMembers,
            activeCourses: data.activeCourses,
            systemHealth: data.systemHealth || "99.94%"
          });
        }
      }
    }
    loadAdminData();
  }, []);

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

  const triggerAdminAiAnalysis = () => {
    const report = analyzeInstitutionalMetrics({
      departments,
      totalStudents: stats.totalStudents,
      activeCourses: stats.activeCourses,
    });
    setAdminAiReport(report);
    setShowAdminAiModal(true);
  };

  const handleAddDeptSubmit = async (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) {
      alert("Please provide department name and code.");
      return;
    }

    try {
      const created = await addDepartmentApi(newDept);
      setDepartments((prev) => [created, ...prev]);
    } catch {
      const created = {
        id: Date.now(),
        name: newDept.name.trim(),
        code: newDept.code.trim().toUpperCase(),
        head: newDept.head ? newDept.head.trim() : "Unassigned",
        courses: Number(newDept.courses) || 1,
        students: Number(newDept.students) || 0,
        capacity: Number(newDept.capacity) || 60,
      };
      setDepartments((prev) => [created, ...prev]);
    }

    setNewDept({ name: "", code: "", head: "", courses: 1, students: 0, capacity: 60 });
    setShowAddDeptModal(false);
  };

  const openEditDeptModal = (dept) => {
    setEditingDept({ ...dept });
    setShowEditDeptModal(true);
  };

  const handleEditDeptSubmit = async (e) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name || !editingDept.code) {
      alert("Please provide department name and code.");
      return;
    }

    const updates = {
      name: editingDept.name.trim(),
      code: editingDept.code.trim().toUpperCase(),
      head: editingDept.head.trim(),
      courses: Number(editingDept.courses),
      students: Number(editingDept.students),
      capacity: Number(editingDept.capacity || 60),
    };

    try {
      const result = await updateDepartmentApi(editingDept.id, updates);
      if (Array.isArray(result)) {
        setDepartments(result);
      } else {
        setDepartments((prev) =>
          prev.map((d) => (d.id === editingDept.id ? { ...d, ...updates } : d))
        );
      }
      alert(`Department ${updates.name} updated successfully!`);
    } catch {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editingDept.id ? { ...d, ...updates } : d))
      );
      alert(`Department ${updates.name} updated!`);
    }

    setShowEditDeptModal(false);
    setEditingDept(null);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert("Please provide user name and email.");
      return;
    }

    const createdUser = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      role: newUser.role,
      dept: newUser.dept,
      status: "Active",
      lastLogin: "Just now",
    };

    setUserList((prev) => [createdUser, ...prev]);
    setNewUser({ name: "", email: "", role: "Student", dept: "Computer Science" });
    setShowAddUserModal(false);
    alert(`New ${newUser.role} user created: ${newUser.email}`);
  };

  const toggleUserStatus = (id) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
      )
    );
  };

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="student-dashboard">
      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2>Education Portal</h2>
            <span>Admin Center</span>
          </div>
        </div>

        <nav className="student-nav" aria-label="Admin navigation">
          <button
            type="button"
            className={`student-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => scrollToSection("admin-top", "overview")}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "departments" ? "active" : ""}`}
            onClick={() => scrollToSection("admin-departments", "departments")}
          >
            <Building2 size={18} />
            Departments
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => scrollToSection("admin-users", "users")}
          >
            <Users size={18} />
            User Roles & Accounts
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => scrollToSection("admin-analytics", "analytics")}
          >
            <BarChart3 size={18} />
            Institutional Analytics
          </button>

          <button
            type="button"
            className={`student-nav-item ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => scrollToSection("admin-ai-insights", "ai")}
          >
            <Brain size={18} />
            AI Executive Report
          </button>
        </nav>

        <button type="button" className="student-logout" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main" id="admin-top">
        {/* HEADER */}
        <header className="student-header">
          <div>
            <p className="student-header-label">Administrator Control Center</p>
            <h1>Welcome back, {user?.name || "System Admin"}</h1>
            <p>Monitor system health, manage department allocations, user security roles, and AI executive insights.</p>
          </div>

          <div className="student-profile">
            <div className="student-avatar" style={{ background: "#2563eb", color: "white" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>{user?.email || "admin@portal.edu"}</strong>
              <span>System Administrator</span>
            </div>
          </div>
        </header>

        {/* SYSTEM HEALTH BAR */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "22px" }}>
          <div style={{ padding: "14px", borderRadius: "12px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a" }}>
              <Server size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Server Status</span>
              <strong style={{ display: "block", fontSize: "15px", color: "#16a34a" }}>Online (99.94%)</strong>
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb" }}>
              <Cpu size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>API Latency</span>
              <strong style={{ display: "block", fontSize: "15px", color: "#2563eb" }}>42 ms (Optimal)</strong>
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#faf5ff", color: "#9333ea" }}>
              <Database size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>DB Storage</span>
              <strong style={{ display: "block", fontSize: "15px", color: "#9333ea" }}>1.2 GB / 10 GB</strong>
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#fff7ed", color: "#ea580c" }}>
              <Users size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Active Sessions</span>
              <strong style={{ display: "block", fontSize: "15px", color: "#ea580c" }}>312 Users Live</strong>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <section className="student-stats" aria-label="System statistics">
          <div className="student-stat-card">
            <div className="stat-icon blue">
              <Users size={20} />
            </div>
            <div>
              <span>Total Students</span>
              <strong>{stats.totalStudents}</strong>
              <small>Across {departments.length} departments</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon purple">
              <UserCheck size={20} />
            </div>
            <div>
              <span>Faculty Members</span>
              <strong>{stats.facultyMembers}</strong>
              <small>Active instructors</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon green">
              <BookOpen size={20} />
            </div>
            <div>
              <span>Active Courses</span>
              <strong>{stats.activeCourses}</strong>
              <small>Current semester</small>
            </div>
          </div>

          <div className="student-stat-card">
            <div className="stat-icon orange">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span>System Health</span>
              <strong>{stats.systemHealth}</strong>
              <small>All services operational</small>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS BAR */}
        <section className="student-panel" style={{ marginBottom: "22px" }}>
          <div className="panel-header">
            <div>
              <h2>Admin Quick Operations</h2>
              <p>Execute key administrative and system tasks</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setShowAddDeptModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #bfdbfe",
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Plus size={18} />
              <div>
                <span>Add Department</span>
                <small style={{ display: "block", color: "#3b82f6", fontWeight: "normal", fontSize: "11px" }}>Create new academic branch</small>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #e9d5ff",
                background: "#faf5ff",
                color: "#9333ea",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <UserPlus size={18} />
              <div>
                <span>Create User Account</span>
                <small style={{ display: "block", color: "#a855f7", fontWeight: "normal", fontSize: "11px" }}>Assign Student / Teacher role</small>
              </div>
            </button>

            <button
              type="button"
              onClick={() => alert("Automated system backup initiated. Store database state saved!")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
                color: "#16a34a",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Database size={18} />
              <div>
                <span>Run System Backup</span>
                <small style={{ display: "block", color: "#22c55e", fontWeight: "normal", fontSize: "11px" }}>Backup JSON database store</small>
              </div>
            </button>

            <button
              type="button"
              onClick={triggerAdminAiAnalysis}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #fed7aa",
                background: "#fff7ed",
                color: "#ea580c",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Sparkles size={18} />
              <div>
                <span>Generate AI Executive Report</span>
                <small style={{ display: "block", color: "#f97316", fontWeight: "normal", fontSize: "11px" }}>Capacity & risk analysis</small>
              </div>
            </button>
          </div>
        </section>

        {/* ANALYTICS CHART & AI INSIGHTS */}
        <section className="student-grid" id="admin-analytics">
          <div className="student-panel performance-panel">
            <div className="panel-header">
              <div>
                <h2>Institutional Performance Standing</h2>
                <p>Average student CGPA scores by department (1.0 - 10.0 scale)</p>
              </div>
              <TrendingUp size={20} />
            </div>

            <div className="performance-chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={institutionalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <Tooltip formatter={(val) => [`${Number(val).toFixed(2)} CGPA`, "Average Score"]} />
                  <Bar dataKey="avgScore" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="student-panel ai-panel" id="admin-ai-insights">
            <div className="ai-title">
              <div className="ai-icon">
                <Brain size={21} />
              </div>
              <div>
                <h2>AI Executive Insights</h2>
                <p>Institutional anomaly & growth analysis</p>
              </div>
            </div>

            <div className="ai-risk">
              <AlertTriangle size={18} />
              <div>
                <strong>High Demand in Computer Science</strong>
                <p>Student enrollment in CS electives increased by 24% this semester. Additional faculty allocation recommended.</p>
              </div>
            </div>

            <div className="ai-recommendation">
              <CheckCircle size={18} />
              <div>
                <strong>System Optimization</strong>
                <p>Attendance tracking compliance reached 96%. All department grade reports are submitted on schedule.</p>
              </div>
            </div>

            <button
              type="button"
              className="ai-button"
              onClick={triggerAdminAiAnalysis}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Sparkles size={16} />
              Open AI Executive Decision Report
            </button>
          </div>
        </section>

        {/* DEPARTMENTS OVERVIEW GRID */}
        <section className="student-panel" id="admin-departments">
          <div className="panel-header">
            <div>
              <h2>Department Overview & Management</h2>
              <p>Add, edit, and monitor academic department capacities and heads</p>
            </div>

            <button
              type="button"
              className="view-button"
              onClick={() => setShowAddDeptModal(true)}
            >
              <Plus size={16} style={{ display: "inline", marginRight: "4px" }} />
              Add Department
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "15px" }}>
            {departments.map((dept) => (
              <div
                key={dept.id}
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ padding: "4px 8px", borderRadius: "6px", background: "#eff6ff", color: "#2563eb", fontWeight: "700", fontSize: "12px" }}>
                        {dept.code}
                      </span>
                      <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>{dept.name}</h3>
                    </div>
                    <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                      Head: <strong>{dept.head}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditDeptModal(dept)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #bfdbfe",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    <Edit2 size={13} />
                    Edit Dept
                  </button>
                </div>

                {/* STATS BADGES */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", background: "#f8fafc", fontSize: "12px", border: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Active Courses</span>
                    <strong style={{ color: "#0f172a", fontSize: "15px" }}>{dept.courses} Courses</strong>
                  </div>

                  <div style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", background: "#f8fafc", fontSize: "12px", border: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Enrolled Students</span>
                    <strong style={{ color: "#2563eb", fontSize: "15px" }}>{dept.students} Students</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* USER ROLES & ACCOUNT MANAGEMENT */}
        <section className="student-panel" id="admin-users">
          <div className="panel-header">
            <div>
              <h2>User Roles & Security Accounts</h2>
              <p>Manage system users, role authorizations, and account status</p>
            </div>

            <button
              type="button"
              className="view-button"
              onClick={() => setShowAddUserModal(true)}
            >
              <UserPlus size={16} style={{ display: "inline", marginRight: "4px" }} />
              Add User Account
            </button>
          </div>

          {/* SEARCH & FILTERS */}
          <div style={{ display: "flex", gap: "12px", marginTop: "15px", marginBottom: "15px" }}>
            <div className="assignment-search" style={{ flex: 1 }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search user by name or email address..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="course-filter"
            >
              <option value="All">All User Roles</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Account Status</th>
                  <th>Last Login</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="teacher-status completed" style={{ background: u.role === "Admin" ? "#faf5ff" : u.role === "Teacher" ? "#eff6ff" : "#f0fdf4", color: u.role === "Admin" ? "#9333ea" : u.role === "Teacher" ? "#2563eb" : "#16a34a" }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.dept}</td>
                    <td>
                      <span className={`teacher-status ${u.status === "Active" ? "completed" : "danger"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{u.lastLogin}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: u.status === "Active" ? "1px solid #fecaca" : "1px solid #bbf7d0",
                          background: u.status === "Active" ? "#fef2f2" : "#f0fdf4",
                          color: u.status === "Active" ? "#dc2626" : "#16a34a",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* AUDIT LOG & SYSTEM EVENTS */}
        <section className="student-panel">
          <div className="panel-header">
            <div>
              <h2>System Security & Audit Activity Log</h2>
              <p>Real-time system events, permission changes, and security triggers</p>
            </div>
            <Activity size={20} />
          </div>

          <div className="assignment-list">
            {recentActivity.map((log) => (
              <div className="assignment-row" key={log.id}>
                <div className="assignment-icon" style={{ background: log.category === "System" ? "#f0fdf4" : log.category === "User" ? "#faf5ff" : "#eff6ff", color: log.category === "System" ? "#16a34a" : log.category === "User" ? "#9333ea" : "#2563eb" }}>
                  <FileSpreadsheet size={18} />
                </div>

                <div className="assignment-info">
                  <strong>{log.action}</strong>
                  <span>Initiated by: <strong>{log.user}</strong></span>
                </div>

                <div className="assignment-due">
                  {log.time}
                </div>

                <span className="status completed" style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                  {log.category || "General"} Log
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* EDIT DEPT MODAL */}
      {showEditDeptModal && editingDept && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "450px" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => {
                setShowEditDeptModal(false);
                setEditingDept(null);
              }}
            >
              <X size={19} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ padding: "10px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb" }}>
                <Edit2 size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px" }}>Edit Department</h2>
                <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px" }}>
                  Modify department info, head, and course counts
                </p>
              </div>
            </div>

            <form onSubmit={handleEditDeptSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Department Name *
                </label>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Department Code *
                </label>
                <input
                  type="text"
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Head of Department
                </label>
                <input
                  type="text"
                  value={editingDept.head}
                  onChange={(e) => setEditingDept({ ...editingDept, head: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Courses Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingDept.courses}
                    onChange={(e) => setEditingDept({ ...editingDept, courses: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Enrolled Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingDept.students}
                    onChange={(e) => setEditingDept({ ...editingDept, students: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%" }}>
                Save Department Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD DEPT MODAL */}
      {showAddDeptModal && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "450px" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAddDeptModal(false)}
            >
              <X size={19} />
            </button>
            <h2>Add Academic Department</h2>
            <form onSubmit={handleAddDeptSubmit} style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Department Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Science & AI"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Department Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DS"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Head of Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={newDept.head}
                  onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%" }}>
                Add Department
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "450px" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAddUserModal(false)}
            >
              <X size={19} />
            </button>
            <h2>Create New User Account</h2>
            <form onSubmit={handleAddUserSubmit} style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  User Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="user@portal.edu"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Role Authorization
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                    Department
                  </label>
                  <select
                    value={newUser.dept}
                    onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Comm.">Electronics & Comm.</option>
                    <option value="Mechanical Eng.">Mechanical Eng.</option>
                    <option value="Electrical Eng.">Electrical Eng.</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%" }}>
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN AI EXECUTIVE REPORT MODAL */}
      {showAdminAiModal && adminAiReport && (
        <div className="course-modal-overlay">
          <div className="course-modal" style={{ maxWidth: "650px", width: "95%" }}>
            <button
              type="button"
              className="course-modal-close"
              onClick={() => setShowAdminAiModal(false)}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ padding: "12px", borderRadius: "12px", background: "#eff6ff", color: "#2563eb" }}>
                <Brain size={28} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px" }}>Executive AI Strategic Decision Report</h2>
                <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "13px" }}>
                  Institutional performance analysis & strategic resource allocation
                </p>
              </div>
            </div>

            {/* METRICS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Institutional Students</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#2563eb", marginTop: "4px" }}>
                  {adminAiReport.totalStudents}
                </strong>
              </div>

              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Active Courses</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#16a34a", marginTop: "4px" }}>
                  {adminAiReport.activeCourses} Courses
                </strong>
              </div>

              <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Departments</span>
                <strong style={{ display: "block", fontSize: "18px", color: "#9333ea", marginTop: "4px" }}>
                  {departments.length} Active
                </strong>
              </div>
            </div>

            {/* DEPARTMENT ANALYSIS */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <Building2 size={17} color="#2563eb" />
                Departmental Capacity & Performance Status
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {adminAiReport.departmentAnalysis.map((dept) => (
                  <div key={dept.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                    <div>
                      <strong style={{ fontSize: "14px" }}>{dept.name} ({dept.code})</strong>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748b" }}>Head: {dept.head} • {dept.students} Students</span>
                    </div>
                    <span className="status completed" style={{ background: dept.code === "CS" ? "#fff7ed" : "#f0fdf4", color: dept.code === "CS" ? "#ea580c" : "#16a34a" }}>
                      {dept.health}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* EXECUTIVE RECOMMENDATIONS */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", marginBottom: "10px" }}>
                <Target size={17} color="#2563eb" />
                Strategic Executive Action Items
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {adminAiReport.executiveRecommendations.map((rec, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", padding: "10px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", fontSize: "13px", color: "#1e40af" }}>
                    <CheckCircle size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowAdminAiModal(false)}
              style={{ width: "100%", padding: "12px" }}
            >
              Close Strategic Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;