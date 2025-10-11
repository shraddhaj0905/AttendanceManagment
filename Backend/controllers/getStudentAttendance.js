const Student = require("../models/Student"); // Adjust path as needed


// exports.getAttendanceByDate = async (req, res) => {
//     try {
//         const { roll_no } = req.params;
//         const { date } = req.body;

//         if (!date) {
//             return res.status(400).json({ message: "Date is required in request body" });
//         }

//         const student = await Student.findOne({ roll_no });
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         const attendanceOnDate = student.attendance.filter(
//             (record) => record.date === date
//         );

//         if (attendanceOnDate.length === 0) {
//             return res.status(404).json({ message: "No attendance found for this date" });
//         }

//         // Only return subject, date, time, and status
//         const formatted = attendanceOnDate.map(record => ({
//             subject: record.subject,
//             date: record.date,
//             time: record.time,
//             status: record.status
//         }));

//         res.status(200).json({
//             roll_no,
//             date,
//             attendance: formatted
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

exports.getAttendanceByDate = async (req, res) => {
    try {
        const  roll_no  = req.student.roll_no;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date is required in query string" });
        }

        const student = await Student.findOne({ roll_no });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const formattedDate = dateObj.toISOString().split('T')[0];

        const attendanceOnDate = student.attendance.filter(
            (record) => record.date === formattedDate
        );

        if (attendanceOnDate.length === 0) {
            return res.status(404).json({ message: "No attendance found for this date" });
        }

        const formatted = attendanceOnDate.map(record => ({
            subject: record.subject,
            date: record.date,
            time: record.time,
            status: record.status
        }));

        res.status(200).json({
            roll_no: roll_no,
            recentAttendance: formatted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching attendance" });
    }
};





exports.getTotalClasses = async (req, res) => {
  try {
      const { roll_no } = req.params;

      const student = await Student.findOne({ roll_no });
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      const totalClasses = student.attendance.length;

      res.status(200).json({ roll_no, totalClasses });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
  

exports.getPresentCount = async (req, res) => {
  try {
    const { roll_no } = req.params;

    const student = await Student.findOne({ roll_no });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const presentCount = student.attendance.filter(
      (entry) => entry.status === "Present"
    ).length;

    res.status(200).json({ roll_no, presentCount });
  } catch (err) {
    console.error("Error fetching present count:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentByRollNo = async (req, res) => {
  try {
      const student = await Student.findOne({ roll_no: req.params.roll_no });

      if (!student) return res.status(404).json({ message: "Student not found" });

      // Only send selected fields in the response
      res.json({
          name: student.name,
          email: student.email,
          roll_no: student.roll_no
      });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
};



// Get top 5 recent attendance records for a student by roll_no
exports.getRecentAttendanceByRollNo = async (req, res) => {

  console.log("🎓 Roll No:", req.student.roll_no);
    try {
        const student = await Student.findOne({ roll_no: req.student.roll_no });

        if (!student) return res.status(404).json({ message: "Student not found" });

        // Sort attendance records by date (assuming date is in ISO format like "2025-04-15")
        const sortedAttendance = student.attendance
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5); // Top 5 recent entries

        // Pick only required fields
        const recentAttendance = sortedAttendance.map(record => ({
            date: record.date,
            time: record.time,
            subject: record.subject,
            status: record.status
        }));

        res.json({ roll_no: student.roll_no, recentAttendance });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};