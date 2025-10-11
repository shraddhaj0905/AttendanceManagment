import React, { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/70 border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <g><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></g>
            ) : (
              <g><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></g>
            )}
          </svg>
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-attendblue transition-colors duration-200">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-attendblue transition-colors duration-200">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-attendblue transition-colors duration-200">
            Testimonials
          </a>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 animate-scale-in">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-attendblue transition-colors duration-200 py-2">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-attendblue transition-colors duration-200 py-2">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-attendblue transition-colors duration-200 py-2">
              Testimonials
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
