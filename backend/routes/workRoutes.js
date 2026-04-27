import express from 'express';
import WorkController from '../controllers/WorkController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/feed/:classId', WorkController.getWorkFeed);
router.post('/assign', upload.array('files'), WorkController.assignWork);

export default router;
