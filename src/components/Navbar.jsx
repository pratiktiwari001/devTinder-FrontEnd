import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';
import Switch from './Switch';

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
                    
                    <Switch theme={theme} toggleTheme={toggleTheme} />

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