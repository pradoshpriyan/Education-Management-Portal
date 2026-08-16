import {
  GraduationCap,
  Brain,
  BarChart3,
  ShieldCheck,
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <Brain size={18} />
            AI-Powered Academic Intelligence
          </div>


          <h1>
            Smarter Education.
            <span>
              Better Academic Outcomes.
            </span>
          </h1>


          <p>
            Education Management Portal is a unified platform for
            students, teachers, and administrators to manage courses,
            attendance, assignments, examinations, and academic
            performance.
          </p>


          <div className="hero-buttons">

            <Link
              to="/courses"
              className="primary-button"
            >
              Explore Courses
              <ArrowRight size={18} />
            </Link>


            <Link
              to="/login"
              className="secondary-button"
            >
              Login to Portal
            </Link>

          </div>

        </div>


        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">
              <GraduationCap size={24} />
              <span>
                Academic Overview
              </span>
            </div>


            <div className="preview-stats">

              <div>
                <span>Attendance</span>
                <strong>87%</strong>
              </div>

              <div>
                <span>Performance</span>
                <strong>82%</strong>
              </div>

              <div>
                <span>Progress</span>
                <strong>78%</strong>
              </div>

            </div>


            <div className="preview-chart">

              <div className="chart-bar bar-1" />
              <div className="chart-bar bar-2" />
              <div className="chart-bar bar-3" />
              <div className="chart-bar bar-4" />
              <div className="chart-bar bar-5" />
              <div className="chart-bar bar-6" />
              <div className="chart-bar bar-7" />

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="section">

        <div className="section-heading">

          <span>POWERFUL FEATURES</span>

          <h2>
            Everything needed for
            <br />
            modern academic management
          </h2>

          <p>
            One platform connecting students, teachers and
            administrators with meaningful academic insights.
          </p>

        </div>


        <div className="feature-grid">

          <FeatureCard
            icon={<BookOpen />}
            title="Course Management"
            description="Discover, manage, schedule and enroll in courses from a centralized platform."
          />

          <FeatureCard
            icon={<ClipboardCheck />}
            title="Academic Activities"
            description="Manage assignments, attendance, examinations, marks and academic records."
          />

          <FeatureCard
            icon={<Brain />}
            title="AI Academic Intelligence"
            description="Analyze performance, identify weak subjects and generate personalized recommendations."
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Performance Analytics"
            description="Track academic progress through clear dashboards, charts and comparative reports."
          />

          <FeatureCard
            icon={<Users />}
            title="Student & Teacher Experience"
            description="Give students and teachers dedicated tools for their daily academic activities."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Administration"
            description="Manage students, teachers, courses, classes and academic records efficiently."
          />

        </div>

      </section>


      {/* AI Section */}
      <section className="ai-section">

        <div className="ai-content">

          <div className="section-label">
            <Brain size={18} />
            AI-POWERED ACADEMIC INTELLIGENCE
          </div>


          <h2>
            Turn academic data into
            <span> meaningful action.</span>
          </h2>


          <p>
            Analyze attendance, assignments, examination marks and
            academic performance to identify risks and provide
            personalized recommendations.
          </p>


          <div className="ai-features">

            <div>

              <TrendingUp size={20} />

              <div>
                <strong>
                  Performance Analysis
                </strong>

                <p>
                  Understand academic trends.
                </p>
              </div>

            </div>


            <div>

              <ShieldCheck size={20} />

              <div>
                <strong>
                  Risk Detection
                </strong>

                <p>
                  Identify students requiring attention.
                </p>
              </div>

            </div>


            <div>

              <Brain size={20} />

              <div>
                <strong>
                  Personalized Recommendations
                </strong>

                <p>
                  Suggest targeted improvement actions.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Roles */}
      <section className="section">

        <div className="section-heading">

          <span>ONE PLATFORM</span>

          <h2>
            Designed for every academic role
          </h2>

        </div>


        <div className="role-grid">

          <RoleCard
            title="Students"
            description="Access courses, submit assignments, check attendance, view results and track academic progress."
          />

          <RoleCard
            title="Teachers"
            description="Manage classes, record attendance, evaluate assignments, conduct examinations and monitor students."
          />

          <RoleCard
            title="Administrators"
            description="Manage academic operations, analyze institutional performance and access AI-powered insights."
          />

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Build a smarter academic ecosystem.
        </h2>

        <p>
          Manage education. Understand performance.
          Improve outcomes.
        </p>


        <Link
          to="/courses"
          className="primary-button"
        >
          Explore Courses
          <ArrowRight size={18} />
        </Link>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div>

          <div className="footer-brand">
            <GraduationCap size={24} />
            Education Management Portal
          </div>

          <p>
            Smart academic management for modern education.
          </p>

        </div>


        <div className="footer-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/courses">
            Courses
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

      </footer>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  description,
}) {

  return (
    <article className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </article>
  );
}


function RoleCard({
  title,
  description,
}) {

  return (
    <article className="role-card">

      <div className="role-icon">
        <GraduationCap size={24} />
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <ArrowRight size={20} />

    </article>
  );
}


export default Home;