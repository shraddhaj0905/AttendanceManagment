import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AttendancePage from './AttendancePage';
import RecentActivity from './RecentActivities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AttendanceGraph = ({ data, title, dataKey, color }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-md font-semibold text-gray-800 mb-2">{title}</h4>
        <BarChart width={300} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey={dataKey} fill={color} name="Percentage" />
        </BarChart>
    </div>
);

const Schedule = () => {
    const [activeSubject, setActiveSubject] = useState('DBMS');

    const DBMSSchedule = [
        { day: 'Mon', time: '10:00 AM - 11:00 AM' },
        { day: 'Tue', time: '11:15 AM - 12:15 PM' },
        { day: 'Wed', time: '10:00 AM - 11:00 AM' },
        { day: 'Thu', time: '11:15 AM - 12:15 PM' },
        { day: 'Fri', time: '09:00 AM - 10:00 AM' },
    ];

    const OOPSchedule = [
        { day: 'Mon', time: '01:00 PM - 02:00 PM' },
        { day: 'Wed', time: '01:00 PM - 02:00 PM' },
        { day: 'Thu', time: '02:15 PM - 03:15 PM' },
        { day: 'Fri', time: '10:15 AM - 11:15 AM' },
    ];

    const currentSchedule = activeSubject === 'DBMS' ? DBMSSchedule : OOPSchedule;
    const subjects = ['DBMS', 'OOP'];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Week's Schedule</h3>
            <div className="flex space-x-2 mb-4">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        onClick={() => setActiveSubject(subject)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            activeSubject === subject ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {subject}
                    </button>
                ))}
            </div>
            <ul>
                {currentSchedule.map((item, index) => (
                    <li key={index} className="py-2">
                        <span className="font-semibold">{item.day}:</span> {item.time}
                    </li>
                ))}
                {currentSchedule.length === 0 && <p className="text-gray-500">No lectures scheduled for next week.</p>}
            </ul>
        </div>
    );
};

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [activeStatTab, setActiveStatTab] = useState('week');
    const navigate = useNavigate();

    const weeklyData = [
        { name: 'Mon', presentPercentage: 80 },
        { name: 'Tue', presentPercentage: 88 },
        { name: 'Wed', presentPercentage: 92 },
        { name: 'Thu', presentPercentage: 85 },
        { name: 'Fri', presentPercentage: 90 },
    ];

    const monthlyData = [
        { name: 'Week 1', presentPercentage: 82 },
        { name: 'Week 2', presentPercentage: 89 },
        { name: 'Week 3', presentPercentage: 91 },
        { name: 'Week 4', presentPercentage: 87 },
    ];

    const overallWeekly = weeklyData.reduce((sum, day) => sum + day.presentPercentage, 0) / weeklyData.length;
    const overallMonthly = monthlyData.reduce((sum, week) => sum + week.presentPercentage, 0) / monthlyData.length;

    useEffect(() => {
        const fetchTeacherData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in first.');
                return;
            }

            try {
                // Fetch subjects
                const subjectsResponse = await fetch('http://localhost:4000/api/auth/subjects', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (subjectsResponse.ok) {
                    const subjectsData = await subjectsResponse.json();
                    setClasses(
                        subjectsData.subjects.map((subject, index) => ({
                            id: index + 1,
                            name: subject,
                            totalStudents: 87, // Replace with actual student count if available
                            attendanceRate: 82, // Replace with actual attendance rate if available
                        }))
                    );
                } else {
                    const errorData = await subjectsResponse.json();
                    alert(errorData.message || 'Failed to fetch teacher data.');
                }

                // Fetch teacher profile
                const profileResponse = await fetch('http://localhost:4000/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setTeacherName(profileData.name || 'Teacher');
                }
            } catch (error) {
                console.error('Error fetching teacher data:', error);
                alert('An error occurred while fetching teacher data.');
            }
        };

        fetchTeacherData();
    }, []);

    const averageAttendance =
        classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + cls.attendanceRate, 0) / classes.length) : 0;

    const handleMarkAttendance = (className) => {
        navigate(`/attendance/${className}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                <Route path="/" element={
                    <div className="p-8">
                        <header className="mb-8">
                            <h2 className="text-3xl font-semibold text-gray-800">Welcome, {teacherName}!</h2>
                            <p className="text-gray-600">Here's your teaching dashboard overview</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content - Class Cards and Stats */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {classes.map(cls => (
                                        <div key={cls.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{cls.name}</h3>
                                                <p className="text-gray-700 mb-1">
                                                    <span className="font-semibold">Students:</span> {cls.totalStudents}
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-semibold">Attendance:</span> {cls.attendanceRate}%
                                                </p>
                                                <div className="mt-4 flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleMarkAttendance(cls.name)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        Attendance
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Average Attendance</h3>
                                        <div className="text-4xl font-bold text-purple-600">{averageAttendance}%</div>
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={() => setActiveStatTab('week')}
                                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                    activeStatTab === 'week' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Last Week
                                            </button>
                                            <button
                                                onClick={() => setActiveStatTab('month')}
                                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                    activeStatTab === 'month' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                Last Month
                                            </button>
                                        </div>
                                        {activeStatTab === 'week' && (
                                            <p className="text-gray-600 mt-2">
                                                <span className="font-semibold">Avg:</span> {overallWeekly.toFixed(2)}%
                                            </p>
                                        )}
                                        {activeStatTab === 'month' && (
                                            <p className="text-gray-600 mt-2">
                                                <span className="font-semibold">Avg:</span> {overallMonthly.toFixed(2)}%
                                            </p>
                                        )}
                                    </div>
                                    {activeStatTab === 'week' && (
                                        <AttendanceGraph data={weeklyData} title="Weekly Attendance" dataKey="presentPercentage" color="#8884d8" />
                                    )}
                                    {activeStatTab === 'month' && (
                                        <AttendanceGraph data={monthlyData} title="Monthly Attendance" dataKey="presentPercentage" color="#82ca9d" />
                                    )}
                                </div>

                                <div className="mt-8">
                                    <Schedule />
                                </div>
                            </div>

                            {/* Sidebar - Recent Activity */}
                            <div className="lg:col-span-1">
                                <RecentActivity />
                            </div>
                        </div>
                    </div>
                } />
                <Route path="/attendance/:className" element={<AttendancePage />} />
            </Routes>
        </div>
    );
};

export default TeacherDashboard;