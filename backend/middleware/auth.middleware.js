// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // JWT को आम तौर पर Authorization header से प्राप्त किया जाता है
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user ID to request (अगली route के लिए)
            req.userId = decoded.id; 
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };