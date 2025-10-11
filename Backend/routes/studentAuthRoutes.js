const express = require("express");
const { registerStudent, loginStudent } = require("../controllers/studentAuthController");
const {getAttendanceByDate ,getRecentAttendanceByRollNo,getStudentByRollNo,getPresentCount,getTotalClasses } = require("../controllers/getStudentAttendance");
const authStudent = require("../middleware/authStudent"); 
const router = express.Router();

router.get("/attendance/by-date", authStudent, getAttendanceByDate);

router.get("/attendance/present/:roll_no",authStudent, getPresentCount);
router.post("/register", registerStudent);
router.post("/login", loginStudent);
// router.post("/attendance", authStudent, getStudentAttendance);
// router.get("/student/total-classes", authStudent, getTotalClasses);
router.get("/attendance/total/:roll_no", authStudent, getTotalClasses);
// router.get("/student/present-classes", authStudent, getPresentClasses);
// router.get("/attendance-percentage",authStudent,getAttendancePercentage);
router.get("/attendance/recent/roll_no",authStudent,getRecentAttendanceByRollNo);
router.get("/rollno/:roll_no",authStudent,getStudentByRollNo);
module.exports = router;