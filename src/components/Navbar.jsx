import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Theme state management
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Apply theme globally whenever it changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark'); // For DaisyUI
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light'); // For DaisyUI
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispatch(removeUser());
            navigate("/login"); 
        } catch (error) {
            console.error("Logout failed:", error); 
        }
    };

    return (
        // Glassmorphism Premium Navbar
        <div className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500 px-4 sm:px-8 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
                
                {/* Logo Section */}
                <div className="flex-1">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-3xl">💻</span>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            DevTinder
                        </span>
                    </Link>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6">
                    
                    {/* Glowing Theme Toggle Switch */}
                    <button
                        onClick={toggleTheme}
                        className="relative p-2 rounded-full transition-transform duration-500 hover:scale-110 focus:outline-none flex items-center justify-center overflow-hidden"
                        aria-label="Toggle Theme"
                    >
                        {/* Glow background effect */}
                        <div className={`absolute inset-0 rounded-full transition-opacity duration-700 ${theme === 'dark' ? 'bg-blue-400/20 blur-md opacity-100' : 'bg-amber-400/20 blur-md opacity-100'}`}></div>
                        
                        {theme === 'light' ? (
                            // Dark Mode (Moon) Button
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 hover:text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)] transition-all duration-500 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            // Light Mode (Sun) Button
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.8)] transition-all duration-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>

                    {/* User Profile Dropdown */}
                    {user && (
                        <div className="flex items-center space-x-3"> 
                            
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                                Welcome, {user.firstName}
                            </p> 

                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0 w-10 h-10 border-2 border-blue-600/30 hover:border-blue-500 dark:border-blue-400/50 transition-all duration-300 hover:scale-105 shadow-md">
                                    <div className="w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img
                                            alt={`${user.firstName}'s avatar`}
                                            src={user.photoUrl || 'https://via.placeholder.com/100'} 
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                                
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-white dark:bg-slate-900 rounded-2xl z-50 mt-4 w-56 p-3 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 border border-slate-100 dark:border-slate-800 right-0 transform transition-all"
                                >
                                    <li>
                                        <Link to="/profile" className="flex items-center justify-between py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors">
                                            <span className="flex items-center gap-3">
                                                <span className="text-lg">👤</span> Profile
                                            </span>
                                        </Link>
                                    </li>
                                    
                                    <li>
                                        <Link to="/connections" className="flex items-center py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors">
                                            <span className="text-lg mr-3">🔗</span> Connections
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/requests" className="flex items-center py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors">
                                            <span className="text-lg mr-3">🔔</span> Requests
                                        </Link>
                                    </li>
                                    
                                    <div className="divider my-1 h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                                    <li>
                                        <a onClick={handleLogout} className="flex items-center py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                            <span className="text-lg mr-3">🚪</span> Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;