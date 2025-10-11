import React from 'react';

const Step = ({ number, title, description, isTeacher = false }) => (
  <div className="flex items-start space-x-4">
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isTeacher ? 'bg-attendblue' : 'bg-attendpurple'} flex items-center justify-center text-white font-bold`}>
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, intuitive, and designed for both teachers and students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* For Teachers */}
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-attendblue">For Teachers</h3>
            <div className="space-y-8">
              <Step 
                number="1" 
                title="Create Class" 
                description="Set up your class with student details and schedules."
                isTeacher
              />
              <Step 
                number="2" 
                title="Take Attendance" 
                description="Mark present/absent students with a single click."
                isTeacher
              />
              <Step 
                number="3" 
                title="Review Reports" 
                description="Access comprehensive attendance reports and analytics."
                isTeacher
              />
            </div>
          </div>
          
          {/* For Students */}
          <div className="bg-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-attendpurple">For Students</h3>
            <div className="space-y-8">
              <Step 
                number="1" 
                title="Join Class" 
                description="Use class code provided by your teacher to join."
              />
              <Step 
                number="2" 
                title="Mark Attendance" 
                description="Check in for classes through the app or web interface."
              />
              <Step 
                number="3" 
                title="Track Record" 
                description="Monitor your attendance record and receive notifications."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;