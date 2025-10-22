import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // redirect to login page
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Teacher Dashboard</h1>
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/attendance" className="hover:underline">
          Attendance
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
