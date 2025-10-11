import React from 'react';
import { Card, CardContent } from "./ui/card";

const StudentProfile = ({ student }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={student.profileImage || "https://i.pravatar.cc/150?img=12"} 
            alt={student.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-semibold mb-4">{student.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{student.rollNumber}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-medium">{student.course}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Semester</p>
            <p className="font-medium">{student.semester}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;