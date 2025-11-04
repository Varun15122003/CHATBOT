// backend/routes/chat.route.js
const express = require('express');
const Groq = require('groq-sdk');
const { protect } = require('../middleware/auth.middleware');
const Chat = require('../models/Chat');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/chat/complete - Protected route
router.post('/complete', protect, async (req, res) => {
    const { message } = req.body;
    const userId = req.userId; // JWT से प्राप्त user ID

    if (!message) {
        return res.status(400).json({ message: 'Message content is required' });
    }

    try {
        // 1. Fetch chat history to maintain context
        let chat = await Chat.findOne({ userId });
        if (!chat) {
            // New user, create a new chat history
            chat = new Chat({ userId, messages: [] });
        }

        // Add the new user message to the messages array
        chat.messages.push({ role: 'user', content: message });
        
        // Prepare messages for Groq API (limit history to last 10 messages for brevity)
        const groqMessages = chat.messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // 2. Call Groq API for response
        const completion = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile",// आप अपनी पसंद का Groq model चुन सकते हैं
        });

        const assistantResponse = completion.choices[0].message.content;

        // 3. Save the assistant's response to history
        chat.messages.push({ role: 'assistant', content: assistantResponse });
        await chat.save();
        
        // 4. Send response back to frontend
        res.json({ reply: assistantResponse, history: chat.messages });

    } catch (error) {
        console.error('Groq API Error:', error);
        res.status(500).json({ message: 'Groq API failed to respond' });
    }
});

// GET /api/chat/history - Protected route to get history
router.get('/history', protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({ userId: req.userId });
        if (chat) {
            res.json(chat.messages);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
