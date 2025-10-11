import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from "../components/ui/calendar";
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
import  Badge  from "../components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft,
  Clock, 
  BookOpen
} from "lucide-react";



// const CheckAttendance = () => {
//   const navigate = useNavigate();
//   const [date, setDate] = useState(new Date());
  
//   const handleCheck = () => {
//     // Format date as ISO string and navigate to results page
//     navigate(`/attendance-results/${date.toISOString()}`);
//   };
  
//   const handleBack = () => {
//     navigate('/');
//   };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Button 
//             variant="ghost" 
//             className="mr-4"
//             onClick={handleBack}
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//             Check Attendance
//           </h1>
//         </div>
//       </header>
      
//       <main className="container mx-auto px-4 py-8 flex justify-center">
//         <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm border border-white w-full max-w-md">
//           <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
//             <CardTitle className="flex items-center gap-2 text-gray-800">
//               <CalendarIcon className="h-5 w-5 text-indigo-600" />
//               <span>Select Date</span>
//             </CardTitle>
//             <CardDescription>Choose a date to check your attendance</CardDescription>
//           </CardHeader>
//           <CardContent className="p-6">
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={(newDate) => {
//                 if (newDate) {
//                   setDate(newDate);
//                 }
//               }}
//               className="rounded-md border border-gray-100 p-3 hover:shadow-inner transition-shadow mx-auto max-w-sm"
//             />
            
//             <div className="mt-6">
//               <Button 
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
//                 onClick={handleCheck}
//               >
//                 Check Attendance
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default CheckAttendance;

const CheckAttendance = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    
    const handleCheck = () => {
      // Format date as ISO string and navigate to results page
      navigate(`/attendance-results/${date.toISOString()}`);
    };
    
    const handleBack = () => {
      navigate('/');
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4 hover:bg-indigo-50 transition-colors"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Check Attendance
            </h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-white/80 w-full max-w-md animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-300/10">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
                <span>Select Date</span>
              </CardTitle>
              <CardDescription>Choose a date to check your attendance</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                  }
                }}
                className="rounded-md border border-gray-100 p-3 hover:shadow-inner transition-shadow mx-auto max-w-sm bg-white"
              />
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={handleCheck}
                >
                  Check Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  };
  
  export default CheckAttendance;
  