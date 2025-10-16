import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const Login = () => {
    // State initialization
    const [emailId, setEmailId] = useState('pratik@gmail.com');
    const [password, setPassword] = useState('Kl@rahul123');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Persist Login/Signup view based on URL hash (omitted logic for brevity)
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#signup') {
            setIsLoginForm(false);
        }
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        if (!emailId || !password) {
            setError('Please enter both email and password.');
            setIsSubmitting(false);
            return;
        }
        if (!isLoginForm && (!firstName || !lastName)) {
            setError('Please enter your first and last name to register.');
            setIsSubmitting(false);
            return;
        }

        const endpoint = isLoginForm ? `${BASE_URL}/login` : `${BASE_URL}/signup`;
        const payload = {
            emailID: emailId,
            password: password,
            ...(isLoginForm ? {} : { firstName, lastName })
        };

        try {
            const res = await axios.post(endpoint, payload, { withCredentials: true });
            const userData = res?.data?.data || res?.data;
            console.log(userData)

            if (userData) {
                dispatch(addUser(userData));

                // 🚀 CORRECT REDIRECTION: Sends user to the appropriate page
                if (isLoginForm) {
                    navigate("/"); 
                } else {
                    navigate("/profile"); // Signup goes to Profile page
                }

            } else {
                setError('Authentication failed. Received empty user data.');
            }

        } catch (err) {
            console.error('Authentication error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleToggle = () => {
        const newState = !isLoginForm;
        setIsLoginForm(newState);
        setError('');
        setFirstName('');
        setLastName('');
        // window.location.hash = newState ? '#login' : '#signup';
    };


    return (
        <div className='flex justify-center items-center py-12'>
            <form onSubmit={handleAuth} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition-all duration-500 hover:scale-[1.01]">

                <h1 className="text-4xl font-extrabold text-center text-primary mb-2">
                    DevTinder
                </h1>
                <p className="text-center text-lg text-gray-600 mb-8">
                    {isLoginForm ? "Log in to connect with developers" : "Create your account to join"}
                </p>

                {/* First Name & Last Name (Visible on Signup) */}
                {!isLoginForm &&
                    <>
                    {/* 🚀 FIX: Form Field Wrapper to eliminate gray background space */}
                    <div className="mb-4"> 
                        <label className="label font-semibold text-gray-700">First Name</label>
                        <input
                            value={firstName}
                            // ✅ FIX: Change bg-gray-50 to bg-white
                            className="input input-bordered w-full bg-white text-gray-800 focus:input-primary transition-shadow duration-300"
                            placeholder="Charles"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="label font-semibold text-gray-700">Last Name</label>
                        <input
                            value={lastName}
                            // ✅ FIX: Change bg-gray-50 to bg-white
                            className="input input-bordered w-full bg-white text-gray-800 focus:input-primary transition-shadow duration-300"
                            placeholder="Johnson"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div> </>
                }


                {/* Email Input */}
                <div className="mb-4">
                    <label className="label font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        value={emailId}
                        // ✅ FIX: Change bg-gray-50 to bg-white
                        className="input input-bordered w-full bg-white text-gray-800 focus:input-primary transition-shadow duration-300"
                        placeholder="your@email.com"
                        onChange={(e) => setEmailId(e.target.value)}
                        required
                    />
                </div>

                {/* Password Input with Eye Icon Toggle */}
                <div className="mb-6">
                    <label className="label font-semibold text-gray-700">Password</label>
                    <div className="join w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            // ✅ FIX: Change bg-gray-50 to bg-white
                            className="input input-bordered join-item w-full bg-white text-gray-800 focus:input-primary transition-shadow duration-300"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-square join-item btn-neutral"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {/* SVG icons */}
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.632-3.88a10 10 0 017.202 0m-8.2 8.2l-2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122zM12 12l2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <p className='text-error text-sm mb-4 p-2 bg-error/10 rounded-lg border border-error/30'>
                        {error}
                    </p>
                )}

                {/* Submit Button (Dynamic Text) */}
                <button
                    type="submit"
                    className={`btn btn-primary btn-lg w-full font-bold transition-all duration-300 ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : (isLoginForm ? 'Login' : 'Sign Up')}
                </button>

                {/* Toggle Link */}
                <div className='text-center mt-6'>
                    <p className='link link-hover text-primary font-medium' onClick={handleToggle}>
                        {isLoginForm ? "Don't have an account? Sign Up" : "Existing User? Login"}
                    </p>
                </div>

            </form>
        </div>
    );
};

export default Login;