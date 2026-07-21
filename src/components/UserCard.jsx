import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const UserCard = ({ user, showToast }) => { // 🚀 NEW: Receive showToast prop
    const dispatch = useDispatch();
    
    // 🚀 NEW: State to track animation direction
    const [actionState, setActionState] = useState(''); 

    // Reset animation state when a new user card is loaded
    useEffect(() => {
        setActionState('');
    }, [user?._id]);

    const { _id, firstName, lastName, age, gender, photoUrl, skills } = user || {}; 
    const imageUrl = photoUrl;
    const displayAge = Number(age) > 0 ? age : null;
    
    if (!user) return null;

    const handleAction = (status, userId) => {
        // Prevent double clicking while animation is running
        if (actionState !== '') return; 

        // 1. Trigger Animation instantly (Optimistic UI)
        setActionState(status);

        // 2. Fire API call in background (do not await it, so the UI doesn't freeze)
        axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true })
            .then(() => {
                if (showToast) {
                    const msg = status === 'interested' 
                        ? `Connection request sent to ${firstName} 🚀` 
                        : `Passed on ${firstName} ❌`;
                    showToast(msg, 'success');
                }
            })
            .catch((error) => {
                console.log(error);
                setActionState(''); // Revert animation if API fails
                if (showToast) showToast('Failed to perform action.', 'error');
            });

        // 3. Update Redux only AFTER the 300ms CSS animation finishes
        setTimeout(() => {
            dispatch(removeUserFromFeed(userId)); 
        }, 300);
    }

    // 🚀 NEW: Dynamic CSS classes based on swipe direction
    const animationClass = 
        actionState === 'interested' ? 'translate-x-[120%] opacity-0 rotate-12 scale-95' :
        actionState === 'ignored' ? '-translate-x-[120%] opacity-0 -rotate-12 scale-95' : 
        'translate-x-0 opacity-100 rotate-0 scale-100';

    return (
        // 🚀 NEW: Added ${animationClass} to the main container
        <div className={`w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 hover:shadow-2xl dark:hover:shadow-black/60 transition-all duration-300 ease-in-out rounded-3xl overflow-hidden transform flex flex-col ${animationClass}`}>
            
            {/* Image & Overlay Header */}
            <figure className="relative h-[28rem] group overflow-hidden shrink-0">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${firstName} ${lastName}'s profile picture`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-lg font-medium transition-colors duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h2 className="text-3xl font-extrabold mb-1 drop-shadow-lg leading-tight flex items-center flex-wrap gap-2">
                        {firstName} {lastName || ""}
                        {displayAge && (
                            <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold text-white shadow-sm border border-white/20">
                                {displayAge}
                            </span>
                        )}
                    </h2>
                    <p className="text-sm font-medium opacity-90 drop-shadow-md flex items-center gap-1.5">
                        {gender ? (
                            <>
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                <span className="capitalize">{gender}</span>
                            </>
                        ) : 'Finding connection...'}
                    </p>
                </div>
            </figure>
            
            <div className="p-6 flex flex-col justify-between flex-grow bg-white dark:bg-slate-900 transition-colors duration-500"> 
                
                <div className="mb-6 min-h-[3rem]">
                    {Array.isArray(skills) && skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.slice(0, 7).map((skill, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100/50 dark:border-blue-800/50 transition-colors duration-300"
                                >
                                    {skill}
                                </span>
                            ))}
                            {skills.length > 7 && (
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full transition-colors duration-300">
                                    +{skills.length - 7}
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic">No expertise listed.</p>
                    )}
                </div>
                
                {/* Modern Action Buttons */}
                <div className="flex justify-center items-center gap-4 w-full mt-auto"> 
                    <button 
                        className="flex-1 py-3.5 rounded-full text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all duration-300 flex justify-center items-center gap-2 group" 
                        onClick={() => handleAction("ignored", _id)} // 🚀 CHANGED
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Pass
                    </button>
                    
                    <button 
                        className="flex-1 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 dark:shadow-blue-900/40 hover:shadow-blue-600/40 transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2 group" 
                        onClick={() => handleAction("interested", _id)} // 🚀 CHANGED
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;