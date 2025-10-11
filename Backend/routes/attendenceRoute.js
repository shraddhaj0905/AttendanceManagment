const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authteacher = require('../middleware/authTeacher');

// Protect routes with auth middleware
router.use(authteacher);

// Route to mark attendance
router.post('/mark-attendance', attendanceController.markAttendance);

// Route to extract roll numbers from UI
router.post('/extract-roll-numbers', attendanceController.extractRollNumbers);

module.exports = router;

