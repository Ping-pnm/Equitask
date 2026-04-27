import express from 'express';
import ClassController from '../controllers/ClassController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/getall', ClassController.listClasses);

router.post('/create', ClassController.createClass);

router.get('/feed/:classId', ClassController.getStreamFeed);

router.post('/announce/:classId', upload.array('files'), ClassController.postAnnouncement);

router.get('/leaders/:classId', ClassController.getClassLeaders);

router.get('/members/:classId', ClassController.getClassMembers);

router.delete('/member/delete', ClassController.removeMember);

export default router;
