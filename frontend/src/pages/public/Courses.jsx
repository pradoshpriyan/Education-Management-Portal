import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  CalendarDays,
  X,
  ArrowRight,
} from "lucide-react";
import { courseData as initialCourseData } from "../../data/courses";
import { fetchCoursesApi } from "../../services/api";

function Courses() {
  const [coursesList, setCoursesList] = useState(initialCourseData);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    async function loadBackendCourses() {
      const data = await fetchCoursesApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setCoursesList(data);
      }
    }
    loadBackendCourses();
  }, []);

  const departments = [
    "All",
    ...new Set(coursesList.map((course) => course.department)),
  ];

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return coursesList.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.code.toLowerCase().includes(normalizedSearch) ||
        (course.teacher && course.teacher.toLowerCase().includes(normalizedSearch));

      const matchesDepartment =
        department === "All" || course.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department, coursesList]);

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <main className="courses-page">
      <div className="courses-container">
        <header className="courses-header">
          <div>
            <span className="courses-label">Academic Learning</span>
            <h1>Courses</h1>
            <p>
              Explore academic courses, syllabus, and class schedules across departments.
            </p>
          </div>

          <div className="courses-count">
            <BookOpen size={20} />
            <span>{filteredCourses.length} Courses</span>
          </div>
        </header>

        <section
          className="courses-controls"
          aria-label="Course search and filters"
        >
          <div className="course-search">
            <Search size={20} />
            <input
              type="search"
              aria-label="Search courses"
              placeholder="Search courses, code or teacher..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="course-filter"
            aria-label="Filter courses by department"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {filteredCourses.length === 0 ? (
          <div className="no-courses">
            <BookOpen size={44} />
            <h2>No courses found</h2>
            <p>Try changing your search or filter.</p>
          </div>
        ) : (
          <section className="course-grid" aria-label="Available courses">
            {filteredCourses.map((course) => {
              return (
                <article className="course-card" key={course.id || course.code}>
                  <div className="course-card-top">
                    <span className="course-code">{course.code}</span>
                    <span className="course-level">{course.level}</span>
                  </div>

                  <h2>{course.title}</h2>

                  <p className="course-description">{course.description}</p>

                  <div className="course-info">
                    <div>
                      <Clock size={17} />
                      <span>{course.duration}</span>
                    </div>

                    <div>
                      <Users size={17} />
                      <span>{course.students} Students</span>
                    </div>

                    <div>
                      <CalendarDays size={17} />
                      <span>{course.scheduleText || course.schedule?.[0]}</span>
                    </div>
                  </div>

                  <div className="course-actions">
                    <button
                      type="button"
                      className="course-overview-btn"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Quick Overview
                    </button>

                    <Link
                      to={`/courses/${course.id}`}
                      className="course-details-btn"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* QUICK OVERVIEW MODAL */}
      {selectedCourse && (
        <div
          className="course-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="course-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="course-modal-close"
              onClick={closeModal}
              aria-label="Close overview modal"
            >
              <X size={20} />
            </button>

            <div className="course-modal-header">
              <span className="course-code">{selectedCourse.code}</span>
              <h2 id="modal-title">{selectedCourse.title}</h2>
              <p>{selectedCourse.description}</p>
            </div>

            <div className="course-modal-grid">
              <div>
                <h3>Instructor</h3>
                <p>{selectedCourse.teacher || selectedCourse.instructor}</p>
              </div>

              <div>
                <h3>Duration</h3>
                <p>{selectedCourse.duration}</p>
              </div>

              <div>
                <h3>Department</h3>
                <p>{selectedCourse.department}</p>
              </div>

              <div>
                <h3>Level</h3>
                <p>{selectedCourse.level}</p>
              </div>
            </div>

            <div className="course-modal-section">
              <h3>Weekly Schedule</h3>
              <ul>
                {(selectedCourse.schedule || []).map((item, index) => (
                  <li key={`${selectedCourse.code}-schedule-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="course-modal-section">
              <h3>Syllabus Overview</h3>
              <ul>
                {(selectedCourse.syllabus || []).map((topic, index) => (
                  <li key={`${selectedCourse.code}-syllabus-${index}`}>{topic}</li>
                ))}
              </ul>
            </div>

            <div className="course-modal-actions">
              <button
                type="button"
                className="course-modal-secondary"
                onClick={closeModal}
              >
                Close
              </button>

              <Link
                to={`/courses/${selectedCourse.id}`}
                className="course-modal-primary"
                onClick={closeModal}
              >
                Full Details Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Courses;