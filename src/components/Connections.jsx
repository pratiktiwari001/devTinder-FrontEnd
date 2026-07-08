import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections, removeConnections } from '../utils/connectionsSlice';
// ⚠️ ASSUMPTION: You are using react-router-dom for routing
import { Link } from 'react-router-dom'; 

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();

    const currentUser = useSelector((store) => store.user);

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

    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchConnections();
        } else {
            dispatch(removeConnections());
        }
    }, [currentUser?._id]);

    

    if (connections === null) {
        return <div className='text-center my-10 text-xl font-medium text-white'>Loading Connections...</div>;
    }

    if (connections.length === 0) {
        return <h1 className='text-center my-10 text-2xl font-bold text-white'>No Connections Found! 😥</h1>;
    }


    return (
        <div className='max-w-4xl mx-auto my-10 p-4'>
            <h1 className='text-3xl font-extrabold text-center mb-8 text-white border-b border-gray-600 pb-2'>
                Your Connections ({connections.length})
            </h1>

            <div className='space-y-4'>
                {connections.map((connection, index) => {
                    const {
                        _id,
                        firstName,
                        lastName,
                        photoUrl,
                        age,
                        gender,
                        skills
                    } = connection;

                    const fullName = `${firstName || ''} ${lastName || ''}`;
                    const defaultPhoto = 'https://via.placeholder.com/60?text=👤';

                    const hasSkills = Array.isArray(skills) && skills.length > 0;
                    const skillsToDisplay = hasSkills ? skills.slice(0, 5) : [];

                    return (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-8 border-l-primary/70"
                        >

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

                            <div className="flex flex-wrap gap-3 md:justify-end items-center mt-3 md:mt-0">
                                {/* Display Skills */}
                                {hasSkills ? (
                                    <div className='hidden md:flex flex-wrap gap-2 md:w-auto'>
                                        {skillsToDisplay.slice(0, 4).map((skill, skillIndex) => (
                                            <span key={skillIndex} className="badge badge-info badge-sm text-white font-medium shadow-sm transition-transform duration-100 hover:scale-105">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full border border-dashed border-gray-300 hidden md:block">
                                        ✨ No listed expertise yet.
                                    </span>
                                )}
                                
                                
                                <Link
                                    to={"/chat/"+_id}
                                    className="
                                        bg-blue-600 hover:bg-blue-700 
                                        text-white 
                                        font-medium 
                                        py-2 px-5 
                                        rounded-full 
                                        transition-all duration-300 
                                        shadow-lg hover:shadow-xl 
                                        transform hover:scale-105 
                                        flex items-center space-x-2 
                                        w-full md:w-auto justify-center
                                        focus:outline-none focus:ring-4 focus:ring-blue-300
                                    "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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