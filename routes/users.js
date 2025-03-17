import express from 'express';
import { 
    updateUser, 
    deleteUser, 
    getSingleUser, 
    getAllUser,
    createUser,
    getUserCount
} from '../controllers/userController.js';
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Debug middleware
const debugMiddleware = (req, res, next) => {
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request Cookies:', req.cookies);
    next();
};

// Get user count
router.get('/count', getUserCount);

// Create user (admin only)
router.post('/', debugMiddleware, verifyAdmin, createUser);

// Update user
router.put('/:id', verifyAdmin, updateUser);

// Delete user
router.delete('/:id', verifyAdmin, deleteUser);

// Get single user
router.get('/:id', verifyUser, getSingleUser);

// Get all users
router.get('/', verifyAdmin, getAllUser);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default router;
