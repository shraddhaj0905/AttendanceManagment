import React from 'react';

const AuthButton = ({ text, type = "primary", onClick }) => {
  const baseClasses = "px-6 py-3 rounded-full font-medium button-hover focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const buttonStyles = {
    primary: "bg-gradient-to-r from-attendblue to-attendpurple text-white focus:ring-attendpurple",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:border-attendblue hover:text-attendblue focus:ring-attendblue",
    teacher: "bg-gradient-to-r from-attendblue-light to-attendblue text-white focus:ring-attendblue",
    student: "bg-gradient-to-r from-attendpurple-light to-attendpurple text-white focus:ring-attendpurple"
  };
  
  return (
    <button 
      className={`${baseClasses} ${buttonStyles[type]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default AuthButton;
