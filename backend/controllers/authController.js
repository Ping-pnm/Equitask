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
    }
};

export default authController;