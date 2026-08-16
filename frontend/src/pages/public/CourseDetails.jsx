import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  Users,
  GraduationCap,
  CheckCircle,
  Award,
} from "lucide-react";
import { courseData } from "../../data/courses";

function CourseDetails() {
  const { id } = useParams();
  const numericId = Number(id);

  const course = courseData.find((item) => item.id === numericId);

  if (!course) {
    return (
      <main className="course-not-found">
        <h1>Course Not Found</h1>
        <p>The course you are looking for does not exist.</p>
        <Link to="/courses" className="primary-button">
          <ArrowLeft size={18} />
          Back to Courses
        </Link>
      </main>
    );
  }

  return (
    <main className="course-details-page">
      <Link to="/courses" className="back-link">
        <ArrowLeft size={18} />
        Back to Courses
      </Link>

      {/* Course Header */}
      <section className="course-details-header">
        <div className="course-details-main">
          <span className="course-category">{course.category}</span>

          <h1>{course.title} ({course.code})</h1>

          <p>{course.description}</p>

          <div className="course-info-row">
            <div>
              <GraduationCap size={20} />
              <span>{course.instructor}</span>
            </div>

            <div>
              <Clock size={20} />
              <span>{course.duration}</span>
            </div>

            <div>
              <Users size={20} />
              <span>{course.students} Enrolled Students</span>
            </div>
          </div>
        </div>

        {/* Course Summary Card */}
        <div className="enrollment-card">
          <div className="enrollment-icon">
            <Award size={32} />
          </div>

          <h2>Academic Overview</h2>

          <p>
            This course is part of the {course.department} curriculum for the current academic semester.
          </p>

          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span style={{ color: "#64748b" }}>Level</span>
              <strong>{course.level}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <span style={{ color: "#64748b" }}>Duration</span>
              <strong>{course.duration}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#64748b" }}>Department</span>
              <strong>{course.department}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-details-grid">
        {/* Syllabus */}
        <div className="details-card">
          <div className="details-card-heading">
            <BookOpen size={24} />
            <div>
              <span>COURSE CONTENT</span>
              <h2>What you'll learn</h2>
            </div>
          </div>

          <div className="syllabus-list">
            {course.syllabus.map((topic, index) => (
              <div
                className="syllabus-item"
                key={`${course.title}-${index}`}
              >
                <CheckCircle size={20} />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="details-card">
          <div className="details-card-heading">
            <CalendarDays size={24} />
            <div>
              <span>CLASS SCHEDULE</span>
              <h2>Weekly Schedule</h2>
            </div>
          </div>

          <div className="schedule-list">
            {course.schedule.map((item, index) => (
              <div
                className="schedule-item"
                key={`${course.title}-schedule-${index}`}
              >
                <Clock size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CourseDetails;