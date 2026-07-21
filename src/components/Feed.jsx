import React, { useEffect, useState } from 'react';
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed } from '../utils/feedSlice'; 
import axios from 'axios';
import UserCard from './UserCard';

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();
    
    const currentUser = useSelector(store => store.user); 
    const currentUserId = currentUser ? currentUser._id : null; 

    const [isTimeout, setIsTimeout] = useState(false);
    
    // 🚀 NEW: Premium Toast State for Notifications
    const [toastStatus, setToastStatus] = useState({ visible: false, message: '', type: 'success' }); 

    const showToast = (message, type = 'success') => {
        setToastStatus({ visible: true, message, type });
        setTimeout(() => {
            setToastStatus({ visible: false, message: '', type: 'success' });
        }, 3000);
    };

    const getFeed = async () => {
        if (!currentUserId) {
            dispatch(removeFeed());
            return;
        }
        
        try {
            const res = await axios.get(BASE_URL + "/user/feed", { withCredentials: true });
            const feedArray = res?.data?.FEED || [];  
            
            dispatch(addFeed(feedArray));
        } catch (err) {
            console.error("Error fetching feed:", err);
            dispatch(addFeed([])); 
        }
    };

    useEffect(() => {
        if (currentUserId) {
            setIsTimeout(false); 
            getFeed();
        }
    }, [currentUserId]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTimeout(true);
        }, 6000); 
        return () => clearTimeout(timer); 
    }, []);

    if (feed === null && !isTimeout) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center py-20 w-full transition-colors duration-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Finding nearby developers...</p>
            </div>
        );
    }

    if ((feed && feed.length === 0) || (feed === null && isTimeout)) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4 w-full transition-colors duration-500">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 shadow-inner transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 transition-colors duration-500">
                    {feed === null ? "Search Timed Out" : "No New Developers Found"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium transition-colors duration-500">
                    {feed === null 
                        ? "We couldn't connect to the server in time. Please try refreshing." 
                        : "You've reached the end of your feed for now. Check back later to discover new talent!"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-grow flex justify-center items-center py-8 px-4 w-full transition-colors duration-500 relative">
            
            {/* 🚀 NEW: Render Toast Notification */}
            {toastStatus.visible && <ToastComponent status={toastStatus} />}

            <div className="w-full max-w-sm sm:max-w-md">
                {/* 🚀 NEW: Pass showToast down to UserCard */}
                <UserCard user={feed[0]} showToast={showToast} />
            </div>
        </div>
    );
};

export default Feed;


// 🚀 NEW: Global Toast Component
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