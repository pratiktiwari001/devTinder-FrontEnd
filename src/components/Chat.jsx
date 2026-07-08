import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const dummyMessages = [
    { id: 1, sender: 'other', text: "Hey! Saw your profile. Great skills!", timestamp: "10:00 AM" },
    { id: 2, sender: 'user', text: "Thanks! What are you working on these days?", timestamp: "10:02 AM" },
    { id: 3, sender: 'other', text: "I'm looking for a collaborator on a new AI project. Interested?", timestamp: "10:05 AM" },
    { id: 4, sender: 'user', text: "Definitely! Send over the details.", timestamp: "10:06 AM" },
    { id: 5, sender: 'other', text: "We need more messages to test the scroll function, so here's a placeholder.", timestamp: "10:07 AM" },
    { id: 6, sender: 'user', text: "Adding more content to ensure the message area scrolls correctly and doesn't push the whole page.", timestamp: "10:08 AM" },
    { id: 7, sender: 'other', text: "Final message to test clearance.", timestamp: "10:09 AM" },
    { id: 8, sender: 'user', text: "Great, this new UI looks much cleaner and professional!", timestamp: "10:10 AM" },
];

// Assuming 64px Navbar + 64px Footer = 128px total fixed height.
const CHAT_VERTICAL_OFFSET = '128px';

const Chat = () => {
    const { targetUserId } = useParams();
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const userName = location.state?.userName ?? 'Unknown User';

    const [messages, setMessages] = useState(dummyMessages); 
    const [newMessage, setNewMessage] = useState('');
    const user = useSelector((store) => store.user);
    // Use targetUserName for the chat header
    const targetUserName = location.state?.userName ?? 'Unknown User'; 
    const userId = user?._id;
    // Use the current user's name for sent messages
    const currentUserName = user?.firstName ?? 'You';

    useEffect(() => {
        if (!userId) {
            return;
        }
        const socket = createSocketConnection();

        socket.emit("joinChat", { userId, targetUserId });

        socket.on("messageReceived", (msg) => {
            // 🌟 CHANGE 2: Check if the message is from the current user or the other user
            const senderType = (msg.userId === userId) ? 'user' : 'other'; 
            
            console.log(msg.firstName + " : " + msg.text);
            setMessages((messages) => [...messages, {
                // Ensure all fields expected by MessageBubble are present
                id: Math.random(), // Use unique ID for key
                sender: senderType, // Set sender type based on ID
                text: msg.text,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
            }]);
        });

        return () => {
            socket.disconnect();
        }
    }, [userId, targetUserId]);

    useEffect(() => {
        // Logics are fine.
    }, [targetUserId, userName]);

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
            firstName: currentUserName, // Use current user's name for socket emit
            userId,
            targetUserId,
            text: newMessage,
            id: uniqueId,
        };

        socket.emit("sendMessage", messageToSend);

        // 🌟 CHANGE 3: Add 'sender: user' and a timestamp to the message for local display
        const localMessage = {
            ...messageToSend,
            sender: 'user', // Explicitly mark as sent by current user
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages([...messages, localMessage]);
        setNewMessage('');
    }
const MessageBubble = ({ sender, text, timestamp }) => {
        const isUser = sender === 'user'; // This is the key check!

        // Aligns the entire message container left or right
        const containerClasses = isUser ? 'self-end' : 'self-start';

        // Styles for the bubble itself
        const bubbleClasses = isUser
            ? 'bg-blue-500 text-white rounded-tr-none shadow-md' // Blue/White: User/Sent
            : 'bg-gray-100 text-gray-800 rounded-tl-none shadow-sm'; // No top-left corner on incoming message

        // Fix contrast: Incoming timestamp is darker gray for better contrast
        const timeClasses = isUser ? 'text-blue-200 text-right' : 'text-gray-700 text-left';


        return (
            <div className={`flex w-full ${containerClasses}`}>
                {/* Reduced vertical padding (py-2.5) for compactness */}
                <div className={`max-w-xs md:max-w-md p-3 py-2.5 my-1 rounded-xl ${bubbleClasses}`}>
                    {/* Use leading-normal for better text wrapping */}
                    <p className="text-sm break-words leading-normal">{text}</p>
                    <span className={`text-[10px] mt-1 block ${timeClasses}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        );
    };

    return (
        // 🌟 BEST UI: Use a modern background color for the overall screen area
        // ... (Outer Container)
        <div className="w-full h-full ">
            {/* 1. Outer Container: Fixed total height, centered. */}
            <div className={`flex flex-col h-[calc(100vh-${CHAT_VERTICAL_OFFSET})] max-w-4xl mx-auto bg-white rounded-none md:rounded-lg shadow-2xl md:my-4 overflow-hidden`}>

                {/* Header: Cleaner, slightly lighter dark theme */}
                <div className="p-4 bg-gray-700 text-white shadow-xl flex items-center">
                    <h2 className="text-xl font-medium tracking-wide">
                        💬 Chatting with: **{targetUserName}** {/* 🌟 CHANGE 4: Use targetUserName */}
                    </h2>
                </div>

                {/* 2. Message Area: Clean, subtle background */}
                <div className="flex-1 p-4 flex flex-col space-y-3 overflow-y-auto bg-white">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} {...msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Box: Enhanced styling for a floating feel */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Type a message...`}
                        className="
                            flex-1 p-3 
                            border-2 border-gray-300 hover:border-blue-400 
                            bg-white 
                            rounded-full 
                            focus:outline-none focus:ring-4 focus:ring-blue-100 
                            text-gray-800 
                            transition-all duration-200
                        "
                    />

                    <button
                        type="submit"
                        disabled={newMessage.trim() === ''}
                        // onClick={handleSendMessage}
                        className="
                            bg-blue-600 hover:bg-blue-700 text-white 
                            font-semibold py-3 px-6 
                            rounded-full 
                            transition-all duration-300 
                            shadow-lg hover:shadow-xl 
                            transform hover:scale-[1.02]
                            disabled:bg-gray-400 disabled:shadow-none 
                            flex items-center space-x-2
                        "
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                        <span>Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;