import express from 'express';
import ClassController from '../controllers/ClassController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/getall', ClassController.listClasses);

router.post('/create', ClassController.createClass);

router.get('/feed/:classId', ClassController.getStreamFeed);

// Changed to accept multiple files with the field name 'files'
router.post('/announce/:classId', upload.array('files'), ClassController.postAnnouncement);

export default router;
