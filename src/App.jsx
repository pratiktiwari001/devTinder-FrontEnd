import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Request from "./components/Request";
import Chat from "./components/Chat";

// 🚀 Premium 404 Fallback Component (Supports Light/Dark Mode)
const NotFound = () => (
    <div className="flex-grow flex flex-col items-center justify-center w-full h-full text-center px-4 py-20 transition-colors duration-500">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-lg mb-4 transition-colors">
            404
        </h1>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
            Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium transition-colors">
            Oops! The page you're looking for doesn't exist, has been moved, or you don't have access to it.
        </p>
        <Link 
            to="/" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 hover:shadow-blue-600/50 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Return Home
        </Link>
    </div>
);

function App() {
    return (
        <Provider store={appStore}>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<Body />}>
                        {/* 'index' replaces path="/" for the default child route */}
                        <Route index element={<Feed />} />
                        <Route path="login" element={<Login />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="connections" element={<Connections />} />
                        <Route path="requests" element={<Request />} />
                        <Route path="chat/:targetUserId" element={<Chat />} />
                        
                        {/* 404 Catch-All Route */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;