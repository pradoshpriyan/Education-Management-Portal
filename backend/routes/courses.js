import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const courses = db.getCourses();
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const course = db.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
