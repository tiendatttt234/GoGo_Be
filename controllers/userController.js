import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// create new User (admin only)
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user with role
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // Default to 'user' if role is not specified
        })

        const savedUser = await newUser.save()

        // Remove password from response
        const { password: _, ...userWithoutPassword } = savedUser._doc

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: userWithoutPassword
        })
    } catch (err) {
        console.error('Error in createUser:', err)
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: err.message
        })
    }
}

// update User
export const updateUser = async (req, res) => {
    const id = req.params.id

    try {
        let updateData = { ...req.body }

        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(updateData.password, salt)
        } else {
            // If password is empty, remove it from update data
            delete updateData.password
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: 'Successfully updated user',
            data: updatedUser
        })
    } catch (err) {
        console.error('Error in updateUser:', err)
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: err.message
        })
    }
}

// delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id

    try {
        const deletedUser = await User.findByIdAndDelete(id)
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: 'Successfully deleted user'
        })
    } catch (err) {
        console.error('Error in deleteUser:', err)
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: err.message
        })
    }
}

// getSingle User
export const getSingleUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id).select('-password')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: 'User found',
            data: user
        })
    } catch (err) {
        console.error('Error in getSingleUser:', err)
        res.status(404).json({
            success: false,
            message: "User not found",
            error: err.message
        })
    }
}

// getAllUser User 
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password')

        res.status(200).json({
            success: true,
            message: 'Users found',
            data: users
        })
    } catch (err) {
        console.error('Error in getAllUser:', err)
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: err.message
        })
    }
}

// Get user count (public route)
export const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({
            success: true,
            data: userCount
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user count",
            error: err.message
        });
    }
};

export default {
    createUser,
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUser,
    getUserCount
}
