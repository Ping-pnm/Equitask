import express from 'express';
import WorkController from '../controllers/WorkController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/feed/:classId', WorkController.getWorkFeed);
router.get('/:assignmentId', WorkController.getAssignment);
router.post('/assign', upload.array('files'), WorkController.assignWork);
router.put('/:assignmentId', upload.array('files'), WorkController.updateWork);
router.delete('/:assignmentId', WorkController.deleteWork);

export default router;
