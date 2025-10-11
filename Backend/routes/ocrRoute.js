const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Health check route
router.get("/ping", (req, res) => {
  res.send("OCR route is working");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// OCR image route
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const geminiKey = process.env.GEMINI_API_KEY;

    console.log("Gemini Key Length:", geminiKey?.length);

    const python = spawn("python", ["./models/ocr.py", imagePath, geminiKey]);

    let data = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    python.on("close", (code) => {
      try {
        // Extract JSON content from stdout in case anything else sneaks in
        const match = data.match(/\{[\s\S]*\}/);
        const output = match ? JSON.parse(match[0]) : null;

        // ADD THIS LINE FOR DEBUGGING
        console.log("Parsed Python Output:", output);

        if (!output) throw new Error("Invalid JSON response from OCR script");

        res.json(output);
      } catch (e) {
        console.error("Failed to parse Python output:", e);
        res.status(500).json({ error: "Failed to process image" });
      }
    });
  } catch (err) {
    console.error("OCR route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
