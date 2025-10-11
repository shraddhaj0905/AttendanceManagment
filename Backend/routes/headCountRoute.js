const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises; // For cleaning up temporary files

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'), // Ensure this folder exists in your backend root
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle image upload and head counting
router.post('/headcount', upload.single('image'), async (req, res) => { // Changed '/head-count' to '/headcount' to match your index.js
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    // Construct the imagePath directly from destination and filename
    const imagePath = path.join(req.file.destination, req.file.filename);
    const pythonScriptPath = path.join(__dirname, '..', 'models', 'head_count.py');

    console.log('Temporary Image Path:', imagePath);
    console.log('Python Script Path:', pythonScriptPath);

    try {
        const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log('Python stdout:', data.toString()); // Log Python output
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error('Python stderr:', data.toString()); // Log Python errors
        });

        pythonProcess.on('close', async (code) => {
            console.log(`Python script exited with code ${code}`);
            // Clean up the uploaded image file
            try {
                await fs.unlink(imagePath);
                console.log(`Deleted temporary file: ${imagePath}`);
            } catch (err) {
                console.error('Error deleting temporary file:', err);
            }

            if (code === 0) {
                // Look for the head count in the Python script's output
                const match = result.match(/Total heads counted: (\d+)/);
                if (match && match[1]) {
                    const headCount = parseInt(match[1], 10);
                    res.json({ headCount });
                } else {
                    console.error('Python script output:', result);
                    res.status(500).send('Error processing image.');
                }
            } else {
                console.error('Python script error:', error);
                res.status(500).send(`Error processing image: ${error}`);
            }
        });
    } catch (err) {
        console.error('Error spawning Python process:', err);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;