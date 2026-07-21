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

    // 🚀 NEW: State to track if our 6-second loading limit has passed
    const [isTimeout, setIsTimeout] = useState(false);

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
            // If it fails, dispatch an empty array so it stops loading and shows the empty state
            dispatch(addFeed([])); 
        }
    };

    useEffect(() => {
        if (currentUserId) {
            // Reset timeout whenever we attempt to fetch
            setIsTimeout(false); 
            getFeed();
        }
    }, [currentUserId]); 

    // 🚀 NEW: 6-Second safety timeout mechanism
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTimeout(true);
        }, 6000); // 6000ms = 6 seconds

        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, []);

    // 1. Sleek Loading Spinner (Stops if feed is loaded OR 6 seconds have passed)
    if (feed === null && !isTimeout) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center py-20 w-full transition-colors duration-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Finding nearby developers...</p>
            </div>
        );
    }

    // 2. Custom Empty Feed State (Shows if feed is strictly empty, OR if we timed out while waiting)
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

    // 3. Main Feed Presentation
    return (
        <div className="flex-grow flex justify-center items-center py-8 px-4 w-full transition-colors duration-500">
            <div className="w-full max-w-sm sm:max-w-md transform transition-all duration-300">
                <UserCard user={feed[0]} />
            </div>
        </div>
    );
};

export default Feed;