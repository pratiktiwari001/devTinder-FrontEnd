import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("pratik@gmail.com");
  const [password, setPassword] = useState("Kl@rahul123");
  const [error, setError] = useState("")


  const handleLogin = async () => {
    if (!emailId || !password) {
    alert("Please enter both email and password.");
    return;
  }
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailID: emailId,
        password,
      },{
        withCredentials: true
      });
      dispatch(addUser(res.data));
      return navigate("/")
    }
    catch (error) {
      setError(error?.response?.data || "Something went wrong")
    }
  };

  return (
    <div className='flex justify-center my-45'>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input type="email"
          value={emailId}
          className="input"
          placeholder="Email"
          onChange={(e) => setEmailId(e.target.value)} />

        <label className="label">Password</label>
        <input type="password"
          value={password}
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />
        <p className='text-red-500'>{error}</p>
        <button className="btn btn-neutral mt-4" onClick={handleLogin}>Login</button>
      </fieldset>
    </div>
  )
}

export default Login