import React from 'react';
import EditProfile from './EditProfile';
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector((store) => store.user);

    // 1. Sleek Loading State (Dark Mode Ready)
    // Prevents EditProfile from flashing empty inputs while Redux loads the user data
    if (!user) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center py-20 w-full transition-colors duration-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        // 2. Main Container
        // flex-grow ensures it takes up the full middle section, smoothly transitioning themes
        <div className="flex-grow flex flex-col items-center justify-start w-full min-h-full transition-colors duration-500">
            <EditProfile user={user} />
        </div>
    );
};

export default Profile;