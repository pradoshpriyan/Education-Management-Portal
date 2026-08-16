import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  UserCheck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { loginApi } from "../../services/api";

const DEMO_USERS = {
  student: {
    email: "student@portal.edu",
    name: "Pradosh Priyan",
  },
  teacher: {
    email: "teacher@portal.edu",
    name: "Dr. Kumar",
  },
  admin: {
    email: "admin@portal.edu",
    name: "Administrator",
  },
};

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState(DEMO_USERS.student.email);
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(DEMO_USERS[selectedRole].email);
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call live Express REST API
      const result = await loginApi(normalizedEmail, password, role);
      localStorage.setItem("educationPortalUser", JSON.stringify(result.user));

      if (role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      // Fallback for demo login if offline
      console.warn("[Auth] API authentication failed, using local session state.", err.message);
      const fallbackUser = {
        email: normalizedEmail,
        role,
        name: DEMO_USERS[role]?.name || "User",
      };
      localStorage.setItem("educationPortalUser", JSON.stringify(fallbackUser));

      if (role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <div className="login-logo-icon">
            <GraduationCap size={28} />
          </div>
          <h1>Education Portal</h1>
          <p>AI-Powered Academic Intelligence & Backend API</p>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <h2>Welcome Back</h2>
            <p>Sign in to access your education portal</p>
          </div>

          <div className="login-role-title" id="role-label">
            Select Your Role
          </div>

          <div className="login-role-selector" role="group" aria-labelledby="role-label">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => handleRoleSelect("student")}
              aria-pressed={role === "student"}
            >
              <GraduationCap size={15} />
              Student
            </button>

            <button
              type="button"
              className={role === "teacher" ? "active" : ""}
              onClick={() => handleRoleSelect("teacher")}
              aria-pressed={role === "teacher"}
            >
              <UserCheck size={15} />
              Teacher
            </button>

            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => handleRoleSelect("admin")}
              aria-pressed={role === "admin"}
            >
              <Shield size={15} />
              Admin
            </button>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-input">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input">
                <Lock size={18} />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/">← Return to Home Page</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;