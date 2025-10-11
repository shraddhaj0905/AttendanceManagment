import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AttendanceDetail = () => {
    // ... (AttendanceDetail component code from your original file)
    const location = useLocation();
    const navigate = useNavigate();
    const [attendanceRecord, setAttendanceRecord] = useState(null);
    const [absentRollNumbers, setAbsentRollNumbers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAbsentees = async () => {
            if (!location.state?.attendanceRecord) {
                setError("No attendance record provided");
                return;
            }

            const record = location.state.attendanceRecord;
            setAttendanceRecord(record);

            setIsLoading(true);
            try {
                // Assuming your API has an endpoint to fetch absent roll numbers
                // or to fetch all students so we can calculate absentees
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Option 1: API directly provides absent roll numbers
                const response = await fetch(
                    `http://localhost:4000/api/auth/absentees?subject=${encodeURIComponent(record.subject)}&date=${encodeURIComponent(record.date)}&time=${encodeURIComponent(record.time)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch absent roll numbers');
                }
                const data = await response.json();
                setAbsentRollNumbers(data.absentRollNumbers);

            } catch (err) {
                console.error('Error fetching attendance details:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAbsentees();
    }, [location.state]);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Attendance Details</h3>
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error || !attendanceRecord) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Attendance Details</h3>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error || "No attendance record found"}</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <button
                onClick={handleGoBack}
                className="mb-4 text-indigo-600 hover:text-indigo-900 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Recent Activities
            </button>

            <h2 className="text-2xl font-bold text-indigo-800 mb-6">Attendance Details</h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="text-lg font-medium text-gray-900">
                            <span className="px-2 py-1 inline-flex text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {attendanceRecord.subject}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="text-lg font-medium text-gray-900">{formatDate(attendanceRecord.date)}</p>
                        <p className="text-md text-gray-600">{attendanceRecord.time}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Present Students
                    </h3>

                    {attendanceRecord.present_roll_numbers && attendanceRecord.present_roll_numbers.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {attendanceRecord.present_roll_numbers.map((rollNumber, index) => (
                                <div key={index} className="bg-white py-2 px-3 rounded border border-green-200 text-green-800 text-sm">
                                    {rollNumber}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No students marked present</p>
                    )}
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Absent Students
                    </h3>

                    {absentRollNumbers && absentRollNumbers.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {absentRollNumbers.map((rollNumber, index) => (
                                <div key={index} className="bg-white py-2 px-3 rounded border border-red-200 text-red-800 text-sm">
                                    {rollNumber}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No students marked absent</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetail;