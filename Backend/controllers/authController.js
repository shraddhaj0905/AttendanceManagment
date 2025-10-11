const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const JWT_SECRET = process.env.JWT_SECRET ; // Use env variable in production

// Register Teacher
exports.registerTeacher = async (req, res) => {
    const { name, email, password, subjects } = req.body;
    const subjectsArray = subjects.split(",").map(subject => subject.trim());


    try {
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = new Teacher({ name, email, password: hashedPassword, subjects: subjectsArray });
        await teacher.save();

        res.status(201).json({ message: "Teacher registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering teacher" });
    }
};

// Login Teacher
exports.loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const token = jwt.sign(
            { id: teacher._id, role: "teacher" },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: "Lax", // "None" if frontend and backend are on different domains and using HTTPS
            maxAge: 36000000, // 1 hour
          });
        res.json({ message: "Teacher logged in successfully", teacher,token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
