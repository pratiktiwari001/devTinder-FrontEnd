import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);

    useEffect(() => {
        const fetchUser = async () => {
            if (userData) return;
            
            try {
                const res = await axios.get(BASE_URL + "/profile/view", {
                    withCredentials: true,
                });
                dispatch(addUser(res.data));
            } catch (err) {
                // Safely check error status (handling both err.status and err.response.status)
                if (err.response?.status === 401 || err.status === 401) {
                    navigate("/login");
                }
                console.error("Authentication check failed:", err);
            }
        };

        fetchUser();
    }, [dispatch, navigate, userData]);

    return (
        // 🚀 Added dark mode classes and a smooth 500ms transition
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-200 selection:text-blue-900 transition-colors duration-500">
            
            <Navbar />
            
            {/* flex-grow takes up all remaining middle space, pushing the Footer to the absolute bottom */}
            <main className="flex-grow flex flex-col w-full">
                <Outlet />
            </main>
            
            <Footer />
            
        </div>
    );
};

export default Body;