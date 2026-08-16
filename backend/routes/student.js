import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {
    const courses = db.getCourses();
    const assignments = db.getAssignments();
    const exams = db.getExams();
    const results = db.getResults();

    return res.json({
      courses,
      assignments,
      examinations: exams,
      results,
      attendanceAverage: "84.5%",
      cgpa: "8.44 / 10.0"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/assignments/:id/toggle', (req, res) => {
  try {
    const updatedAssignments = db.toggleAssignment(req.params.id);
    return res.json(updatedAssignments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
