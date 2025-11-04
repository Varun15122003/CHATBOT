// src/components/Message.jsx

import React from 'react';

const Message = ({ message }) => {
    const isUser = message.role === 'user';
    
    const messageStyle = {
        padding: '10px 15px',
        borderRadius: '15px',
        maxWidth: '70%',
        margin: '10px',
        wordWrap: 'break-word',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
    };

    const userStyle = {
        ...messageStyle,
        backgroundColor: '#8d8dff', // Purple color for user
        color: 'white',
        borderBottomRightRadius: '2px',
    };

    const assistantStyle = {
        ...messageStyle,
        backgroundColor: '#3c3c5c', // Dark gray for assistant
        color: 'white',
        borderBottomLeftRadius: '2px',
    };

    return (
        <div style={containerStyle}>
            <div style={isUser ? userStyle : assistantStyle}>
                <p>{message.content}</p>
            </div>
        </div>
    );
};

export default Message;