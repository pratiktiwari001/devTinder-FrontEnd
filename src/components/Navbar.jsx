import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        // Navbar background is dark in your screenshot, so we assume bg-base-300 or similar
        <div className="navbar bg-base-300 shadow-xl border-b border-gray-600 sticky top-0 z-40 px-4 sm:px-8">
            <div className="flex-1">
                {/* Logo text visibility fix */}
                <Link to="/" className="btn btn-ghost text-2xl font-extrabold text-white">
                    <span className="text-3xl mr-1">💻</span>DevTinder
                </Link>
            </div>

            {user && (
                <div className="flex items-center space-x-2"> 
                    
                    {/* 🎯 FIX 1: Explicitly set Welcome text color to white */}
                    <p className="text-md font-semibold text-white hidden sm:block">
                        Welcome, {user.firstName}
                    </p> 

                    <div className="dropdown dropdown-end">
                        
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0 w-12 h-12 border-2 border-primary/50 transition-transform duration-200 hover:scale-105">
                            <div className="w-full rounded-full overflow-hidden">
                                <img
                                    alt={`${user.firstName}'s avatar`}
                                    src={user.photoUrl || 'https://via.placeholder.com/100'} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        
                        <ul
                            tabIndex={0}
                            className="menu menu-md dropdown-content bg-white rounded-box z-30 mt-4 w-56 p-3 shadow-2xl border border-gray-200 right-0 transform translate-x-1"
                        >
                            {/* Profile Link */}
                            <li>
                                {/* 🎯 FIX 2: Add hover:text-white and hover:bg-black/80 for contrast on hover */}
                                <Link to="/profile" className="justify-between py-2 text-lg font-medium text-gray-800 hover:bg-black/80 hover:text-white transition-colors">
                                    <span className="flex items-center">
                                        <span className="mr-2">👤</span> Profile
                                    </span>
                                    <span className="badge badge-sm badge-neutral">Edit</span>
                                </Link>
                            </li>
                            
                            {/* Connections Link */}
                            <li>
                                {/* 🎯 FIX 3: Apply the same hover fix to Connections */}
                                <Link to="/connections" className="py-2 text-lg font-medium text-gray-800 hover:bg-black/80 hover:text-white transition-colors">
                                    <span className="mr-2">🔗</span> Connections
                                </Link>
                            </li>
                            
                            {/* Logout Link */}
                            <li>
                                <a onClick={handleLogout} className="py-2 text-lg font-medium text-error hover:bg-error/10 transition-colors">
                                    <span className="mr-2">🚪</span> Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;