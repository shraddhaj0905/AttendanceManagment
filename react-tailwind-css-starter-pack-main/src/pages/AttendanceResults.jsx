
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Badge from "../components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft,
  Clock, 
  BookOpen
} from "lucide-react";


// Dummy subjects for fallback data
const dummySubjects = [
  { subject: "Mathematics", time: "10:00 AM" },
  { subject: "Physics", time: "11:30 AM" },
  { subject: "Chemistry", time: "2:00 PM" },
  { subject: "Biology", time: "3:30 PM" },
  { subject: "English", time: "5:00 PM" },
];


// const AttendanceResults = () => {
//     const navigate = useNavigate();
  
//     // Dummy Attendance Data
//     const attendanceData = [
//       { subject: "Mathematics", time: "10:00 AM", status: "Present" },
//       { subject: "Physics", time: "11:30 AM", status: "Present" },
//       { subject: "Chemistry", time: "2:00 PM", status: "Absent" },
//       { subject: "Biology", time: "3:30 PM", status: "Present" },
//       { subject: "English", time: "5:00 PM", status: "Absent" },
//     ];
  
//     const handleBack = () => {
//       navigate('/check-attendance');
//     };
  
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center p-6">
        
//         {/* Navbar */}
//         <div className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-indigo-700">Attendance System</h1>
//         </div>
  
//         {/* Attendance Card */}
//         <Card className="w-full max-w-6xl p-10 bg-white shadow-2xl border border-gray-300 rounded-2xl">
//           <CardHeader className="pb-6">
//             <CardTitle className="text-gray-900 flex items-center gap-3 text-3xl font-bold">
//               <CalendarIcon className="h-7 w-7 text-indigo-600" />
//               Attendance Records
//             </CardTitle>
//             <CardDescription className="text-xl text-indigo-700 font-semibold">
//               Thursday, Apr 3, 2025
//             </CardDescription>
//           </CardHeader>
  
//           <CardContent>
//             <div className="rounded-xl border border-gray-300 overflow-hidden shadow-lg bg-gray-50">
//               <Table>
//                 <TableHeader className="bg-indigo-200">
//                   <TableRow>
//                     <TableHead className="text-indigo-900 font-bold text-xl">Subject</TableHead>
//                     <TableHead className="text-indigo-900 font-bold text-xl">Time</TableHead>
//                     <TableHead className="text-indigo-900 font-bold text-xl">Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {attendanceData.map((record, index) => (
//                     <TableRow key={index} className="hover:bg-indigo-100 transition-all text-xl">
//                       <TableCell className="font-semibold">
//                         <div className="flex items-center gap-3">
//                           <BookOpen className="h-6 w-6 text-indigo-500" />
//                           {record.subject}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <Clock className="h-6 w-6 text-purple-500" />
//                           {record.time}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge 
//                           className={`px-6 py-2 text-lg font-bold rounded-full ${
//                             record.status === 'Present' 
//                               ? 'bg-green-500 text-white border-green-700' 
//                               : 'bg-red-500 text-white border-red-700'
//                           }`}
//                         >
//                           {record.status}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
  
//             <div className="flex justify-center mt-8">
//               <Button 
//                 variant="outline" 
//                 className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 text-xl shadow-lg rounded-lg"
//                 onClick={handleBack}
//               >
//                 Go Back
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   };
  
//   export default AttendanceResults;
const AttendanceResults = () => {
    const navigate = useNavigate();
  
    // Dummy Attendance Data
    const attendanceData = [
      { subject: "Mathematics", time: "10:00 AM", status: "Present" },
      { subject: "Physics", time: "11:30 AM", status: "Present" },
      { subject: "Chemistry", time: "2:00 PM", status: "Absent" },
      { subject: "Biology", time: "3:30 PM", status: "Present" },
      { subject: "English", time: "5:00 PM", status: "Absent" },
    ];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center p-6">
        
        {/* Navbar */}
        <div className="w-full max-w-4xl bg-white shadow-lg py-3 px-6 flex items-center space-x-3 mb-8 rounded-lg">
          <Button variant="outline" className="bg-blue-600 text-white p-2 rounded-lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-purple-700">Attendance</h1>
        </div>
  
        {/* Larger & More Distinct Attendance Card */}
        <Card className="w-full max-w-4xl p-8 bg-white shadow-2xl border-2 border-indigo-300 rounded-2xl">
          <CardHeader className="pb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-xl -mx-8 -mt-8 px-8 pt-8 mb-6">
            <CardTitle className="text-gray-900 flex items-center gap-3 text-3xl font-bold">
              Attendance Records
            </CardTitle>
            <CardDescription className="text-lg text-indigo-700 font-semibold">
              Thursday, Apr 3, 2025
            </CardDescription>
          </CardHeader>
  
          <CardContent>
            {/* Attendance Table */}
            <div className="w-full overflow-hidden bg-gray-50 rounded-lg shadow-md border border-indigo-200">
              <Table className="w-full">
                <TableHeader className="bg-gradient-to-r from-indigo-300 to-purple-300">
                  <TableRow>
                    <TableHead className="text-indigo-900 font-bold text-lg py-4 px-6 w-1/3">Subject</TableHead>
                    <TableHead className="text-indigo-900 font-bold text-lg py-4 px-6 w-1/3">Time</TableHead>
                    <TableHead className="text-indigo-900 font-bold text-lg py-4 px-6 w-1/3">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record, index) => (
                    <TableRow key={index} className="hover:bg-indigo-100 transition-all text-lg">
                      <TableCell className="font-semibold py-4 px-6">{record.subject}</TableCell>
                      <TableCell className="py-4 px-6">{record.time}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge 
                          className={`px-5 py-2 text-lg font-bold rounded-full ${
                            record.status === 'Present' 
                              ? 'bg-green-600 text-white border-green-800 hover:bg-green-700' 
                              : 'bg-red-600 text-white border-red-800 hover:bg-red-700'
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default AttendanceResults;