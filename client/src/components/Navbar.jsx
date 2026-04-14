import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
  };

  // 🔴 Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold">
          📝 NotesApp
        </div>

        {/* Right Side */}
        <div className="relative" ref={dropdownRef}>
          
          {/* 👤 Avatar Button */}
          <div
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-500 text-white font-semibold cursor-pointer"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* 🔽 Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3">
              
              {/* User Name */}
              <p className="text-gray-800 font-medium mb-2">
                {user?.name}
              </p>

              {/* Divider */}
              <hr className="mb-2" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:bg-red-100 px-2 py-1 rounded"
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;