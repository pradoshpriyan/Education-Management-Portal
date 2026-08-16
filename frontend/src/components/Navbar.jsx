import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Hide global Navbar on dashboard layouts to prevent text clipping into sidebar
  const isDashboardPage =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/teacher") ||
    location.pathname.startsWith("/admin");

  if (isDashboardPage) {
    return null;
  }


  const handleLogout = () => {

    localStorage.removeItem(
      "educationPortalUser"
    );

    setUser(null);
    setMobileOpen(false);

    navigate("/");
  };


  const dashboardPath = user?.role
    ? `/${user.role}/dashboard`
    : "/login";


  return (
    <nav
      className="navbar"
      aria-label="Main navigation"
    >

      <Link
        to="/"
        className="navbar-brand"
        aria-label="Education Management Portal home"
      >

        <GraduationCap size={28} />

        <span>
          Education Management Portal
        </span>

      </Link>


      {/* Desktop navigation */}
      <div className="navbar-links">

        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "nav-active"
              : ""
          }
        >
          Home
        </Link>


        <Link
          to="/courses"
          className={
            location.pathname.startsWith("/courses")
              ? "nav-active"
              : ""
          }
        >
          Courses
        </Link>


        {user ? (

          <>

            <Link
              to={dashboardPath}
              className="dashboard-nav-link"
            >

              <LayoutDashboard size={16} />

              Dashboard

            </Link>


            <button
              type="button"
              onClick={handleLogout}
              className="login-button logout-button"
            >

              <LogOut size={16} />

              Logout

            </button>

          </>

        ) : (

          <Link
            to="/login"
            className="login-button"
          >
            Login
          </Link>

        )}

      </div>


      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() =>
          setMobileOpen((previous) => !previous)
        }
        aria-label={
          mobileOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
      >

        {mobileOpen
          ? <X size={24} />
          : <Menu size={24} />
        }

      </button>


      {/* Mobile navigation */}
      {mobileOpen && (

        <div
          className="mobile-navbar-menu"
          role="menu"
        >

          <Link
            to="/"
            role="menuitem"
            className={
              location.pathname === "/"
                ? "nav-active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/courses"
            role="menuitem"
            className={
              location.pathname.startsWith("/courses")
                ? "nav-active"
                : ""
            }
          >
            Courses
          </Link>


          {user ? (

            <>

              <Link
                to={dashboardPath}
                role="menuitem"
                className="dashboard-nav-link"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>


              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="login-button logout-button"
              >
                <LogOut size={16} />
                Logout
              </button>

            </>

          ) : (

            <Link
              to="/login"
              role="menuitem"
              className="login-button"
            >
              Login
            </Link>

          )}

        </div>

      )}

    </nav>
  );
}


export default Navbar;