// src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './Message';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/chat'; // Backend Chat API base URL

const ChatWindow = () => {
    // AuthContext से user info, token और logout function प्राप्त करें
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // ************* 1. History Fetching *************
    
    // Component mount होने पर chat history fetch करें
    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        setLoading(true);
        // सुनिश्चित करें कि user logged in है
        if (!user || !user.token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/history`, {
                headers: {
                    // JWT को Bearer Token के रूप में भेजें
                    'Authorization': `Bearer ${user.token}` 
                }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
            // 401 error होने पर logout करें (token expired/invalid)
            if (error.response && error.response.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // ************* 2. Scroll Logic *************
    
    // messages update होने पर scroll bottom में करें
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ************* 3. Message Sending Logic *************

    const handleSend = async (e) => {
        e.preventDefault();
        // validation checks
        if (!input.trim() || loading || !user) return;

        const userMessage = { role: 'user', content: input };
        
        // UI को तुरंत update करें (optimistic update)
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // JWT के साथ Groq API को कॉल करना
        try {
            const res = await axios.post(`${API_URL}/complete`, 
                { message: userMessage.content }, 
                {
                    headers: {
                        // JWT को Bearer Token के रूप में भेजें
                        'Authorization': `Bearer ${user.token}` 
                    }
                }
            );
            
            // Backend से मिली पूरी history से state update करें
            setMessages(res.data.history); 
            
        } catch (error) {
            console.error('Chat completion failed:', error);
            
            // Unauthorized error (401) पर Logout/Redirect करें
            if (error.response && error.response.status === 401) {
                logout();
                navigate('/login');
            }
            // Error message display करें
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    // ************* 4. Styles and JSX *************
    
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '85vh',
            maxWidth: '800px',
            margin: '20px auto',
            border: '1px solid #3c3c5c',
            borderRadius: '10px',
            backgroundColor: '#282c3f',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        },
        messageArea: {
            flexGrow: 1,
            overflowY: 'auto',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
        },
        inputArea: {
            padding: '15px',
            borderTop: '1px solid #3c3c5c',
            display: 'flex',
            backgroundColor: '#1e1e2f',
        },
        inputField: {
            flexGrow: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #5c5c8d',
            marginRight: '10px',
            backgroundColor: '#3c3c5c',
            color: 'white',
        },
        sendButton: {
            padding: '10px 20px',
            backgroundColor: loading ? '#5c5c8d' : '#8d8dff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: loading || !user ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.messageArea}>
                {loading && messages.length === 0 ? (
                    <p style={{ color: '#ffffff80', textAlign: 'center' }}>Loading chat history...</p>
                ) : (
                    messages.map((msg, index) => <Message key={index} message={msg} />)
                )}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={user ? "Type your message..." : "Please log in to chat."}
                    disabled={loading || !user}
                    style={styles.inputField}
                />
                <button type="submit" disabled={loading || !user} style={styles.sendButton}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;