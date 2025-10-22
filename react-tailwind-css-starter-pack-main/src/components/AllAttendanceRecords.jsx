



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AllAttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAllRecords = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token not found');


                const response = await fetch('http://localhost:4000/api/auth/recent', {
                    headers: { Authorization: `Bearer ${token}` },
                });


                if (!response.ok) throw new Error('Failed to fetch attendance records');


                const data = await response.json();
                // Sort by date & time descending
                const sorted = data.recentAttendance.sort(
                    (a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
                );
                setRecords(sorted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };


        fetchAllRecords();
    }, []);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const handleRecordClick = (record) => {
        navigate('/attendance-detail', { state: { attendanceRecord: record } });
    };


    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Attendance Records</h2>
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Attendance Records</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Attendance Records</h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium">Total Records</p>
                        <p className="text-2xl font-bold text-blue-800">{records.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-sm text-green-600 font-medium">Most Recent</p>
                        <p className="text-2xl font-bold text-green-800">
                            {records.length > 0 ? formatDate(records[0].date) : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-600 font-medium">Subjects</p>
                        <p className="text-2xl font-bold text-purple-800">
                            {records.length > 0 ? [...new Set(records.map(r => r.subject))].join(', ') : 'N/A'}
                        </p>
                    </div>
                </div>


                <div className="overflow-hidden rounded-lg shadow-md bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Students Present
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.length > 0 ? (
                                records.map((record, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRecordClick(record)}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="font-medium">{formatDate(record.date)}</div>
                                            <div className="text-gray-500">{record.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {record.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {record.present_roll_numbers.length} students
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-500 py-4">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default AllAttendanceRecords;



