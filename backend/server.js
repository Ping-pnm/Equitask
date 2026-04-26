import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//import route
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/class', classRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});