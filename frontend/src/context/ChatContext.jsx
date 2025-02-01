import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    const addMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    const clearSession = () => {
        setMessages([]);
        setSessionId(Date.now().toString());
    };

    return (
        <ChatContext.Provider value={{ messages, addMessage, clearSession, sessionId }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);