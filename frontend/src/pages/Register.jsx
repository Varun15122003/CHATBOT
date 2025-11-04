// src/pages/Register.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        const success = await register(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed. Username might be taken.');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Register for Chatbot</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Register</button>
                <p style={styles.linkText}>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '30px',
        backgroundColor: '#282c3f',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        width: '350px',
        color: 'white',
    },
    input: {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #5c5c8d',
        backgroundColor: '#3c3c5c',
        color: 'white',
    },
    button: {
        padding: '12px',
        backgroundColor: '#8d8dff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    error: {
        color: '#ff5c5c',
        textAlign: 'center',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '10px',
        color: '#ffffff80',
    },
    link: {
        color: '#8d8dff',
        textDecoration: 'none',
    }
};

export default Register;