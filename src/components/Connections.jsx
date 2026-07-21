import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections, removeConnections } from '../utils/connectionsSlice';
import { Link } from 'react-router-dom'; 

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();
    const currentUser = useSelector((store) => store.user);

    useEffect(() => {
        const fetchConnections = async () => {
            dispatch(removeConnections());
            try {
                const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
                dispatch(addConnections(res?.data?.data));
            } catch (error) {
                console.error("Failed to fetch connections:", error);
                dispatch(removeConnections());
            }
        };

        if (currentUser && currentUser._id) {
            fetchConnections();
        } else {
            dispatch(removeConnections());
        }
    }, [currentUser?._id, dispatch]);

    if (connections === null) {
        return (
            <div className="flex flex-col items-center justify-center py-32 w-full h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading your network...</p>
            </div>
        );
    }

    if (connections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center px-4 transition-colors duration-500">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">No Connections Yet</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">You haven't matched with anyone yet. Keep exploring developers to build your network!</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-10 p-4 w-full">
            <div className="text-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-500">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors duration-500">
                    Your Connections{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                        ({connections.length})
                    </span>
                </h1>
            </div>

            <div className="space-y-5">
                {connections.map((connection, index) => {
                    const { _id, firstName, lastName, photoUrl, age, gender, skills } = connection;
                    const fullName = `${firstName || ''} ${lastName || ''}`;
                    const defaultPhoto = 'https://via.placeholder.com/150?text=👤';
                    const hasSkills = Array.isArray(skills) && skills.length > 0;
                    const skillsToDisplay = hasSkills ? skills.slice(0, 4) : [];

                    return (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center space-x-5 mb-4 md:mb-0 w-full md:w-auto">
                                <div className="relative">
                                    <img
                                        src={photoUrl || defaultPhoto}
                                        alt={fullName || 'User'}
                                        className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/50 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all duration-300"
                                    />
                                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full transition-colors duration-300"></span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {fullName}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {age && <span>{age} yrs</span>}
                                        {age && gender && <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>}
                                        {gender && <span className="capitalize">{gender}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 md:justify-end items-center mt-2 md:mt-0 w-full md:w-auto">
                                {hasSkills ? (
                                    <div className="hidden md:flex flex-wrap gap-2">
                                        {skillsToDisplay.map((skill, skillIndex) => (
                                            <span 
                                                key={skillIndex} 
                                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100/50 dark:border-blue-800/50 transition-colors duration-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 hidden md:block transition-colors duration-300">
                                        No listed expertise
                                    </span>
                                )}
                                
                                {/* 🚀 CRITICAL FIX: state={{ userName: fullName }} passes the name to Chat */}
                                <Link
                                    to={"/chat/" + _id}
                                    state={{ userName: fullName }}
                                    className="
                                        w-full md:w-auto
                                        flex items-center justify-center space-x-2 
                                        bg-blue-600 hover:bg-blue-700 text-white 
                                        font-bold text-sm
                                        py-2.5 px-6 rounded-full 
                                        shadow-md shadow-blue-600/20 dark:shadow-blue-900/40 hover:shadow-lg hover:shadow-blue-600/40 
                                        transition-all duration-300 transform active:scale-95
                                    "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Message</span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Connections;