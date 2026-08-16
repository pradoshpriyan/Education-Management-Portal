import {
  ClipboardList,
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  X,
  Edit3,
  Trash2,
  Eye,
  ArrowLeft,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


const initialAssignments = [
  {
    id: 1,
    title: "Full Stack React App",
    course: "Full Stack Development",
    className: "Computer Science",
    description:
      "Implement a full stack web application with React frontend and Express backend.",
    dueDate: "2026-08-18",
    totalMarks: 100,
    submissions: 32,
    totalStudents: 40,
    status: "Active",
  },
  {
    id: 2,
    title: "Exploratory Data Analysis",
    course: "Foundation of Data Science",
    className: "Computer Science",
    description:
      "Perform data cleaning, EDA, and statistical visualization using Python Pandas.",
    dueDate: "2026-08-20",
    totalMarks: 100,
    submissions: 28,
    totalStudents: 40,
    status: "Active",
  },
  {
    id: 3,
    title: "React Portfolio",
    course: "Web Development",
    className: "Web Development",
    description:
      "Create a responsive portfolio website using React.",
    dueDate: "2026-08-22",
    totalMarks: 100,
    submissions: 36,
    totalStudents: 40,
    status: "Active",
  },
];


function AssignmentManagement() {

  const navigate = useNavigate();

  const [assignments, setAssignments] =
    useState(initialAssignments);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState(null);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    className: "",
    description: "",
    dueDate: "",
    totalMarks: 100,
  });


  /* =====================================================
     FORM HANDLERS
     ===================================================== */

  const handleInputChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const resetForm = () => {

    setFormData({
      title: "",
      course: "",
      className: "",
      description: "",
      dueDate: "",
      totalMarks: 100,
    });

    setEditingAssignment(null);
    setShowForm(false);
  };


  const handleSubmit = (event) => {

    event.preventDefault();

    if (
      !formData.title ||
      !formData.course ||
      !formData.className ||
      !formData.dueDate
    ) {
      alert("Please fill all required fields.");
      return;
    }


    if (editingAssignment) {

      setAssignments((previous) =>
        previous.map((assignment) =>
          assignment.id === editingAssignment.id
            ? {
              ...assignment,
              ...formData,
              totalMarks: Number(formData.totalMarks),
            }
            : assignment
        )
      );

    } else {

      const newAssignment = {
        id: Date.now(),
        ...formData,
        totalMarks: Number(formData.totalMarks),
        submissions: 0,
        totalStudents: 40,
        status: "Active",
      };

      setAssignments((previous) => [
        newAssignment,
        ...previous,
      ]);
    }

    resetForm();
  };


  /* =====================================================
     EDIT
     ===================================================== */

  const handleEdit = (assignment) => {

    setEditingAssignment(assignment);

    setFormData({
      title: assignment.title,
      course: assignment.course,
      className: assignment.className,
      description: assignment.description,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
    });

    setShowForm(true);
  };


  /* =====================================================
     DELETE
     ===================================================== */

  const handleDelete = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    setAssignments((previous) =>
      previous.filter(
        (assignment) => assignment.id !== id
      )
    );
  };


  /* =====================================================
     FILTER
     ===================================================== */

  const filteredAssignments =
    assignments.filter((assignment) => {

      const search =
        searchTerm.toLowerCase();

      return (
        assignment.title
          .toLowerCase()
          .includes(search) ||
        assignment.course
          .toLowerCase()
          .includes(search) ||
        assignment.className
          .toLowerCase()
          .includes(search)
      );
    });


  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalAssignments =
    assignments.length;

  const totalSubmissions =
    assignments.reduce(
      (total, assignment) =>
        total + assignment.submissions,
      0
    );

  const pendingSubmissions =
    assignments.reduce(
      (total, assignment) =>
        total +
        (assignment.totalStudents -
          assignment.submissions),
      0
    );

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.submissions ===
        assignment.totalStudents
    ).length;


  /* =====================================================
     RETURN
     ===================================================== */

  return (

    <div className="assignment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="assignment-header">

        <div className="assignment-header-left">

          <button
            type="button"
            className="assignment-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>

          <div>

            <p className="assignment-header-label">
              Teacher Module
            </p>

            <h1>
              Assignment Management
            </h1>

            <p>
              Create, manage and evaluate student
              assignments.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="assignment-create-button"
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Create Assignment
        </button>

      </header>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="assignment-stats">

        <div className="assignment-stat-card">

          <div className="assignment-stat-icon blue">
            <ClipboardList size={21} />
          </div>

          <div>
            <span>Total Assignments</span>
            <strong>{totalAssignments}</strong>
            <small>Created assignments</small>
          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Total Submissions</span>
            <strong>{totalSubmissions}</strong>
            <small>Student submissions</small>
          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon orange">
            <Clock size={21} />
          </div>

          <div>
            <span>Pending Submissions</span>
            <strong>{pendingSubmissions}</strong>
            <small>Awaiting submission</small>
          </div>

        </div>


        <div className="assignment-stat-card">

          <div className="assignment-stat-icon purple">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedAssignments}</strong>
            <small>Fully submitted</small>
          </div>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="assignment-toolbar">

        <div className="assignment-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search assignments, courses or classes..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>

      </section>


      {/* =================================================
          ASSIGNMENT LIST
      ================================================= */}

      <section className="assignment-panel">

        <div className="assignment-panel-header">

          <div>

            <h2>
              Assignments
            </h2>

            <p>
              Manage all assignments created for your
              classes.
            </p>

          </div>

          <ClipboardList size={20} />

        </div>


        <div className="assignment-list">

          {filteredAssignments.length === 0 ? (

            <div className="assignment-empty">

              <ClipboardList size={40} />

              <h3>
                No assignments found
              </h3>

              <p>
                Try another search or create a new
                assignment.
              </p>

            </div>

          ) : (

            filteredAssignments.map(
              (assignment) => (

                <div
                  className="assignment-card"
                  key={assignment.id}
                >

                  {/* Card Header */}

                  <div className="assignment-card-top">

                    <div>

                      <h3>
                        {assignment.title}
                      </h3>

                      <span className="assignment-course">
                        {assignment.course}
                      </span>

                    </div>


                    <span
                      className={
                        assignment.submissions ===
                          assignment.totalStudents
                          ? "assignment-status completed"
                          : "assignment-status active"
                      }
                    >
                      {assignment.submissions ===
                        assignment.totalStudents
                        ? "Completed"
                        : assignment.status}
                    </span>

                  </div>


                  {/* Description */}

                  <p className="assignment-description">
                    {assignment.description}
                  </p>


                  {/* Information */}

                  <div className="assignment-info">

                    <div>
                      <Users size={16} />

                      <span>
                        {assignment.className}
                      </span>
                    </div>


                    <div>
                      <Calendar size={16} />

                      <span>
                        Due: {assignment.dueDate}
                      </span>
                    </div>


                    <div>
                      <ClipboardList size={16} />

                      <span>
                        {assignment.totalMarks} Marks
                      </span>
                    </div>

                  </div>


                  {/* Submission Progress */}

                  <div className="assignment-progress-section">

                    <div className="assignment-progress-header">

                      <span>
                        Submissions
                      </span>

                      <strong>
                        {assignment.submissions}/
                        {assignment.totalStudents}
                      </strong>

                    </div>


                    <div className="assignment-progress">

                      <div
                        className="assignment-progress-bar"
                        style={{
                          width: `${(assignment.submissions /
                            assignment.totalStudents) *
                            100
                            }%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="assignment-actions">

                    <button
                      type="button"
                      className="assignment-view-button"
                      onClick={() =>
                        setSelectedAssignment(
                          assignment
                        )
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>


                    <button
                      type="button"
                      className="assignment-edit-button"
                      onClick={() =>
                        handleEdit(assignment)
                      }
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>


                    <button
                      type="button"
                      className="assignment-delete-button"
                      onClick={() =>
                        handleDelete(assignment.id)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </section>


      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div className="assignment-modal-overlay">

          <div className="assignment-modal">

            <div className="assignment-modal-header">

              <div>

                <h2>
                  {editingAssignment
                    ? "Edit Assignment"
                    : "Create Assignment"}
                </h2>

                <p>
                  Enter the assignment details below.
                </p>

              </div>


              <button
                type="button"
                className="assignment-close-button"
                onClick={resetForm}
              >
                <X size={19} />
              </button>

            </div>


            <form
              className="assignment-form"
              onSubmit={handleSubmit}
            >

              {/* Title */}

              <div className="assignment-form-group">

                <label>
                  Assignment Title *
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />

              </div>


              {/* Course + Class */}

              <div className="assignment-form-row">

                <div className="assignment-form-group">

                  <label>
                    Course *
                  </label>

                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                  >

                    <option value="">
                      Select course
                    </option>

                    <option value="Data Structures">
                      Data Structures
                    </option>

                    <option value="Database Management">
                      Database Management
                    </option>

                    <option value="Web Development">
                      Web Development
                    </option>

                    <option value="Java Programming">
                      Java Programming
                    </option>

                    <option value="Software Engineering">
                      Software Engineering
                    </option>

                  </select>

                </div>


                <div className="assignment-form-group">

                  <label>
                    Class *
                  </label>

                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    required
                  >

                    <option value="">
                      Select class
                    </option>

                    <option value="Computer Science">
                      Computer Science
                    </option>

                    <option value="Web Development">
                      Web Development
                    </option>

                    <option value="Java Programming">
                      Java Programming
                    </option>

                    <option value="Software Engineering">
                      Software Engineering
                    </option>

                  </select>

                </div>

              </div>


              {/* Description */}

              <div className="assignment-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the assignment..."
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />

              </div>


              {/* Date + Marks */}

              <div className="assignment-form-row">

                <div className="assignment-form-group">

                  <label>
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />

                </div>


                <div className="assignment-form-group">

                  <label>
                    Total Marks
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    min="1"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                  />

                </div>

              </div>


              {/* Buttons */}

              <div className="assignment-form-actions">

                <button
                  type="button"
                  className="assignment-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="assignment-save-button"
                >
                  {editingAssignment
                    ? "Update Assignment"
                    : "Create Assignment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {selectedAssignment && (

        <div className="assignment-modal-overlay">

          <div className="assignment-modal assignment-view-modal">

            <div className="assignment-modal-header">

              <div>

                <p className="assignment-header-label">
                  Assignment Details
                </p>

                <h2>
                  {selectedAssignment.title}
                </h2>

              </div>


              <button
                type="button"
                className="assignment-close-button"
                onClick={() =>
                  setSelectedAssignment(null)
                }
              >
                <X size={19} />
              </button>

            </div>


            <div className="assignment-detail-content">

              <div className="assignment-detail-item">

                <span>Course</span>

                <strong>
                  {selectedAssignment.course}
                </strong>

              </div>


              <div className="assignment-detail-item">

                <span>Class</span>

                <strong>
                  {selectedAssignment.className}
                </strong>

              </div>


              <div className="assignment-detail-item">

                <span>Due Date</span>

                <strong>
                  {selectedAssignment.dueDate}
                </strong>

              </div>


              <div className="assignment-detail-item">

                <span>Total Marks</span>

                <strong>
                  {selectedAssignment.totalMarks}
                </strong>

              </div>


              <div className="assignment-detail-item">

                <span>Submissions</span>

                <strong>
                  {selectedAssignment.submissions}/
                  {selectedAssignment.totalStudents}
                </strong>

              </div>


              <div className="assignment-detail-description">

                <span>Description</span>

                <p>
                  {selectedAssignment.description}
                </p>

              </div>

            </div>


            <button
              type="button"
              className="assignment-save-button"
              onClick={() =>
                setSelectedAssignment(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}


export default AssignmentManagement;