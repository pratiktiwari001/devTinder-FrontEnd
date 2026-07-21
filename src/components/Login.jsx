import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const Login = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

            if (userData) {
                dispatch(addUser(userData));
                if (isLoginForm) navigate("/"); 
                else navigate("/profile"); 
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

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    
    const switchMode = (mode) => {
        setIsLoginForm(mode);
        setError('');
        setFirstName('');
        setLastName('');
    };

    return (
        <div className="flex-grow flex justify-center items-center w-full h-full py-8 px-4 sm:px-6 lg:px-8">
            {/* Added dark mode card styling */}
            <form onSubmit={handleAuth} className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 w-full max-w-md border border-slate-100 dark:border-slate-800 transform transition-all duration-500 hover:-translate-y-1">
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mb-2">
                        DevTinder
                    </h1>
                    {/* Added dark text coloring */}
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {isLoginForm ? "Welcome back! Log in to connect." : "Join the developer community today."}
                    </p>
                </div>

                {/* Added dark mode for the toggle pill */}
                <div className="relative flex w-full p-1 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-8 border border-slate-200 dark:border-slate-700/50">
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isLoginForm ? 'translate-x-0' : 'translate-x-full'}`}
                    ></div>
                    <button
                        type="button"
                        onClick={() => switchMode(true)}
                        className={`relative flex-1 py-2.5 text-sm font-bold rounded-full transition-colors duration-300 z-10 ${isLoginForm ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode(false)}
                        className={`relative flex-1 py-2.5 text-sm font-bold rounded-full transition-colors duration-300 z-10 ${!isLoginForm ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="space-y-5">
                    <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ease-in-out overflow-hidden ${isLoginForm ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                            {/* Added dark mode to inputs */}
                            <input
                                value={firstName}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="Charles"
                                onChange={(e) => setFirstName(e.target.value)}
                                required={!isLoginForm}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                            <input
                                value={lastName}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                                placeholder="Johnson"
                                onChange={(e) => setLastName(e.target.value)}
                                required={!isLoginForm}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={emailId}
                            className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300"
                            placeholder="your@email.com"
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                        <div className="relative flex items-center w-full">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                className="input input-bordered w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300 pr-12"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none outline-none"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.632-3.88a10 10 0 017.202 0m-8.2 8.2l-2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122zM12 12l2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full font-bold text-base mt-8 bg-blue-600 border-none text-white hover:bg-blue-700 transition-all duration-300 shadow-md shadow-blue-600/20 ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : (isLoginForm ? 'Sign In' : 'Create Account')}
                </button>
            </form>
        </div>
    );
};

export default Login;