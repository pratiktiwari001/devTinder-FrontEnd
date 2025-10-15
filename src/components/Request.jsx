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

            showToast(`${endpointAction.charAt(0).toUpperCase() + endpointAction.slice(1)} connection!`, successType);

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

    
    if (requests === null) {
        return (
            <>
                {toastStatus.visible && <ToastComponent status={toastStatus} />}
                <div className='text-center my-10 text-xl font-medium text-white'>Loading Requests...</div>
            </>
        );
    }

    if (requests.length === 0) {
        return (
            <>
                {toastStatus.visible && <ToastComponent status={toastStatus} />}
                <h1 className='text-center my-10 text-2xl font-bold text-white'>No Pending Requests! 🎉</h1>
            </>
        );
    }

    
    return (
        <>
            {toastStatus.visible && <ToastComponent status={toastStatus} />}
            
            <div className='max-w-3xl mx-auto my-10 p-4'>
                <h1 className='text-3xl font-extrabold text-center mb-8 text-white border-b border-gray-600 pb-2'>
                    Pending Connection Requests ({requests.length})
                </h1>

                <div className='space-y-4'>
                    {requests.map((request, index) => {
                        const { _id: requestId } = request;
                        
                        const { firstName, lastName, photoUrl, skills, age, gender } = request.fromUserId || {}; 
                        
                        const fullName = `${firstName || ''} ${lastName || ''}`;
                        const defaultPhoto = 'https://via.placeholder.com/60?text=👤';
                        const isLoading = actionLoadingId === requestId;

                        return (
                            <div 
                                key={requestId || index} 
                                className="flex flex-wrap items-center justify-between p-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-l-8 border-l-warning/70 min-h-[100px]"
                            >
                                <div className="flex items-center space-x-4 flex-grow min-w-0 pr-4"> 
                                    <img
                                        src={photoUrl || defaultPhoto}
                                        alt={fullName || 'User'}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-warning/50 shrink-0"
                                    />
                                    
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-bold text-gray-800 leading-tight truncate">{fullName}</h3>
                                        
                                        
                                        <div className="flex items-center space-x-2 mt-1">
                                            {age && <span className="badge badge-sm badge-neutral">{age} yrs</span>}
                                            {gender && <span className="badge badge-sm badge-ghost">{gender}</span>}
                                        </div>
                                    </div>
                                </div>

                               
                                <div className="flex flex-col sm:flex-row items-end sm:items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 ml-auto">
                                    
                                  
                                    <div className="hidden md:flex flex-wrap gap-1">
                            
                                        {Array.isArray(skills) && skills.slice(0, 4).map((skill, skillIndex) => (
                                            <span key={skillIndex} className="badge badge-info badge-sm badge-outline">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleAction(requestId, 'accept')}
                                            className={`btn btn-sm btn-success text-white font-semibold ${isLoading ? 'loading' : ''}`}
                                            disabled={isLoading}
                                        >
                                            Accept
                                        </button>
                                        
                                        <button
                                            onClick={() => handleAction(requestId, 'reject')}
                                            className={`btn btn-sm btn-error text-white font-semibold ${isLoading ? 'loading' : ''}`}
                                            disabled={isLoading}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Request;


const ToastComponent = ({ status }) => {
    const alertClass = status.type === 'success' ? 'alert-success' : 'alert-error';
    
    return (
        <div className="toast toast-center z-50 transform -translate-y-1/2">
            <div className={`alert ${alertClass} shadow-xl`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    {status.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                </svg>
                <span>{status.message}</span>
            </div>
        </div>
    );
};