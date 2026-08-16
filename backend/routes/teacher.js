import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {
    const students = db.getStudents();
    const assignments = db.getAssignments();
    const exams = db.getExams();
    const courses = db.getCourses();
    const attendanceLogs = db.getAttendanceLogs();

    return res.json({
      students,
      assignments,
      examinations: exams,
      courses,
      attendanceLogs
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/students', (req, res) => {
  try {
    const { name, roll, attendance, score } = req.body;
    if (!name || !roll) {
      return res.status(400).json({ error: 'Student name and roll number are required.' });
    }

    const att = Number(attendance || 85);
    const scr = Number(score || 7.5);
    const status = att < 75 || scr < 5.0 ? 'At Risk' : att < 80 || scr < 7.0 ? 'Monitor' : 'Good';

    const newStudent = {
      name: name.trim(),
      roll: roll.trim().toUpperCase(),
      attendance: att,
      score: Number(scr.toFixed(2)),
      status
    };

    db.addStudent(newStudent);
    return res.status(201).json(newStudent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/students/:roll', (req, res) => {
  try {
    const { roll } = req.params;
    const updates = req.body;
    const updatedRoster = db.updateStudent(roll, updates);
    return res.json(updatedRoster);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/exams', (req, res) => {
  try {
    const { title, type, course, date, time, venue, totalMarks } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Exam title and date are required.' });
    }

    const newExam = {
      id: Date.now(),
      title,
      type: type || 'CIA 1',
      course: course || 'Data Structures',
      date,
      time: time || '10:00 AM - 12:00 PM',
      venue: venue || 'Lab 1',
      totalMarks: totalMarks || '10.0 CGPA',
      status: 'Scheduled'
    };

    db.addExam(newExam);
    return res.status(201).json(newExam);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/attendance', (req, res) => {
  try {
    const { course, date, records } = req.body;
    if (!course || !records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Course and student attendance records are required.' });
    }

    const result = db.recordAttendanceBatch({ course, date, records });
    return res.status(201).json({
      message: 'Attendance sheet submitted successfully.',
      ...result
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
