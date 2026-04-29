import express from 'express';
import WorkController from '../controllers/WorkController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/feed/:classId', WorkController.getWorkFeed);
router.get('/:assignmentId', WorkController.getAssignment);
router.post('/assign', upload.array('files'), WorkController.assignWork);
router.put('/:assignmentId', upload.array('files'), WorkController.updateWork);
router.delete('/:assignmentId', WorkController.deleteWork);

// Individual Submission Routes
router.post('/upload', upload.array('files'), WorkController.uploadIndividualFile);
router.delete('/file/:fileId', WorkController.deleteIndividualFile);
router.post('/submit', WorkController.submitIndividualWork);
router.get('/submissions/:assignmentId', WorkController.getIndividualSubmissions);
router.post('/grade', WorkController.gradeIndividualWork);

export default router;
