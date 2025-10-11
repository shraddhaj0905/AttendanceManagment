import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const OcrTranscriptionPage = () => {
    const { className } = useParams();
    const navigate = useNavigate();
    
    // OCR State
    const [classImage, setClassImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [extractedRollNumbers, setExtractedRollNumbers] = useState([]);
    
    // Audio Transcription State
    const [audioFile, setAudioFile] = useState(null);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState(null);

    const handleGoBack = () => {
        navigate(`/attendance/${className}`);
    };

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
    };

    const extractRollNumbersFromImage = async () => {
        if (!classImage) {
            alert('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', classImage);

        try {
            const response = await fetch('http://localhost:4000/api/ocr/image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data && data.rollNos) {
                const extractedRollsFormatted = data.rollNos.map(roll => roll.toString().padStart(5, '0'));
                setExtractedRollNumbers(extractedRollsFormatted);
                
                // Save to localStorage to pass data back to AttendancePage
                localStorage.setItem('ocrExtractedRolls', JSON.stringify(extractedRollsFormatted));
                
                generateRollNumberPdf(extractedRollsFormatted);
            } else {
                alert('No roll numbers found or an error occurred.');
                setExtractedRollNumbers([]);
            }
        } catch (error) {
            console.error('There was an error:', error);
            alert('An error occurred while communicating with the server.');
            setExtractedRollNumbers([]);
        }
    };

    const generateRollNumberPdf = (extractedRolls) => {
        const pdf = new jsPDF();
        pdf.setFontSize(12);
        const margin = 10;
        let yPosition = margin;
        const lineHeight = 5;

        pdf.text(`Roll Number Analysis for ${className}`, margin, yPosition);
        yPosition += 2 * lineHeight;

        const expectedRolls = Array.from({ length: 87 }, (_, i) => 23201 + i).map(num => num.toString().padStart(5, '0'));
        const absentRolls = extractedRolls.map(roll => roll.toString().padStart(5, '0'));
        const presentRolls = expectedRolls.filter(roll => !absentRolls.includes(roll));

        pdf.text('Absent Roll Numbers (Detected in Image):', margin, yPosition);
        yPosition += lineHeight;
        absentRolls.forEach(roll => {
            if (yPosition + lineHeight + margin > pdf.internal.pageSize.getHeight()) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(`- ${roll}`, margin + 10, yPosition);
            yPosition += lineHeight;
        });

        yPosition += lineHeight;
        pdf.text('Present Roll Numbers (Not Detected in Image):', margin, yPosition);
        yPosition += lineHeight;
        presentRolls.forEach(roll => {
            if (yPosition + lineHeight + margin > pdf.internal.pageSize.getHeight()) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(`- ${roll}`, margin + 10, yPosition);
            yPosition += lineHeight;
        });

        pdf.save(`roll_number_analysis_${className.replace(/\s+/g, '_')}.pdf`);
    };

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
                
                // Create attendance data based on transcription
                const startRoll = 23201;
                const endRoll = 23287;
                const students = Array.from({ length: endRoll - startRoll + 1 }, (_, i) => {
                    const rollNumber = startRoll + i;
                    const studentId = rollNumber;
                    const name = rollNumber.toString().padStart(5, '0');
                    const nameLower = name.toLowerCase();
                    const present = nameLower.split(' ').some(part => transcribedText.includes(part));
                    return { studentId, name, present };
                });
                
                // Save to localStorage to pass data back to AttendancePage
                localStorage.setItem('transcriptionAttendance', JSON.stringify(students));
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

    const downloadTranscriptionAsPdf = () => {
        const pdf = new jsPDF();
        const text = transcriptionText;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const textWidth = pageWidth - 2 * margin;
        const lineHeight = 5;

        pdf.setFontSize(12);

        const splitText = pdf.splitTextToSize(text, textWidth);
        let yPosition = margin;

        splitText.forEach(line => {
            const lineSize = pdf.getTextDimensions(line, { fontSize: 12 }).h;

            if (yPosition + lineSize + margin > pageHeight) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        pdf.save('transcription.pdf');
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800">{className} - OCR & Audio Transcription</h2>
                    <p className="text-gray-600">Extract attendance data using OCR and audio transcription.</p>
                </div>
                <button
                    onClick={handleGoBack}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                    Back to Attendance
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* OCR Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">OCR Roll Number Extraction</h3>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Attendance Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {previewImage && (
                        <div className="mt-4">
                            <img src={previewImage} alt="Uploaded preview" className="h-48 object-contain rounded shadow-sm" />
                            <button
                                onClick={removeImage}
                                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                    <button
                        onClick={extractRollNumbersFromImage}
                        className="mt-6 bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                        disabled={!classImage}
                    >
                        Extract Roll Numbers
                    </button>
                    
                    {extractedRollNumbers.length > 0 && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-md">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">Extracted Roll Numbers:</h3>
                            <div className="max-h-60 overflow-y-auto">
                                <ul className="list-disc ml-6">
                                    {extractedRollNumbers.map((roll, idx) => (
                                        <li key={idx} className="text-gray-700">{roll}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => generateRollNumberPdf(extractedRollNumbers)}
                                className="mt-3 bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Download Roll Number Analysis PDF
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Audio Transcription Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">Audio Transcription</h3>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Audio for Transcription</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                        onClick={transcribeAudio}
                        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                        disabled={isTranscribing || !audioFile}
                    >
                        {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
                    </button>
                    {transcriptionError && <p className="mt-2 text-red-500">{transcriptionError}</p>}
                    {transcriptionText && (
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Transcription:</label>
                            <textarea
                                value={transcriptionText}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                            />
                            <button
                                onClick={downloadTranscriptionAsPdf}
                                className="mt-3 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                            >
                                Download Transcription as PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OcrTranscriptionPage;