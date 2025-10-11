// const express = require("express");
// const multer = require("multer");
// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config();

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/gemini-transcribe", upload.single("audio"), (req, res) => {
//   console.log("Received request at /api/gemini-transcribe"); // Added log
//   const audioPath = path.join(__dirname, "..", req.file.path);
//   const geminiKey = process.env.GEMINI_API_KEY;

//   const python = spawn("python", [
//     "models/gemini_transcribe.py",
//     audioPath,
//     geminiKey,
//   ]);

//   let result = "";
//   python.stdout.on("data", (data) => {
//     result += data.toString();
//   });

//   python.stderr.on("data", (data) => {
//     console.error("Python error:", data.toString());
//   });

//   python.on("close", (code) => {
//     fs.unlink(audioPath, () => {}); // Always delete temp file
//     if (code !== 0) {
//       console.error("Python process exited with code:", code); // Added log
//       return res.status(500).json({ error: "Error processing audio" });
//     }
//     if (result.includes("ERROR")) {
//       console.error("Python script returned an error:", result); // Added log
//       return res.status(500).json({ error: result });
//     }
//     console.log("Sending successful transcription response:", { transcript: result.trim() }); // Added log
//     res.json({ transcript: result.trim() });
//   });
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/gemini-transcribe", upload.single("audio"), (req, res) => {
  console.log("Received request at /api/gemini-transcribe"); // Added log
  const audioPath = path.join(__dirname, "..", req.file.path);
  const geminiKey = process.env.GEMINI_API_KEY;

  const python = spawn("python", [
    "models/gemini_transcribe.py",
    audioPath,
    geminiKey,
  ]);

  let result = "";
  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python.on("close", (code) => {
    fs.unlink(audioPath, () => {}); // Always delete temp file
    if (code !== 0) {
      console.error("Python process exited with code:", code); // Added log
      console.log("Sending error response due to Python process exit."); // Added log
      return res.status(500).json({ error: "Error processing audio" });
    }
    if (result.includes("ERROR")) {
      console.error("Python script returned an error:", result); // Added log
      console.log("Sending error response due to Python script error."); // Added log
      return res.status(500).json({ error: result });
    }
    console.log("Sending successful transcription response:", { transcript: result.trim() }); // Added log
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Added this line for testing
    res.json({ transcript: result.trim() });
  });
});

module.exports = router;