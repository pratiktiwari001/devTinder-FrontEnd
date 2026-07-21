import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard'; 
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = (props) => {
    const { user } = props;
    const dispatch = useDispatch();
    
    // Initialize the navigate hook
    const navigate = useNavigate();

    const getStringValue = (val) => String(val ?? '');

    const [profileData, setProfileData] = useState({
        firstName: getStringValue(user?.firstName),
        lastName: getStringValue(user?.lastName),
        age: getStringValue(user?.age),
        gender: user?.gender ?? 'male',
        photoUrl: getStringValue(user?.photoUrl),
        skills: Array.isArray(user?.skills) ? user.skills.join(', ') : getStringValue(user?.skills),
    });

    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Upgraded Toast State
    const [toastStatus, setToastStatus] = useState({ visible: false, message: '', type: 'success' }); 

    useEffect(() => {
        if (user && user.firstName !== profileData.firstName) {
            setProfileData({
                firstName: getStringValue(user.firstName),
                lastName: getStringValue(user.lastName),
                age: getStringValue(user.age),
                gender: user.gender ?? 'male',
                photoUrl: getStringValue(user.photoUrl),
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : getStringValue(user.skills),
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const showToast = (message, type) => {
        setToastStatus({ visible: true, message, type });
        setTimeout(() => {
            setToastStatus({ visible: false, message: '', type: 'success' });
        }, 3000);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setError('');
        setToastStatus({ visible: false, message: '', type: 'success' });

        const finalData = {
            ...profileData,
            skills: profileData.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0)
        };

        if (!finalData.photoUrl) {
            delete finalData.photoUrl;
        }

        try {
            await axios.patch(`${BASE_URL}/profile/edit`, finalData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            
            const updatedUserPayload = {
                ...user,
                ...finalData,
                skills: finalData.skills,
            };
            dispatch(setUser(updatedUserPayload));

            showToast('Profile updated successfully! 🎉', 'success');
            
            // Redirect to Connections page after 1.5 seconds
            setTimeout(() => {
                navigate('/connections');
            }, 1500);
            
        } catch (err) {
            console.error('Profile update failed:', err);
            let errorMessage = 'Failed to save profile. Check server connection.';

            if (err.response && typeof err.response.data === 'string') {
                const fullErrorText = err.response.data;
                const prefix = 'User validation failed:';
                if (fullErrorText.startsWith(prefix)) {
                    errorMessage = fullErrorText.substring(prefix.length).trim(); 
                } else {
                    errorMessage = fullErrorText;
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }

            showToast(errorMessage, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const previewUser = {
        ...profileData,
        age: parseInt(profileData.age) || null,
        skills: profileData.skills.split(',').map(s => s.trim()),
    };

    return (
        <div className="relative w-full">
            {/* Premium Custom Toast Notification (Dark mode ready) */}
            {toastStatus.visible && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down transition-all duration-300">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md ${
                        toastStatus.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/80 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100' 
                        : 'bg-red-50 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100'
                    }`}>
                        {toastStatus.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="font-semibold text-sm">{toastStatus.message}</span>
                    </div>
                </div>
            )}
        
            <div className='flex flex-col lg:flex-row justify-center items-start gap-10 lg:gap-16 my-10 w-full max-w-6xl mx-auto px-4'>

                {/* Edit Form (Dark mode ready) */}
                <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 flex-1 transition-all duration-500">

                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 transition-colors">
                        Edit Your Profile
                    </h1>

                    {/* Photo URL Section */}
                    <div className='flex items-center space-x-6 mb-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors'>
                        <img
                            src={profileData.photoUrl || 'https://via.placeholder.com/80?text=👤'}
                            alt="Profile Preview"
                            className='w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20 dark:ring-blue-400/20 shadow-md transition-all'
                        />
                        <div className='flex-grow'>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Photo URL</label>
                            <input
                                type="url"
                                name="photoUrl"
                                value={profileData.photoUrl}
                                className="input input-bordered input-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="Link to profile picture"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5'>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profileData.firstName}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="First Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profileData.lastName}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="Last Name"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Age & Gender Fields */}
                    <div className='grid grid-cols-3 gap-5 mb-5'>
                        <div className='col-span-1'>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={profileData.age}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="Age"
                                min="18"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-span-2'>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Gender</label>
                            <select
                                name="gender"
                                value={profileData.gender}
                                className="select select-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                onChange={handleChange}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option> 
                            </select>
                        </div>
                    </div>

                    {/* Skills Field */}
                    <div className='mb-8'>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={profileData.skills}
                            className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                            placeholder="e.g., React, Node.js, JavaScript"
                            onChange={handleChange}
                        />
                        <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors'>Separate skills with commas.</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" 
                        className={`btn btn-primary w-full font-bold text-base mt-2 bg-blue-600 border-none text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 ${isSaving ? 'loading' : ''}`}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                {/* Live Preview Section */}
                <div className='hidden lg:flex flex-col items-center w-full max-w-sm sticky top-24'>
                    <div className="w-full text-center mb-4">
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                            Live Preview
                        </span>
                    </div>
                    {/* Assuming UserCard handles its own styling. If not, the card will inherit the global styles gracefully */}
                    <div className="transform scale-95 origin-top transition-all duration-300 hover:scale-100 w-full">
                        <UserCard user={previewUser} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;