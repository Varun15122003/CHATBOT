// src/pages/ChatPage.jsx


import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ChatPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ backgroundColor: '#1e1e2f', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ textAlign: 'center', paddingTop: '20px', color: '#8d8dff' }}>Groq AI Chat</h1>
            <ChatWindow />
        </div>
    );
};

export default ChatPage;