import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//import route
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import workRoutes from './routes/workRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/work', workRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/task', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});