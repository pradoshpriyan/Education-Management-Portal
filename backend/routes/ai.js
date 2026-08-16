import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/analyze', (req, res) => {
  try {
    const { role } = req.body;
    const students = db.getStudents();
    const courses = db.getCourses();
    const exams = db.getExams();
    const results = db.getResults();

    if (role === 'student') {
      const weakSubjects = results.filter(r => r.cgpa < 7.5 || r.cia1 < 7.0);
      return res.json({
        role: 'student',
        analysis: {
          cgpa: "8.44 / 10.0",
          weakSubjectsCount: weakSubjects.length,
          weakSubjects,
          recommendation: "Focus extra study time on Database Management SQL Joins prior to CIA 2."
        }
      });
    }

    if (role === 'teacher') {
      const atRisk = students.filter(s => s.attendance < 75 || s.score < 6.5);
      return res.json({
        role: 'teacher',
        analysis: {
          totalStudents: students.length,
          atRiskCount: atRisk.length,
          classCGPA: "7.60 / 10.0",
          recommendation: "Schedule revision workshop for DBMS CIA 2 assessment."
        }
      });
    }

    return res.json({
      role: 'admin',
      analysis: {
        totalStudents: 310,
        institutionalCGPA: "7.84 / 10.0",
        recommendation: "Allocate 2 extra faculty to Computer Science department."
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
