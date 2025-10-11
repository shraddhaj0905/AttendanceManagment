import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from "./ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import Badge from "./ui/badge";
import {
    CalendarDays,
    UserRound,
    LogOut,
    Bell,
    BookOpen,
    Award,
    Clock,
    ArrowUpRight
} from "lucide-react";

const StudentProfile = ({ student, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl transform transition-all animate-scale-in">
                <div className="relative">
                    <div className="h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/40 transition-colors text-white text-xl font-bold"
                    >
                        ×
                    </button>
                    <div className="flex justify-center">
                        <img
                            src={student.profileImage}
                            alt={student.name}
                            className="h-28 w-28 rounded-full border-4 border-white absolute -bottom-14 shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                <div className="pt-16 pb-8 px-6">
                    <h2 className="text-2xl font-bold text-center mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{student.name}</h2>
                    <p className="text-gray-500 text-center mb-6 flex items-center justify-center gap-2">
                        <Badge variant="outline" className="font-semibold">{student.rollNumber}</Badge>
                    </p>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-medium">{student.email}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Course</p>
                            <p className="font-medium flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                                {student.course}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Semester</p>
                            <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                                {student.semester}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Attendance</p>
                            <p className="font-medium flex items-center">
                                <Award className="h-4 w-4 mr-2 text-purple-500" />
                                Good Standing (85%) {/* This should be dynamic */}
                            </p>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AttendanceProgressCircle = ({ percentage }) => {
    let color = "bg-green-500";
    if (percentage < 75) {
        color = "bg-red-500";
    } else if (percentage < 85) {
        color = "bg-orange-500";
    }

    return (
        <div className="relative w-48 h-48 mx-auto">
            <div className="w-full h-full rounded-full bg-gray-200"></div>
            <div
                className={`absolute top-0 left-0 w-full h-full rounded-full ${color} transition-all duration-1000 ease-out`}
                style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${percentage >= 50 ? '100% 0%' : `${50 + (percentage / 100 * 360)}% 0%`}, ${
                        percentage >= 25 ? '100% 0%, 100% 100%' : ''
                    }${
                        percentage >= 50 ? ', 0% 100%' : ''
                    }${
                        percentage >= 75 ? ', 0% 0%' : ''
                    }${
                        percentage >= 100 ? ', 50% 0%' : ''
                    })`
                }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full flex items-center justify-center">
                <div className="bg-white rounded-full w-36 h-36 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-4xl font-bold">{percentage}%</span>
                    <span className="text-sm text-gray-500">Attendance</span>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, icon, color }) => {
    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${color} flex items-center gap-4 group hover:-translate-y-1`}>
            <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')} ${color.replace('border-', 'text-')}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <ArrowUpRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
        </div>
    );
};

const StudentDashboard = () => {
   
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [totalClasses, setTotalClasses] = useState(0);
    const [presentClasses, setPresentClasses] = useState(0);
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [studentData, setStudentProfile] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateAttendanceData, setDateAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

const fetchStudentData = async () => {
  try {
    const token = localStorage.getItem("token");
    const roll_no = localStorage.getItem("roll_no");

    // Fetch student profile data using the roll number
    const studentRes = await axios.get(`http://localhost:4000/api/student/rollno/${roll_no}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Store student profile data
    const studentData = studentRes.data;

    // Fetch attendance stats
    const [totalRes, presentRes] = await Promise.all([
      axios.get(`http://localhost:4000/api/student/attendance/total/${roll_no}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:4000/api/student/attendance/present/${roll_no}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    // Fetch recent attendance (optional)
    console.log(roll_no);
    const recentAttendanceRes = await axios.get(`http://localhost:4000/api/student/attendance/recent/roll_no`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Student Data:", studentData);
    console.log("Total Classes:", totalRes.data.totalClasses);
    console.log("Present Classes:", presentRes.data.presentCount);
    console.log("Recent Attendance:", recentAttendanceRes.data);

    // Calculate attendance percentage
    const percentage = totalRes.data.totalClasses > 0 
      ? Math.round((presentRes.data.presentCount / totalRes.data.totalClasses) * 100) 
      : 0;
    console.log("Calculated Attendance Percentage:", percentage);

    // Store the data in your state or wherever needed
    setStudentProfile(studentData);
    setTotalClasses(totalRes.data.totalClasses);
    setPresentClasses(presentRes.data.presentCount);
    setAttendancePercentage(percentage);
    setRecentAttendance(recentAttendanceRes.data.recentAttendance || []);
    console.log(recentAttendance);

  } catch (error) {
    console.error("Error fetching student data and attendance:", error);
  }
};

// UseEffect to call fetchStudentData once component mounts
useEffect(() => {
  fetchStudentData();
}, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roll_no");
        navigate('/');
    };

    const handleViewProfile = () => {
        setShowProfile(true);
    };

    const handleCloseProfile = () => {
        setShowProfile(false);
    };

    const handleCheckAttendance = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const roll_no = localStorage.getItem("roll_no");
    
            console.log("Selected Date:", selectedDate);
            
            // Format date if needed (selected date should be in YYYY-MM-DD format)
            // If your API expects a different format, convert it here
            
            const res = await axios.get(
                `http://localhost:4000/api/student/attendance/by-date`,
                {
                    params: {
                        
                        date: selectedDate
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Filtered attendance:", res.data);
            
            setRecentAttendance(res.data.recentAttendance||[]);
            
            
        } catch (error) {
            console.error("Error fetching attendance by date:", error);
            setDateAttendanceData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Student Portal</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                            onClick={handleViewProfile}
                        >
                            <img
                                src={studentData.profileImage || "/api/placeholder/32/32"}
                                alt={studentData.name || "Profile"}
                                className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                            />
                            <span className="font-medium">{studentData.name || "Student"}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Overview</h2>
                        <AttendanceProgressCircle percentage={attendancePercentage} />
                        <div className="mt-4 text-center">
                            <p className={`text-sm font-medium ${
                                attendancePercentage < 75 ? 'text-red-500' :
                                    attendancePercentage < 85 ? 'text-orange-500' : 'text-green-500'
                            }`}>
                                {attendancePercentage < 75 ? 'Needs Improvement' :
                                    attendancePercentage < 85 ? 'Satisfactory' : 'Excellent'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Your current attendance record.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DashboardCard
                            title="Total Classes"
                            value={totalClasses}
                            icon={<BookOpen className="h-6 w-6" />}
                            color="border-purple-600"
                        />
                        <DashboardCard
                            title="Classes Attended"
                            value={presentClasses}
                            icon={<Clock className="h-6 w-6" />}
                            color="border-blue-600"
                        />

                        <Card className="md:col-span-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800 font-semibold">
                              <CalendarDays className="h-5 w-5 text-indigo-600" />
                              Check Attendance
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                              View attendance by date.
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="p-4">
                            {/* Date input */}
                            <input
                              type="date"
                              className="border rounded px-3 py-2 w-full mb-4"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />

                            {/* Check Attendance Button */}
                            <Button
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
                              onClick={handleCheckAttendance}
                              disabled={isLoading}
                            >
                              {isLoading ? "Loading..." : "Check Attendance by Date"}
                            </Button>

                            {/* Render Attendance Results */}
                            <div className="mt-4">
                              {dateAttendanceData.length > 0 ? (
                                <ul className="space-y-2">
                                  {dateAttendanceData.map((entry, index) => (
                                    <li
                                      key={index}
                                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm"
                                    >
                                      <p><strong>Subject:</strong> {entry.subject}</p>
                                      <p>
                                        <strong>Status:</strong> 
                                        <span className={entry.status === 'Present' ? 'text-green-600' : 'text-red-600'}>
                                          {entry.status}
                                        </span>
                                      </p>
                                      <p><strong>Time:</strong> {entry.time}</p>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 mt-2 text-center py-2">
                                  {isLoading ? "Loading attendance data..." : "No attendance found for selected date."}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-xl">
                    <CardHeader className="py-4">
                        <CardTitle className="text-lg font-semibold text-gray-800">Recent Attendance</CardTitle>
                        <CardDescription className="text-gray-500">Your attendance for the last 5 classes.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="rounded-md border border-gray-100 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-left">Date</TableHead>
                                        <TableHead className="px-4 py-3 text-left">Subject</TableHead>
                                        <TableHead className="px-4 py-3 text-left">Time</TableHead>
                                        <TableHead className="px-4 py-3 text-left">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Array.isArray(recentAttendance) && recentAttendance.length > 0 ? (
                                    recentAttendance.map((record, index) => (
                                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-4 py-3 font-medium">
                                          {new Date(record.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                          })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">{record.subject}</TableCell>
                                        <TableCell className="px-4 py-3">{record.time}</TableCell>
                                        <TableCell className="px-4 py-3">
                                          <Badge
                                            variant={record.status === 'Present' ? 'outline' : 'destructive'}
                                            className={`hover:scale-105 transition-transform ${
                                              record.status === 'Present'
                                                ? 'bg-green-500 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-red-500 text-red-700 border-red-200 hover:bg-red-100'
                                            }`}
                                          >
                                            {record.status}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                        No recent attendance records found.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {showProfile && (
                <StudentProfile
                    student={studentData}
                    onClose={handleCloseProfile}
                />
            )}
        </div>
    );
};

export default StudentDashboard;