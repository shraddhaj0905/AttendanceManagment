// const mongoose = require("mongoose");

// const StudentSchema = new mongoose.Schema({
//     roll_no: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     attendance: [
//         {
//             subject: String,
//             date: String,
//             time: String,
//             status: String // "Present" or "Absent"
//         }
//     ]
// });

// module.exports = mongoose.model("Student", StudentSchema);

const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    roll_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    attendance: [
        {
            subject: String,
            date: String,
            time: String,
            status: String, 
            markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
        }
    ]
});

module.exports = mongoose.model("Student", StudentSchema);