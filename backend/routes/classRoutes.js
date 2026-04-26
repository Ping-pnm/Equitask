import express from 'express';
import ClassController from '../controllers/ClassController.js';

const router = express.Router();

router.get('/getall', ClassController.listClasses);

router.post('/create', ClassController.createClass);

router.get('/feed/:classId', ClassController.getStreamFeed);

export default router;
