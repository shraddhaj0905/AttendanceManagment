// const mongoose = require("mongoose");

// const teacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true }, // Hashed password
//   subjects: [{ type: String }], // Subjects the teacher teaches

//   // Stores attendance records marked by this teacher
//   attendanceRecords: [
//     {
//       date: { type: String, required: true },
//       time: { type: String, required: true },
//       subject: { type: String, required: true },
//       present_roll_numbers: [{ type: Number }] // Students marked present
//     }
//   ]
// });

// module.exports = mongoose.model("Teacher", teacherSchema);

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  subjects: [{ type: String }], // Subjects the teacher teaches
  attendanceRecords: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
      subject: { type: String, required: true },
      present_roll_numbers: [{ type: String }] // Students marked present
    }
  ]
});

module.exports = mongoose.model("Teacher", teacherSchema);