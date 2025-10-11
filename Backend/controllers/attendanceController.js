
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.getTeacherData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const teacherId = decoded.id;

        const teacher = await Teacher.findById(teacherId).select("subjects");
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.json({ subjects: teacher.subjects });
    } catch (error) {
        console.error("Error fetching teacher data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.markAttendance = async (req, res) => {
    const { subject, date, time, present_students } = req.body;

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const teacherId = decoded.id;
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const students = await Student.find();
        console.log(students)

        for (let student of students) {
            const alreadyMarked = student.attendance?.some(
                (entry) => entry.date === date && entry.time === time && entry.subject === subject
            );

            if (alreadyMarked) {
                return res.status(400).json({
                    message: `Attendance for student ${student.name} (Roll No: ${student.roll_no}) already marked for ${date} ${time}`
                });
            }

            const isPresent = present_students.includes(student.roll_no);

            student.attendance.push({
                subject,
                date,
                time,
                status: isPresent ? "Present" : "Absent",
                markedBy: teacherId
            });

            await student.save();
        }

        teacher.attendanceRecords.push({
            subject,
            date,
            time,
            present_roll_numbers: present_students
        });

        await teacher.save();

        res.status(200).json({
            message: "Attendance recorded successfully",
            present_students
        });

    } catch (error) {
        console.error("Attendance Marking Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.extractRollNumbers = async (req, res) => {
    try {
        const { checkedRollNumbers, subject } = req.body;

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const teacherId = decoded.id;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        if (!teacher.subjects.includes(subject)) {
            return res.status(400).json({ message: "Teacher is not assigned to the subject" });
        }

        res.status(200).json({
            message: "Roll numbers extracted successfully",
            present_students: checkedRollNumbers
        });
    } catch (error) {
        console.error("Error extracting roll numbers:", error);
        res.status(500).json({ message: "Error extracting roll numbers", error });
    }
};

exports.getRecentAttendance = async (req, res) => {
    try {   
        const teacherId = req.teacher.id; 
        
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        // Get the 10 most recent attendance records
        const recentAttendance = teacher.attendanceRecords
            .sort((b,a) => {
                // Sort by date (newest first)
                const dateA = new Date(a.date + 'T' + a.time);
                const dateB = new Date(b.date + 'T' + b.time);
                return dateB - dateA;
            })
            .slice(0, 10); // Get only the 10 most recent records
        
        return res.status(200).json({ 
            recentAttendance,
            message: 'Recent attendance records retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching recent attendance:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Controller function to get attendance statistics
exports.getAttendanceStats = async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        // Get counts by subject
        const subjectCounts = {};
        teacher.subjects.forEach(subject => {
            subjectCounts[subject] = 0;
        });
        
        // Count attendance records by subject
        teacher.attendanceRecords.forEach(record => {
            if (subjectCounts.hasOwnProperty(record.subject)) {
                subjectCounts[record.subject]++;
            }
        });
        
        // Get last 30 days attendance count
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCount = teacher.attendanceRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= thirtyDaysAgo;
        }).length;
        
        return res.status(200).json({ 
            totalRecords: teacher.attendanceRecords.length,
            subjectCounts,
            recentCount,
            message: 'Attendance statistics retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching attendance statistics:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Alternative approach using query parameters
exports.getAbsentStudents = async (req, res) => {
    try {
        const { subject, date, time } = req.query;
        const teacherId = req.teacher.id;
        
        if (!subject || !date || !time) {
            return res.status(400).json({ message: 'Subject, date, and time are required' });
        }
        
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        // Find the specific attendance record
        const attendanceRecord = teacher.attendanceRecords.find(
            record => record.subject === subject && 
                     record.date === date && 
                     record.time === time
        );
        
        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        
        // Get all students who should be in this class
        const students = await Student.find();
        
        // Get the roll numbers of present students
        const presentRollNumbers = attendanceRecord.present_roll_numbers || [];
        
        // Calculate absent roll numbers by filtering out present ones
        const absentRollNumbers = students
            .map(student => student.roll_no)
            .filter(rollNo => !presentRollNumbers.includes(rollNo));
        
        return res.status(200).json({
            absentRollNumbers,
            subject: attendanceRecord.subject,
            date: attendanceRecord.date,
            time: attendanceRecord.time,
            message: 'Absent students retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching absent students:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};