import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    console.log('Verifying token...');
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);

    // Check for token in cookies or Authorization header
    let token = req.cookies.accessToken;
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded);
        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const verifyUser = (req, res, next) => {
    console.log('Verifying user...');
    verifyToken(req, res, () => {
        if (req.user) {
            console.log('User verified');
            next();
        } else {
            console.log('User verification failed');
            return res.status(401).json({
                success: false, 
                message: 'You are not authenticated'
            });
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    console.log('Verifying admin...');
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            console.log('Admin verified');
            next();
        } else {
            console.log('Admin verification failed');
            return res.status(401).json({
                success: false, 
                message: 'Admin privileges required'
            });
        }
    });
};

export default verifyToken;
