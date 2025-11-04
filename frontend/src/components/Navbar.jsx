// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.logo}>🤖 Groq Chatbot MERN</Link>
            <div style={styles.links}>
                {user ? (
                    <>
                        <span style={styles.username}>Hello, {user.username}</span>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#1e1e2f',
        color: 'white',
        borderBottom: '1px solid #3c3c5c'
    },
    logo: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#8d8dff',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
    },
    username: {
        marginRight: '15px',
        color: '#ffffff'
    },
    button: {
        padding: '8px 15px',
        backgroundColor: '#ff5c5c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default Navbar;
