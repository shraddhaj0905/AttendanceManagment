import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-attendblue to-attendpurple flex items-center justify-center">
        <span className="text-white font-bold text-xl">A</span>
      </div>
      <span className="font-bold text-2xl gradient-text">AttendHub</span>
    </div>
  );
};

export default Logo;
