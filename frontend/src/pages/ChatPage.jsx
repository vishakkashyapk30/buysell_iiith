import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatService } from '../services/ChatServices';
import Navbar from '../components/Navbar';
import { IoMdSend } from 'react-icons/io';

const ChatPage = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { messages, addMessage, sessionId } = useChat();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user', timestamp: new Date() };
        addMessage(userMessage);
        setInput('');
        setLoading(true);

        const result = await ChatService.sendMessage(input, messages);
        
        const botMessage = {
            text: result.success ? result.message : 'Sorry, I encountered an error.',
            sender: 'bot',
            timestamp: new Date()
        };
        addMessage(botMessage);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#8BDAFF] to-[#38d0f7]">
            <Navbar />
            <div className="container mx-auto px-4 py-8 h-[calc(100vh-100px)]">
                <div className="bg-white rounded-[20px] p-6 h-full flex flex-col shadow-2xl">
                    <h1 className="text-[32px] font-bold text-[#023047] mb-6 text-center">
                        AI Support Assistant
                    </h1>
                    
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-[15px] p-4 shadow-md
                                        ${msg.sender === 'user'
                                            ? 'bg-[#219EBC] text-white rounded-tr-none'
                                            : 'bg-[#F8F9FA] text-black rounded-tl-none'
                                        }`}
                                >
                                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                    <span className="text-[11px] opacity-70 block mt-2">
                                        {msg.timestamp.toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#F8F9FA] rounded-[15px] p-4 shadow-md rounded-tl-none">
                                    <div className="typing-indicator flex gap-2">
                                        <span className="w-2 h-2 bg-[#219EBC] rounded-full"></span>
                                        <span className="w-2 h-2 bg-[#219EBC] rounded-full"></span>
                                        <span className="w-2 h-2 bg-[#219EBC] rounded-full"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex gap-3 p-3 bg-[#F8F9FA] rounded-[15px] shadow-inner">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 p-4 rounded-[12px] bg-white focus:outline-none text-black shadow-sm border border-gray-100"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="p-4 bg-[#219EBC] text-white rounded-[12px] hover:bg-opacity-90 disabled:opacity-50 transition-all duration-200 shadow-sm"
                        >
                            <IoMdSend size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;