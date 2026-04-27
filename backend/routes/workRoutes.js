import express from 'express';
import WorkController from '../controllers/WorkController.js';

const router = express.Router();

router.get('/feed/:classId', WorkController.getWorkFeed);

export default router;
