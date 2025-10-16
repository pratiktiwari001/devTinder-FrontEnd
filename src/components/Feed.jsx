import React, { useEffect } from 'react';
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

    const getFeed = async () => {
        if (!currentUserId) {
            dispatch(removeFeed());
            return;
        }
        dispatch(removeFeed()); 
        
        try {
            const res = await axios.get(BASE_URL + "/user/feed", { withCredentials: true });
            const feedArray = res?.data?.FEED;  
            
            dispatch(addFeed(feedArray));
        } catch (err) {
            console.error("Error fetching feed:", err);
            dispatch(removeFeed()); 
        }
    };

    useEffect(() => {
        if (currentUserId) {
            getFeed();
        }
    }, [currentUserId]); 
    if (feed === null) {
        return <h1 className="flex justify-center my-10">Loading...</h1>;
    }

    if (feed.length === 0) {
        return  <h1 className='text-3xl font-extrabold text-center my-8 text-white'>No new Users found!</h1>;
    }

    return (
        <div className="flex justify-center my-10">
            <UserCard user={feed[0]} />
        </div>
    );
};

export default Feed;