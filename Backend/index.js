
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// require("dotenv").config();
// const PORT = process.env.PORT || 4000;
// const geminiTranscribeRoute = require("./routes/geminiTranscribeRoute");
// app.use("/api", geminiTranscribeRoute);

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const studentAuthRoutes = require("./routes/studentAuthRoutes");
// const ocrRoutes = require("./routes/ocrRoute");

// // Connect to MongoDB
// require("./config/database").connect();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve uploaded files (e.g. attendance images)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.get("/api/ping", (req, res) => {
//     res.json({ message: "pong" });
//   });
// // API Routes
// app.use("/api/auth", authRoutes);              // Teacher authentication
// app.use("/api/student", studentAuthRoutes);    // Student auth and attendance view
// app.use("/api/ocr", ocrRoutes);                // OCR image upload and processing

// // Start server
// app.listen(PORT, () => {
//   console.log(`App is listening at http://localhost:${PORT}`);
// });



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;




// Routes
const authRoutes = require("./routes/authRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const ocrRoutes = require("./routes/ocrRoute");
const geminiTranscribeRoute = require("./routes/geminiTranscribeRoute");
const attendenceRoute = require("./routes/attendenceRoute");
const headCountRoute = require("./routes/headCountRoute");
// Connect to MongoDB
require("./config/database").connect();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend origin
  methods: 'POST, OPTIONS', // Specify the allowed HTTP methods for this route
  allowedHeaders: ['Content-Type','Authorization'], // Specify the allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Serve uploaded files (e.g. attendance images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentAuthRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api", geminiTranscribeRoute);
app.use("/api", headCountRoute);
// app.use("/api/attendance", attendenceRoute); // Attendance routes


// Start server
app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});