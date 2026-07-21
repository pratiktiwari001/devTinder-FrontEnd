import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const dummyMessages = [
    { id: 1, sender: 'other', text: "Hey! Saw your profile. Great skills!", timestamp: "10:00 AM" },
    { id: 2, sender: 'user', text: "Thanks! What are you working on these days?", timestamp: "10:02 AM" },
    { id: 3, sender: 'other', text: "I'm looking for a collaborator on a new AI project. Interested?", timestamp: "10:05 AM" },
    { id: 4, sender: 'user', text: "Definitely! Send over the details.", timestamp: "10:06 AM" },
];

const Chat = () => {
    const { targetUserId } = useParams();
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState(dummyMessages); 
    const [newMessage, setNewMessage] = useState('');
    const user = useSelector((store) => store.user);
    
    const targetUserName = location.state?.userName ?? 'Unknown User'; 
    const userId = user?._id;
    const currentUserName = user?.firstName ?? 'You';

    useEffect(() => {
        if (!userId) {
            return;
        }
        const socket = createSocketConnection();

        socket.emit("joinChat", { userId, targetUserId });

        socket.on("messageReceived", (msg) => {
            // 🚀 FIX 1: Prevent the double-message "Echo" bug.
            // If the server echoes our own message back to us, ignore it, 
            // because we already added it locally when we clicked "Send".
            if (msg.userId === userId) {
                return; 
            }
            
            console.log(msg.firstName + " : " + msg.text);
            
            setMessages((messages) => [...messages, {
                id: Math.random(), 
                sender: 'other', // We know it's from the other person now
                text: msg.text,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
            }]);
        });

        return () => {
            socket.disconnect();
        }
    }, [userId, targetUserId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const uniqueId = Math.random();
        if (newMessage.trim() === '') return;

        const socket = createSocketConnection();
        const messageToSend = {
            firstName: currentUserName, 
            userId,
            targetUserId,
            text: newMessage,
            id: uniqueId,
        };

        // Send to server
        socket.emit("sendMessage", messageToSend);

        // Add to our screen immediately
        const localMessage = {
            ...messageToSend,
            sender: 'user', 
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages([...messages, localMessage]);
        setNewMessage('');
    }

    // 🎨 Premium Message Bubble Component
    const MessageBubble = ({ sender, text, timestamp }) => {
        const isUser = sender === 'user';
        const containerClasses = isUser ? 'justify-end' : 'justify-start';

        const bubbleClasses = isUser
            ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20' 
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm shadow-slate-200/50 dark:shadow-black/20'; 

        const timeClasses = isUser ? 'text-blue-200 text-right' : 'text-slate-400 dark:text-slate-500 text-left';

        return (
            <div className={`flex w-full ${containerClasses} mb-1 transition-colors duration-500`}>
                <div className={`max-w-[85%] md:max-w-[75%] p-3.5 py-2.5 rounded-2xl ${bubbleClasses}`}>
                    <p className="text-[15px] break-words leading-relaxed font-medium">{text}</p>
                    <span className={`text-[10px] mt-1.5 block font-semibold tracking-wide ${timeClasses}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        );
    };

    return (
        // 🚀 FIX 2: Strict height wrapper (calc 100vh - 150px)
        // This calculates the exact remaining space between your Navbar and Footer,
        // locking the chat box height so the whole page doesn't scroll!
        <div 
            className="w-full flex justify-center p-2 sm:p-4 md:p-6 transition-colors duration-500"
            style={{ height: 'calc(100vh - 150px)' }}
        >
            
            {/* Chat App Window Container -> Now strictly taking 100% of the calculated height above */}
            <div className="flex flex-col w-full max-w-4xl h-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/60 border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-500">

                {/* Premium Header */}
                <div className="p-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 z-10 transition-colors duration-500 shadow-sm shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shrink-0 transition-colors duration-500">
                        <span className="text-2xl">👤</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-wide leading-tight transition-colors duration-500">
                            {targetUserName}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Online</span>
                        </div>
                    </div>
                </div>

                {/* Chat Canvas Area -> Using flex-1 to push the input down and overflow-y-auto to scroll internally */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 transition-colors duration-500 scroll-smooth">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} {...msg} />
                    ))}
                    <div ref={messagesEndRef} className="h-2 shrink-0" />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-end space-x-2 sm:space-x-3 transition-colors duration-500 shrink-0">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${targetUserName.split(' ')[0]}...`}
                        className="
                            flex-1 p-3.5 px-5 
                            border border-slate-200 dark:border-slate-700 
                            hover:border-blue-400 dark:hover:border-blue-500 
                            bg-slate-50 dark:bg-slate-800 
                            rounded-full 
                            focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-600/20 
                            text-slate-800 dark:text-slate-100 font-medium
                            placeholder-slate-400 dark:placeholder-slate-500
                            transition-all duration-300
                        "
                    />

                    <button
                        type="submit"
                        disabled={newMessage.trim() === ''}
                        className="
                            h-[52px] px-6
                            bg-blue-600 hover:bg-blue-700 text-white 
                            font-bold rounded-full 
                            shadow-md shadow-blue-600/20 dark:shadow-blue-900/40 hover:shadow-lg hover:shadow-blue-600/40 
                            transition-all duration-300 transform active:scale-95
                            disabled:bg-slate-200 dark:disabled:bg-slate-800 
                            disabled:text-slate-400 dark:disabled:text-slate-600 
                            disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed
                            flex items-center justify-center space-x-2 shrink-0
                        "
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;