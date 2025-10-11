import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const AttendancePage = () => {
    const { className } = useParams();
    const navigate = useNavigate();

    // --- State variables remain the same ---
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceTime, setAttendanceTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [retrievedAttendance, setRetrievedAttendance] = useState(null);
    const [classImage, setClassImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [extractedRollNumbers, setExtractedRollNumbers] = useState([]);
    const [audioFile, setAudioFile] = useState(null);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState(null);
    const [headCountImage, setHeadCountImage] = useState(null);
    const [previewHeadCountImage, setPreviewHeadCountImage] = useState(null);
    const [headCount, setHeadCount] = useState(null);
    const [headCountError, setHeadCountError] = useState('');
    const [isCountingHeads, setIsCountingHeads] = useState(false);
    const [processedHeadCountImage, setProcessedHeadCountImage] = useState(null);
    // --- End of state variables ---

    useEffect(() => {
        // Initialize attendance data when component mounts
        const startRoll = 23201;
        const endRoll = 23287;
        // **** Defaulting all students to PRESENT initially might be better if OCR lists absentees ****
        const students = Array.from({ length: endRoll - startRoll + 1 }, (_, i) => {
            const rollNumber = startRoll + i;
            // Default everyone to PRESENT, OCR will mark the extracted ones as ABSENT
            return { studentId: rollNumber, name: rollNumber.toString().padStart(5, '0'), present: true };
        });
        setAttendanceData(students);
    }, [className]);

    const handleGoBack = () => {
        navigate('/teacher-dashboard');
    };

    const toggleAttendance = (studentId) => {
        setAttendanceData(
            attendanceData.map(item =>
                item.studentId === studentId ? { ...item, present: !item.present } : item
            )
        );
    };

    // OCR functions
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setClassImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setClassImage(null);
        setPreviewImage(null);
        setExtractedRollNumbers([]); // Clear extracted rolls on image removal
    };

    // ***** MODIFIED FUNCTION *****
    const extractRollNumbersFromImage = async () => {
        if (!classImage) {
            alert('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', classImage);

        // Optional: Indicate processing state
        // setIsLoading(true); // You might want a specific loading state for OCR

        try {
            const response = await fetch('http://localhost:4000/api/ocr/image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data && data.rollNos) {
                const extractedRollsFormatted = data.rollNos.map(roll => roll.toString().padStart(5, '0'));
                setExtractedRollNumbers(extractedRollsFormatted); // Keep for potential display/PDF

                // --- LOGIC INVERSION ---
                // Update attendance data: Mark students found in the OCR list as ABSENT.
                // Assumption: The OCR image contains a list of ABSENT students.
                const updatedAttendance = attendanceData.map((student) => {
                    const rollNumber = student.studentId.toString().padStart(5, '0');
                    // Check if the student's roll number is in the extracted list (meaning they are ABSENT)
                    const isAbsent = extractedRollsFormatted.includes(rollNumber);
                    // Set 'present' status to the opposite of whether they were found in the list
                    return { ...student, present: !isAbsent };
                });
                setAttendanceData(updatedAttendance);
                // --- END OF LOGIC INVERSION ---

                // Optional: Provide feedback
                 alert(`Attendance updated based on OCR. ${extractedRollsFormatted.length} roll numbers processed.`);


            } else {
                alert('No roll numbers found or an error occurred during OCR.');
                setExtractedRollNumbers([]);
                // Decide if you want to reset attendance here. If the initial state is all present,
                // failing OCR means no one is marked absent by it, which might be correct.
                // setAttendanceData(attendanceData.map(student => ({...student, present: true }))); // Reset to all present if needed
            }
        } catch (error) {
            console.error('There was an error during OCR processing:', error);
            alert('An error occurred while communicating with the server for OCR.');
            setExtractedRollNumbers([]);
             // Decide on error state - keeping current state might be safer than resetting
            // setAttendanceData(attendanceData.map(student => ({...student, present: true }))); // Reset to all present if needed
        } finally {
             // setIsLoading(false); // Turn off OCR loading state
        }
    };
    // ***** END OF MODIFIED FUNCTION *****


    // --- Audio transcription functions (unchanged logic, assumes audio lists PRESENT students) ---
    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
        }
    };

    const transcribeAudio = async () => {
        if (!audioFile) {
            alert('Please upload an audio file first.');
            return;
        }

        setIsTranscribing(true);
        setTranscriptionError(null);
        setTranscriptionText('');

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await fetch('http://localhost:4000/api/gemini-transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data && data.transcript) {
                setTranscriptionText(data.transcript);
                const transcribedText = data.transcript.toLowerCase();

                // Update attendance based on transcription (mark matching rolls/names as present)
                // Assumption: Audio contains PRESENT students saying their roll number/name.
                const updatedAttendance = attendanceData.map(student => {
                    const studentNameLower = student.name.toLowerCase(); // Assuming student.name is the roll number
                    // If student's identifier is found in transcript, mark as PRESENT
                    // Note: This OVERWRITES previous status (e.g., if OCR marked absent, audio can mark present)
                    if (transcribedText.includes(studentNameLower)) {
                        return { ...student, present: true };
                    }
                    // If not found in transcript, keep their CURRENT status (could be present or absent from OCR/manual)
                    return student;
                });
                setAttendanceData(updatedAttendance);

            } else {
                setTranscriptionError('Transcription failed or no text found.');
                setTranscriptionText('');
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
            setTranscriptionError('An error occurred during audio transcription.');
            setTranscriptionText('');
        } finally {
            setIsTranscribing(false);
        }
    };

    // --- downloadTranscriptionAsPdf function remains the same ---
    const downloadTranscriptionAsPdf = () => {
        const pdf = new jsPDF();
        const text = transcriptionText;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const textWidth = pageWidth - 2 * margin;
        const lineHeight = 5; // Adjust line height as needed

        pdf.setFontSize(12);

        const splitText = pdf.splitTextToSize(text, textWidth);
        let yPosition = margin;

        splitText.forEach(line => {
            const lineSize = pdf.getTextDimensions(line, { fontSize: 12 }).h;

            if (yPosition + lineSize + margin > pageHeight) {
                pdf.addPage();
                yPosition = margin; // Reset Y position for new page
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight; // Increment Y position
        });

        pdf.save('transcription.pdf');
    };


    // --- Head Count functions (unchanged) ---
    const handleHeadCountImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHeadCountImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewHeadCountImage(reader.result);
            reader.readAsDataURL(file);
            setHeadCount(null);
            setHeadCountError('');
            setProcessedHeadCountImage(null);
        }
    };

    const removeHeadCountImage = () => {
        setHeadCountImage(null);
        setPreviewHeadCountImage(null);
        setHeadCount(null);
        setHeadCountError('');
        setProcessedHeadCountImage(null);
    };

    const countHeads = async () => {
        if (!headCountImage) {
            setHeadCountError('Please upload an image for head counting.');
            return;
        }

        setIsCountingHeads(true);
        setHeadCountError('');
        setHeadCount(null);
        setProcessedHeadCountImage(null);

        const formData = new FormData();
        formData.append('image', headCountImage);

        try {
            const response = await fetch('http://localhost:4000/api/headcount', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setHeadCount(data.headCount);
                // Backend needs to return outputImage for this to work
                // if (data.outputImage) {
                //     setProcessedHeadCountImage(`data:image/jpeg;base64,${data.outputImage}`);
                // }
            } else {
                const errorMessageText = await response.text();
                setHeadCountError(`Error counting heads: ${errorMessageText || response.statusText}`);
            }
        } catch (error) {
            console.error('Error counting heads:', error);
            setHeadCountError('An error occurred while counting heads.');
        } finally {
            setIsCountingHeads(false);
        }
    };

    // --- downloadAttendancePdf function remains the same ---
    const downloadAttendancePdf = () => {
        const pdf = new jsPDF();
        pdf.setFontSize(12);
        const margin = 10;
        let yPosition = margin;
        const lineHeight = 7; // Increased line height for readability

        const formattedDate = new Date(attendanceDate).toLocaleDateString();

        pdf.text(`Attendance for ${className}`, margin, yPosition);
        yPosition += 2 * lineHeight;
        pdf.text(`Date: ${formattedDate}`, margin, yPosition);
        if (attendanceTime) {
            yPosition += lineHeight;
            pdf.text(`Time: ${attendanceTime}`, margin, yPosition);
        }
        yPosition += 2 * lineHeight;

        pdf.text('Student Attendance:', margin, yPosition);
        yPosition += lineHeight * 1.5; // More space before list

        const pageHeight = pdf.internal.pageSize.getHeight();

        attendanceData.forEach(student => {
            if (yPosition + lineHeight > pageHeight - margin) { // Check before drawing text
                pdf.addPage();
                yPosition = margin; // Reset Y position for new page
                 pdf.text('Student Attendance (continued):', margin, yPosition); // Optional header for continued page
                 yPosition += lineHeight * 1.5;
            }
            pdf.text(`- ${student.name}: ${student.present ? 'Present' : 'Absent'}`, margin + 5, yPosition); // Indent list items slightly
            yPosition += lineHeight;
        });

        pdf.save(`attendance_${className.replace(/\s+/g, '_')}_${attendanceDate}.pdf`);
    };

    // --- saveAttendance function remains the same ---
    const saveAttendance = async () => {
        setIsLoading(true);
        setErrorMessage('');

        const presentStudents = attendanceData
            .filter(student => student.present)
            .map(student => student.studentId.toString()); // API likely expects string IDs without padding

        const token = localStorage.getItem('token');
        if (!token) {
             setErrorMessage('Authentication error: No token found. Please log in again.');
             setIsLoading(false);
             return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/auth/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subject: className,
                    date: attendanceDate,
                    time: attendanceTime,
                    present_students: presentStudents,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Attendance saved successfully!');
                // Optionally clear or navigate
            } else {
                 setErrorMessage(data.message || `Failed to save attendance. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            setErrorMessage(`An error occurred while saving attendance: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- fetchAttendance function remains the same ---
     const fetchAttendance = async () => {
        // Add loading state for fetching
        setIsLoading(true); // Reuse the main loading state or add a new one
        setErrorMessage(''); // Clear previous errors
        setRetrievedAttendance(null); // Clear previous results

        try {
            // Ensure date is selected
            if (!attendanceDate) {
                alert('Please select a date to view saved attendance.');
                setIsLoading(false);
                return;
            }
            const response = await fetch(`http://localhost:4000/api/attendance/${encodeURIComponent(className)}/${encodeURIComponent(attendanceDate)}`);

             if (response.status === 404) {
                alert(`No attendance record found for ${className} on ${new Date(attendanceDate).toLocaleDateString()}.`);
                setIsLoading(false);
                return; // Exit function, no data to process
            }

            if (response.ok) {
                const data = await response.json();
                // Ensure data structure is as expected
                if (data && data.presentStudents && Array.isArray(data.presentStudents)) {
                   setRetrievedAttendance(data);
                   // Optionally update the current marking list based on fetched data
                   // const fetchedPresentIds = data.presentStudents.map(id => parseInt(id, 10)); // Assuming IDs are numeric in DB
                   // const updatedAttendance = attendanceData.map(student => ({
                   //      ...student,
                   //      present: fetchedPresentIds.includes(student.studentId)
                   // }));
                   // setAttendanceData(updatedAttendance); // Uncomment to sync UI with fetched data
                } else {
                    console.error("Fetched data format is incorrect:", data);
                    alert('Received invalid data format when fetching attendance.');
                }

            } else {
                const errorData = await response.json().catch(() => ({ message: response.statusText })); // Try to parse error JSON
                alert(`Failed to fetch attendance: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            alert(`An error occurred while fetching attendance: ${error.message}`);
        } finally {
            setIsLoading(false); // Turn off loading state
        }
    };


    // --- displayRetrievedAttendance function remains the same ---
    const displayRetrievedAttendance = () => {
        if (!retrievedAttendance) return null;

        // Ensure presentStudents is an array before mapping
        const presentStudentsList = Array.isArray(retrievedAttendance.presentStudents)
            ? retrievedAttendance.presentStudents
            : [];

        return (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                    Saved Attendance Record
                </h3>
                 <p className="text-gray-700 mb-1"><span className="font-semibold">Subject:</span> {retrievedAttendance.subject}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Date:</span> {new Date(retrievedAttendance.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-3"><span className="font-semibold">Time:</span> {retrievedAttendance.time}</p>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Present Students ({presentStudentsList.length}):</h4>
                 {presentStudentsList.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-1 max-h-48 overflow-y-auto bg-white p-3 rounded border">
                        {presentStudentsList.map(studentId => (
                            <li key={studentId} className="text-gray-700">{studentId}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic ml-6">No students were marked present on this record.</p>
                )}
            </div>
        );
    };

    // --- JSX Structure remains largely the same ---
    // Minor tweaks for better layout/feedback can be added if needed
    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen"> {/* Added background color */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{className}</h2>
                     <p className="text-gray-600 text-lg">Mark Attendance / Use Tools</p>
                </div>
                <button
                    onClick={handleGoBack}
                    className="mt-4 md:mt-0 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out" // Adjusted style
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Date and Time Inputs */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"> {/* Added border */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attendance-date">Date</label> {/* Added htmlFor */}
                        <input
                            id="attendance-date" // Added id
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" // Added focus style
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attendance-time">Time</label> {/* Added htmlFor */}
                        <input
                             id="attendance-time" // Added id
                            type="time"
                            value={attendanceTime}
                            onChange={(e) => setAttendanceTime(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" // Added focus style
                        />
                    </div>
                </div>
            </div>

            {/* Tools Section - OCR, Audio, Headcount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* OCR Section */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Added border */}
                    <h3 className="text-xl font-semibold text-indigo-700 mb-4">1. OCR (Absent List)</h3> {/* Updated title */}
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ocr-image-upload">Upload Absent List Image</label> {/* Added htmlFor */}
                    <input
                        id="ocr-image-upload" // Added id
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-3" // Tailwind styled input
                    />
                    {previewImage && (
                        <div className="mt-4 relative">
                             <img src={previewImage} alt="Uploaded preview" className="h-32 object-contain rounded shadow-sm border border-gray-300" />
                             <button
                                onClick={removeImage}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                                title="Remove Image" // Added title for accessibility
                             >
                                 {/* Simple X icon using text or SVG */}
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                        </div>
                    )}
                    <button
                        onClick={extractRollNumbersFromImage}
                         className={`mt-4 w-full font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm ${!classImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-700 text-white focus:ring-purple-400'}`}
                        disabled={!classImage}
                    >
                        Extract Rolls & Mark Absent
                    </button>
                     {/* Optional: Display extracted rolls (kept commented) */}
                </div>

                {/* Audio Transcription Section */}
                 <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Added border */}
                     <h3 className="text-xl font-semibold text-indigo-700 mb-4">2. Audio (Present List)</h3> {/* Updated title */}
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audio-upload">Upload Audio (Present)</label> {/* Added htmlFor */}
                    <input
                        id="audio-upload" // Added id
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3" // Tailwind styled input
                    />
                     {audioFile && <p className="text-xs text-gray-500 mb-3">Selected: {audioFile.name}</p>} {/* Show selected file name */}
                    <button
                        onClick={transcribeAudio}
                         className={`mt-1 w-full font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm ${isTranscribing || !audioFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-400'}`}
                        disabled={isTranscribing || !audioFile}
                    >
                        {isTranscribing ? 'Transcribing...' : 'Transcribe & Mark Present'}
                    </button>
                    {transcriptionError && <p className="mt-2 text-red-600 text-sm">{transcriptionError}</p>}
                    {transcriptionText && (
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="transcription-output">Transcription:</label>
                            <textarea
                                id="transcription-output" // Added id
                                value={transcriptionText}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 text-sm bg-gray-50" // Adjusted style
                            />
                            {/* Download Transcription PDF button (optional) */}
                            <button
                                onClick={downloadTranscriptionAsPdf}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                Download Transcription as PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Head Count Section */}
                 <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Added border */}
                     <h3 className="text-xl font-semibold text-indigo-700 mb-4">3. Head Count</h3>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="headcount-image-upload">Upload Class Image</label> {/* Added htmlFor */}
                    <input
                         id="headcount-image-upload" // Added id
                        type="file"
                        accept="image/*"
                        onChange={handleHeadCountImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 mb-3" // Tailwind styled input
                    />
                    {previewHeadCountImage && (
                        <div className="mt-4 relative">
                            <img src={previewHeadCountImage} alt="Head Count Preview" className="h-32 object-contain rounded shadow-sm border border-gray-300" />
                             <button
                                onClick={removeHeadCountImage}
                                 className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                                title="Remove Image" // Added title
                            >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                        </div>
                    )}
                    <button
                        onClick={countHeads}
                         className={`mt-4 w-full font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm ${isCountingHeads || !headCountImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-700 text-black focus:ring-yellow-400'}`} // Adjusted style for yellow
                        disabled={isCountingHeads || !headCountImage}
                    >
                        {isCountingHeads ? 'Counting...' : 'Count Heads'}
                    </button>
                    {headCount !== null && <p className="mt-2 text-green-700 text-sm font-semibold">Detected: {headCount} heads</p>}
                    {headCountError && <p className="mt-2 text-red-600 text-sm">{headCountError}</p>}
                     {/* Processed image display (requires backend support) */}
                </div>
            </div>

            {/* Attendance Marking Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"> {/* Added border */}
                 <h3 className="text-xl font-semibold text-indigo-700 mb-4">4. Manual Adjustment & Review</h3>
                 <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 max-h-96 overflow-y-auto"> {/* Added max height and scroll */}
                    <table className="min-w-full leading-normal">
                        <thead className="sticky top-0 bg-gray-100 z-10"> {/* Sticky header */}
                            <tr className="text-gray-600 uppercase text-sm font-semibold">
                                <th className="py-3 px-6 text-left">Roll Number</th>
                                <th className="py-3 px-6 text-center">Present</th>
                            </tr>
                        </thead>
                         <tbody className="text-gray-600 text-sm">
                            {attendanceData.length > 0 ? attendanceData.map((student, index) => ( // Added index for alternating bg
                                <tr key={student.studentId} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}> {/* Alternating rows + hover */}
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                                    <td className="py-3 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={student.present}
                                            onChange={() => toggleAttendance(student.studentId)}
                                            className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" // Added cursor pointer
                                        />
                                    </td>
                                </tr>
                            )) : (
                                 <tr>
                                    <td colSpan="2" className="py-6 px-6 text-center text-gray-500">
                                        No student data loaded or class list is empty.
                                    </td>
                                 </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200"> {/* Added border */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4"> {/* Adjusted layout */}
                    {/* Left Side Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"> {/* Adjusted wrapping */}
                        <button
                            onClick={fetchAttendance}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm" // Adjusted style
                        >
                            View Saved (Selected Date)
                        </button>
                       {/* Optional Tool PDF Downloads - kept commented */}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"> {/* Adjusted wrapping */}
                         <button
                            onClick={downloadAttendancePdf}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm" // Adjusted style
                        >
                            Download Current List PDF
                        </button>
                        <button
                            onClick={saveAttendance}
                             className={`font-bold py-2 px-5 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-800 text-white focus:ring-indigo-500'}`} // Adjusted style
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Current List'}
                        </button>
                    </div>
                </div>
                 {errorMessage && <p className="mt-4 text-center text-red-600 text-sm font-medium bg-red-100 p-2 rounded">{errorMessage}</p>} {/* Improved error display */}
            </div>


             {/* Display Retrieved Attendance */}
            {retrievedAttendance && displayRetrievedAttendance()} {/* Rendered after actions */}

        </div>
    );
};

export default AttendancePage;