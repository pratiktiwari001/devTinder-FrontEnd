import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const Login = () => {
  const [emailId, setEmailId] = useState('pratik@gmail.com');
  const [password, setPassword] = useState('Kl@rahul123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 💡 New State: To control password visibility (true = text, false = password)
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    if (!emailId || !password) {
      setError('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      // NOTE: I'm keeping your original payload key 'emailID' as per the provided code.
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailID: emailId, password },
        { withCredentials: true }
      );

      const userData = res?.data?.user || res?.data;

      if (userData) {
        dispatch(addUser(userData));
        navigate("/");
      } else {
        setError('Login failed. Received empty user data.');
      }

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid credentials or server error.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to toggle the showPassword state
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 p-4'>
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition-all duration-500 hover:scale-[1.01]">

        <h1 className="text-4xl font-extrabold text-center text-primary mb-2">
          DevTinder
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Sign in to connect with developers.
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="label font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={emailId}
            className="input input-bordered w-full bg-gray-50 text-gray-800 focus:input-primary transition-shadow duration-300"
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
            className="input input-bordered join-item w-full bg-gray-50 text-gray-800 focus:input-primary transition-shadow duration-300"
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
            {/* ✅ FIX: Using standardized, robust SVG paths for clean toggle */}
            {showPassword ? (
                // Eye-slash icon (HIDE)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.632-3.88a10 10 0 017.202 0m-8.2 8.2l-2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122zM12 12l2.83 2.83m.35-.35a1.5 1.5 0 00-2.122 2.122l2.122-2.122z" />
                </svg>
            ) : (
                // Eye icon (SHOW)
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

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-primary btn-lg w-full font-bold transition-all duration-300 ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging In...' : 'Login'}
        </button>

        {/* Optional: Link to Register */}
        <div className='text-center mt-6'>
          <Link to="/register" className='link link-hover text-primary font-medium'>
            Don't have an account? Register
          </Link>
        </div>

      </form>
    </div>
  );
};

export default Login;