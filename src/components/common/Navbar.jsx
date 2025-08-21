import React, { useState, useEffect } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for dark mode changes
  useEffect(() => {
    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.detail.isDarkMode);
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Define nav links with their routes
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  // Function to get active page based on current route
  const getActivePage = () => {
    const currentPath = location.pathname;
    const activeLink = navLinks.find(link => link.path === currentPath);
    return activeLink ? activeLink.name : 'Dashboard';
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <nav className={`shadow-2xl border-b transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gray-800/80 border-gray-700 backdrop-blur-xl' 
        : 'bg-white/80 border-white/20 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-2 rounded-lg shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className={`ml-3 text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Finance Dashboard
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 ${
                  getActivePage() === link.name
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900 hover:shadow-lg'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button - Only visible on mobile */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-xl ${
                  isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible on mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700 backdrop-blur-xl' 
              : 'bg-white/90 border-white/20 backdrop-blur-xl'
          }`}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 ${
                  getActivePage() === link.name
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900 hover:shadow-lg'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;