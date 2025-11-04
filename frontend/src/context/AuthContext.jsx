// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// const API_URL = 'http://localhost:5000/api/auth'; // Backend Auth URL
const API_URL = 'https://chatbot-backend.vercel.app/api/auth'; // Backend Auth URL

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on initial load
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setUser({ username, token });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            const { token, username: userFromAPI } = res.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('username', userFromAPI);
            setUser({ username: userFromAPI, token });
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const res = await axios.post(`${API_URL}/register`, { username, password });
            const { token, username: userFromAPI } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', userFromAPI);
            setUser({ username: userFromAPI, token });
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);