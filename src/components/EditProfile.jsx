import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard'; 
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice';

const EditProfile = (props) => {
    const { user } = props;
    const dispatch = useDispatch();

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

        // 1. Prepare Data Payload
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
            // 2. API Call (Using PATCH for partial update)
            await axios.patch(`${BASE_URL}/profile/edit`, finalData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });
            
            // 3. Redux Update
            const updatedUserPayload = {
                ...user,
                ...finalData,
                skills: finalData.skills,
            };
            dispatch(setUser(updatedUserPayload));

            showToast('Profile updated successfully! 🎉', 'success');
            
        } catch (err) {
            // 4. Error Handling
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
            // setError(errorMessage);
            
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
        <>
            {toastStatus.visible && (
                <div className="toast toast-top toast-center z-50">
                    <div className={`alert ${toastStatus.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            {toastStatus.type === 'success' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                        </svg>
                        <span>{toastStatus.message}</span>
                    </div>
                </div>
            )}
        
            <div className='flex justify-center items-start gap-40 my-5'>

                <form onSubmit={handleSaveProfile} className="bg-white rounded-xl w-full max-w-xl p-8 shadow-2xl border border-gray-100">

                    <legend className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-2">
                        Edit Your Profile
                    </legend>

                    <div className='flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                        <img
                            src={profileData.photoUrl || 'https://via.placeholder.com/80?text=👤'}
                            alt="Profile Preview"
                            className='w-16 h-16 rounded-full object-cover border-4 border-primary shadow-md'
                        />
                        <div className='flex-grow'>
                            <label className="label font-semibold text-gray-700">Photo URL</label>
                            <input
                                type="url"
                                name="photoUrl"
                                value={profileData.photoUrl}
                                className="input input-bordered input-sm w-full bg-white transition-shadow duration-300 focus:shadow-md text-gray-800"
                                placeholder="Link to profile picture"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div>
                            <label className="label font-semibold text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profileData.firstName}
                                className="input input-bordered w-full bg-white text-gray-800"
                                placeholder="First Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label font-semibold text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profileData.lastName}
                                className="input input-bordered w-full bg-white text-gray-800"
                                placeholder="Last Name"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4 mb-6'>
                        <div className='col-span-1'>
                            <label className="label font-semibold text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={profileData.age}
                                className="input input-bordered w-full bg-white text-gray-800"
                                placeholder="Age"
                                min="18"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-span-2'>
                            <label className="label font-semibold text-gray-700">Gender</label>
                            <select
                                name="gender"
                                value={profileData.gender}
                                className="select select-bordered w-full bg-white text-gray-800"
                                onChange={handleChange}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option> 
                            </select>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className='mb-8'>
                        <label className="label font-semibold text-gray-700">Skills</label>
                        <input
                            type="text"
                            name="skills"
                            value={profileData.skills}
                            className="input input-bordered w-full bg-white text-gray-800"
                            placeholder="e.g., React, Node.js, JavaScript (Comma separated)"
                            onChange={handleChange}
                        />
                        <p className='text-xs text-gray-500 mt-1'>Separate skills with commas.</p>
                    </div>

                    {error && <p className='text-error mb-4 font-medium'>{error}</p>}

                    <button
                        type="submit" 
                        className={`btn btn-primary btn-lg w-full transition-all duration-300 ${isSaving ? 'loading' : ''}`}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                <div className='hidden lg:block'>
                    <UserCard user={previewUser} />
                </div>
            </div>
        </>
    );
};

export default EditProfile;