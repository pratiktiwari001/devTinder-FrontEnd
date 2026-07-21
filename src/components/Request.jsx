import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequests, removeRequestById } from '../utils/requestSlice';

const Request = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();
    const [actionLoadingId, setActionLoadingId] = useState(null);
    
    const [toastStatus, setToastStatus] = useState({ visible: false, message: '', type: 'success' }); 

    const showToast = (message, type) => {
        setToastStatus({ visible: true, message, type });
        setTimeout(() => {
            setToastStatus({ visible: false, message: '', type: 'success' });
        }, 3000);
    };

    const fetchRequests = async () => {
        dispatch(removeRequests()); 
        try {
            const res = await axios.get(BASE_URL + "/user/requests/pending", { withCredentials: true });
            dispatch(addRequests(res.data.data)); 
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            dispatch(removeRequests()); 
        }
    };

    const handleAction = async (requestId, actionType) => {
        setActionLoadingId(requestId);
        
        const successType = actionType === 'accept' ? 'success' : 'error';
        const endpointAction = actionType === 'accept' ? 'accepted' : 'rejected';

        try {
            await axios.post(
                `${BASE_URL}/request/review/${endpointAction}/${requestId}`,
                { },
                { withCredentials: true }
            );

            dispatch(removeRequestById(requestId)); 
            showToast(`Request ${endpointAction}!`, successType);

        } catch (error) {
            console.error(`Error processing ${actionType}:`, error);
            const errorMessage = `Failed to ${actionType} request.`;
            showToast(errorMessage, 'error');
            
        } finally {
            setActionLoadingId(null);
        }
    };
    
    useEffect(() => {
        fetchRequests();
    }, []); 

    // 1. Premium Loading State (Dark Mode Ready)
    if (requests === null) {
        return (
            <>
                {toastStatus.visible && <ToastComponent status={toastStatus} />}
                <div className="flex-grow flex flex-col items-center justify-center py-32 w-full h-full transition-colors duration-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading requests...</p>
                </div>
            </>
        );
    }

    // 2. Premium Empty State (Dark Mode Ready)
    if (requests.length === 0) {
        return (
            <>
                {toastStatus.visible && <ToastComponent status={toastStatus} />}
                <div className="flex-grow flex flex-col items-center justify-center py-32 text-center px-4 transition-colors duration-500">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 transition-colors duration-500">
                        {/* Mail/Envelope Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 transition-colors duration-500">No Pending Requests</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors duration-500">You're all caught up! Keep exploring the feed to find new connections.</p>
                </div>
            </>
        );
    }

    // 3. Main Request List (Dark Mode Ready)
    return (
        <div className="w-full flex-grow transition-colors duration-500">
            {toastStatus.visible && <ToastComponent status={toastStatus} />}
            
            <div className='max-w-4xl mx-auto my-10 p-4'>
                <div className="text-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-500">
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors duration-500">
                        Pending Requests{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            ({requests.length})
                        </span>
                    </h1>
                </div>

                <div className='space-y-5'>
                    {requests.map((request, index) => {
                        const { _id: requestId } = request;
                        const { firstName, lastName, photoUrl, skills, age, gender } = request.fromUserId || {}; 
                        
                        const fullName = `${firstName || ''} ${lastName || ''}`;
                        const defaultPhoto = 'https://via.placeholder.com/150?text=👤';
                        const isLoading = actionLoadingId === requestId;

                        return (
                            <div 
                                key={requestId || index} 
                                className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                {/* Profile Info */}
                                <div className="flex items-center space-x-5 mb-4 md:mb-0 w-full md:w-auto"> 
                                    <div className="relative shrink-0">
                                        <img
                                            src={photoUrl || defaultPhoto}
                                            alt={fullName || 'User'}
                                            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/50 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all duration-300"
                                        />
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full transition-colors duration-300"></span>
                                    </div>
                                    
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {fullName}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {age && <span>{age} yrs</span>}
                                            {age && gender && <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>}
                                            {gender && <span className="capitalize">{gender}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Skills and Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                                    
                                    {/* Skills Pill (Hidden on mobile for space) */}
                                    {Array.isArray(skills) && skills.length > 0 && (
                                        <div className="hidden lg:flex flex-wrap gap-2">
                                            {skills.slice(0, 3).map((skill, skillIndex) => (
                                                <span 
                                                    key={skillIndex} 
                                                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100/50 dark:border-blue-800/50 transition-colors duration-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() => handleAction(requestId, 'reject')}
                                            disabled={isLoading}
                                            className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all duration-300 disabled:opacity-50 flex-1 sm:flex-none text-center"
                                        >
                                            Decline
                                        </button>
                                        
                                        <button
                                            onClick={() => handleAction(requestId, 'accept')}
                                            disabled={isLoading}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 dark:shadow-blue-900/40 hover:shadow-lg hover:shadow-blue-600/40 transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex-1 sm:flex-none text-center flex justify-center items-center gap-2 ${isLoading && actionLoadingId === requestId ? 'opacity-80' : ''}`}
                                        >
                                            {isLoading && actionLoadingId === requestId ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : null}
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Request;


// Premium Global Toast Component (Aligned with EditProfile toast)
const ToastComponent = ({ status }) => {
    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down transition-all duration-300">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md ${
                status.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/80 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100' 
                : 'bg-red-50 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100'
            }`}>
                {status.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                )}
                <span className="font-semibold text-sm">{status.message}</span>
            </div>
        </div>
    );
};