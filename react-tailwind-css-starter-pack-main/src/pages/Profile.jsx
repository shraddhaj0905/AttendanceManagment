import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import  Badge from "../components/ui/badge";
import { 
  ArrowLeft,
  Mail,
  BookOpen, 
  Award, 
  Clock, 
  User,
  Calendar,
  GraduationCap
} from "lucide-react";
import  Progress  from "../components/ui/Progress";

const Profile = () => {
  const navigate = useNavigate();
  
  // Mock student data (in a real app, this would come from an API or context)
  const studentData = {
    name: "John Doe",
    rollNumber: "R12345",
    email: "john.doe@example.com",
    course: "Computer Science",
    semester: "4th Semester",
    profileImage: "https://i.pravatar.cc/150?img=12",
    joinDate: "August 15, 2022",
    attendancePercentage: 85,
    achievements: [
      "Dean's List - Fall 2022",
      "Programming Contest Winner",
      "Perfect Attendance - Spring 2023"
    ]
  };
  
  const handleBack = () => {
    navigate('/student-dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Student Profile
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border border-white bg-white">
            <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
            <div className="relative px-6">
              <img 
                src={studentData.profileImage} 
                alt={studentData.name}
                className="h-24 w-24 rounded-full border-4 border-white absolute -top-12 left-6 shadow-md"
              />
              <div className="pt-16 pb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {studentData.name}
                </h2>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="font-semibold">{studentData.rollNumber}</Badge>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{studentData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium">{studentData.course}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Semester</p>
                      <p className="font-medium">{studentData.semester}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">{studentData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border border-white bg-white">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Attendance</span>
                  <span className={`text-sm font-bold ${
                    studentData.attendancePercentage < 75 ? 'text-red-500' : 
                    studentData.attendancePercentage < 85 ? 'text-orange-500' : 'text-green-500'
                  }`}>
                    {studentData.attendancePercentage}%
                  </span>
                </div>
                <Progress 
                  value={studentData.attendancePercentage} 
                  className={`h-2 ${
                    studentData.attendancePercentage < 75 ? 'bg-red-100' : 
                    studentData.attendancePercentage < 85 ? 'bg-orange-100' : 'bg-green-100'
                  }`} 
                />
                <div 
                  className={`mt-4 text-sm p-3 rounded-lg ${
                    studentData.attendancePercentage < 75 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : studentData.attendancePercentage < 85 
                        ? 'bg-orange-50 text-orange-700 border border-orange-100' 
                        : 'bg-green-50 text-green-700 border border-green-100'
                  }`}
                >
                  {studentData.attendancePercentage < 75 
                    ? 'Your attendance is below the required minimum of 75%. Please improve your attendance.' 
                    : studentData.attendancePercentage < 85 
                      ? 'Your attendance is satisfactory but could be improved.' 
                      : 'Excellent attendance! Keep up the good work.'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border border-white bg-white">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {studentData.achievements.length > 0 ? (
                  <ul className="space-y-3">
                    {studentData.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-6">No achievements yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Define the Trophy icon since it's not imported at the top
const Trophy = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default Profile;