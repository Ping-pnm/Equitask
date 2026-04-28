import express from 'express';
import TaskController from '../controllers/TaskController.js';

const router = express.Router();

router.post('/create', TaskController.createTask);
router.get('/group/:groupId/:assignmentId', TaskController.getGroupTasks);

export default router;
