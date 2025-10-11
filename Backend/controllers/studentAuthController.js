const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.registerStudent = async (req, res) => {
  const { roll_no, name, email, password } = req.body;

  if (!roll_no || !name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingStudent = await Student.findOne({ roll_no });
    if (existingStudent) return res.status(400).json({ message: "Roll number already registered" });

    const emailExists = await Student.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ roll_no, name, email, password: hashedPassword });

    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};

const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    //  Include roll_no in the token
    const token = jwt.sign(
      { id: student._id, roll_no: student.roll_no, role: "student" }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "Lax", // "None" if frontend and backend are on different domains and using HTTPS
      maxAge: 36000000, // 1 hour
    });

    res.json({ message: "Login successful", token, student});
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

