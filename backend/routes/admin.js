import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {
    const departments = db.getDepartments();
    const auditLogs = db.getAuditLogs();

    const institutionalData = [
      { department: "CS", students: 120, avgScore: 8.20 },
      { department: "EC", students: 65, avgScore: 7.80 },
      { department: "ME", students: 45, avgScore: 7.40 },
      { department: "EE", students: 50, avgScore: 7.60 },
      { department: "Civil", students: 30, avgScore: 7.20 }
    ];

    return res.json({
      totalStudents: 310,
      facultyMembers: 18,
      activeCourses: 12,
      systemHealth: "99.9%",
      institutionalData,
      departments,
      recentActivity: auditLogs
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/departments', (req, res) => {
  try {
    const { name, code, head, courses, students } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Department name and code are required.' });
    }

    const newDept = {
      id: Date.now(),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      head: head ? head.trim() : 'Unassigned',
      courses: Number(courses) || 1,
      students: Number(students) || 0
    };

    db.addDepartment(newDept);
    return res.status(201).json(newDept);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/departments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedDepts = db.updateDepartment(id, updates);
    return res.json(updatedDepts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
