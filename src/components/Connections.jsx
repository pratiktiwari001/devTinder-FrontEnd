import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionsSlice';

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        if (connections !== null) return; 

        try {
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
            dispatch(addConnections(res?.data?.data));
        } catch (error) {
            console.error("Failed to fetch connections:", error);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    // 1. Loading State
    if (connections === null) {
        return <div className='text-center my-10 text-xl font-medium text-white'>Loading Connections...</div>;
    }

    // 2. No Connections Found State
    if (connections.length === 0) {
        return <h1 className='text-center my-10 text-2xl font-bold text-white'>No Connections Found! 😥</h1>;
    }

    // 3. Render Connections List
    return (
        <div className='max-w-4xl mx-auto my-10 p-4'>
            {/* Heading Fix */}
            <h1 className='text-3xl font-extrabold text-center mb-8 text-white border-b border-gray-600 pb-2'>
                Your Connections ({connections.length})
            </h1>

            {/* List Layout with Connection Item UI */}
            <div className='space-y-4'>
                {connections.map((connection, index) => {
                    const { 
                        firstName, 
                        lastName, 
                        photoUrl, 
                        age, 
                        gender, 
                        skills 
                    } = connection;
                    
                    const fullName = `${firstName || ''} ${lastName || ''}`;
                    const defaultPhoto = 'https://via.placeholder.com/60?text=👤';

                    // Prepare skills data
                    const hasSkills = Array.isArray(skills) && skills.length > 0;
                    const skillsToDisplay = hasSkills ? skills.slice(0, 5) : []; // 🚀 UI Enhancement: Increased limit to 5

                    return (
                        // 🚀 UI ENHANCEMENT: Added subtle hover effect and border indicator
                        <div 
                            key={index} 
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-8 border-l-primary/70 cursor-pointer"
                        >
                            
                            {/* LEFT SIDE: Photo, Name, and Age/Gender */}
                            <div className="flex items-center space-x-5 mb-3 md:mb-0 w-full md:w-auto">
                                <img
                                    src={photoUrl || defaultPhoto}
                                    alt={fullName || 'User'}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-gray-200 shadow-inner"
                                />
                                
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 leading-snug">{fullName}</h3>
                                    
                                    <div className="flex items-center space-x-3 mt-1 text-sm">
                                        {age && <span className="text-gray-600 font-semibold">{age} yrs</span>}
                                        {gender && <span className="text-gray-500 capitalize">({gender})</span>}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Skills Section */}
                            <div className="flex flex-wrap gap-2 md:w-1/2 md:justify-end items-center mt-3 md:mt-0">
                                
                                {hasSkills ? (
                                    // 🚀 UI FIX: Render the desired number of skills
                                    skillsToDisplay.map((skill, skillIndex) => (
                                        <span key={skillIndex} className="badge badge-info badge-sm text-white font-medium shadow-sm transition-transform duration-100 hover:scale-105">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    // 🚀 UI FIX & ENHANCEMENT: Display meaningful text when no skills are available
                                    <span className="text-sm text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full border border-dashed border-gray-300">
                                        ✨ No listed expertise yet.
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Connections;