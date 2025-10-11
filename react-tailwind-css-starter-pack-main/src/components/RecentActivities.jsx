import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentActivity = () => {
    // ... (RecentActivity component code from your original file)
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalRecords: 0,
        recentCount: 0,
        subjectCounts: {}
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentAttendance = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Fetch recent attendance records
                const response = await fetch('http://localhost:4000/api/auth/recent', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recent attendance');
                }

                const data = await response.json();
                setRecentAttendance(data.recentAttendance);

                // Fetch attendance statistics
                const statsResponse = await fetch('http://localhost:4000/api/auth/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!statsResponse.ok) {
                    throw new Error('Failed to fetch attendance statistics');
                }

                const statsData = await statsResponse.json();
                setStats(statsData);

            } catch (err) {
                console.error('Error fetching recent attendance:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentAttendance();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleRecordClick = (record) => {
        // Navigate to attendance detail page with record data
        navigate('/attendance-detail', {
            state: {
                attendanceRecord: record
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Activities</h3>
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Activities</h3>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Activities</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium">Total Attendance Records</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.totalRecords}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600 font-medium">Last 30 Days</p>
                    <p className="text-2xl font-bold text-green-800">{stats.recentCount}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-600 font-medium">Most Active Subject</p>
                    <p className="text-2xl font-bold text-purple-800">
                        {Object.entries(stats.subjectCounts).length > 0
                            ? Object.entries(stats.subjectCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                            : 'None'}
                    </p>
                </div>
            </div>

            <h4 className="text-lg font-medium text-gray-700 mb-3">Recent Attendance Marked</h4>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
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
                        {recentAttendance.length > 0 ? (
                            recentAttendance.map((record, index) => (
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
                                        {record.present_roll_numbers ? record.present_roll_numbers.length : 0} students
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No recent attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-right">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    View All Records →
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;