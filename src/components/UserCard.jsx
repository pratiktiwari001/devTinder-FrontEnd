import React from 'react';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    const { _id, firstName, lastName, age, gender, photoUrl, skills } = user || {}; 
    const imageUrl = photoUrl;
    
    const displayAge = Number(age) > 0 ? age : null;
    
    if (!user) return null;

    const handleSendRequest = async (status,userId) =>{
        try {
           const res = await axios.post(`${BASE_URL}/request/send/${status}/${userId}`,{} , {withCredentials: true})
           dispatch(removeUserFromFeed(userId)); 
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="card w-96 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out rounded-2xl overflow-hidden transform hover:-translate-y-1">
            <figure className="relative h-[28rem] group">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${firstName} ${lastName}'s profile picture`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                        Image Not Available
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h2 className="text-4xl font-extrabold mb-1 drop-shadow-lg leading-tight">
                        {firstName} {lastName || "User"}
                        {displayAge && <span className="badge badge-lg badge-info text-white ml-3 font-semibold shadow-md">{displayAge}</span>}
                    </h2>
                    <p className="text-base font-medium opacity-90 drop-shadow-md">
                        {gender ? `Gender: ${gender}` : 'Finding connection...'}
                    </p>
                </div>
            </figure>
            
            <div className="card-body p-4 text-gray-800 flex flex-col justify-center"> 
                
                {Array.isArray(skills) && skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.slice(0,7).map((skill, index) => (
                            <span 
                                key={index} 
                                className="badge badge-outline badge-primary badge-sm font-medium text-xs py-2 px-3 border-dashed border-gray-400"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
                
                <div className="card-actions justify-center items-center space-x-6 w-full"> 
                    <button className="btn btn-outline btn-success btn-lg flex-1 h-14 hover:bg-success hover:text-white transition-colors duration-300" onClick={() => handleSendRequest("interested", _id)}>
                        <span className="mr-2">❤️</span> Interested
                    </button>
                    
                    <button className="btn btn-outline btn-error btn-lg flex-1 h-14 hover:text-white hover:bg-error transition-colors duration-300" onClick={() => handleSendRequest("ignored", _id)}>
                        <span className="mr-2">❌</span> Ignore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;