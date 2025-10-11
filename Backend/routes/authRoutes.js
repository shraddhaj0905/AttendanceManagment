// const express = require("express");
// const { registerTeacher, loginTeacher } = require("../controllers/authController");
// // const{authTeacher} = require("../middleware/authTeacher");
// const { markAttendance } = require("../controllers/attendanceController");

// // Protected route - only accessible by authenticated teachers

// const router = express.Router();
// router.post("/register", registerTeacher);
// router.post("/login", loginTeacher);
// // router.post("/mark", authTeacher, markAttendance);
// module.exports = router;

// teacherRoutes.js (routes/authRoutes.js)

const express = require("express");
const { registerTeacher, loginTeacher } = require("../controllers/authController");
const { markAttendance, getTeacherData, getRecentAttendance, getAttendanceStats, getAbsentStudents } = require("../controllers/attendanceController");
const authTeacher = require("../middleware/authTeacher");
const isAuth = require("../middleware/isAuth");


const router = express.Router();
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.post("/mark", markAttendance);
router.get("/subjects",getTeacherData) // Use the imported middleware
router.get("/recent",authTeacher,getRecentAttendance);

router.get("/stats",authTeacher,getAttendanceStats);
router.get('/absentees', authTeacher ,getAbsentStudents);
module.exports = router;