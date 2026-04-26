import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';

const authController = {
    registerUser: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Email is already in use" });
            }

            const passwordHash = await bcrypt.hash(password, 10); // Changed 15 to 10 for better performance

            const newUserId = await UserModel.createUser(firstName, lastName, email, passwordHash);

            res.status(201).json({ message: "User registered successfully", userId: newUserId });
        } catch (err) {
            console.error("Register Error:", err);
            res.status(500).json({ message: "Server error during registration" });
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: "Invalid email" });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            console.log("Database user found:", user);

            res.status(200).json({ 
                message: "Login successful", 
                user: { 
                    id: user.userId, // Support both naming conventions
                    email: user.email 
                } 
            });
        } catch (err) {
            console.error("FULL LOGIN ERROR:", err);
            res.status(500).json({ message: "Server error during login", details: err.message });
        }
    }
};

export default authController;