import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const ChatService = {
    async sendMessage(message, context = []) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Format chat history properly
            const history = context.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const chat = model.startChat({
                history: history
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;

            return {
                success: true,
                message: response.text()
            };
        } catch (error) {
            console.error('Chat error:', error);
            return {
                success: false,
                message: 'Failed to get response from AI'
            };
        }
    }
};