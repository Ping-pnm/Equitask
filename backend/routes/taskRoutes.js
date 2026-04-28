import express from 'express';
import TaskController from '../controllers/TaskController.js';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create', TaskController.createTask);
router.get('/group/:groupId/:assignmentId', TaskController.getGroupTasks);
router.get('/:taskId', TaskController.getTaskDetail);
router.post('/:taskId/upload', upload.array('files'), TaskController.uploadWork);
router.delete('/work-file/:fileId', TaskController.deleteTaskFile);
router.post('/:taskId/submit', TaskController.submitWork);

export default router;
