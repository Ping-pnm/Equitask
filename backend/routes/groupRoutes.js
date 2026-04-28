import express from 'express';
import GroupController from '../controllers/GroupController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/members/:classId/:assignmentId', GroupController.getClassMembersWithGroupStatus);
router.post('/create', GroupController.createGroup);
router.get('/user/:userId/:assignmentId', GroupController.getGroupForUser);
router.delete('/:groupId', GroupController.deleteGroup);
router.get('/all/:assignmentId', GroupController.getAllGroupsForAssignment);
router.get('/:groupId', GroupController.getGroupById);
router.put('/:groupId', GroupController.updateGroup);
router.get('/:groupId/comments', GroupController.getGroupComments);
router.post('/:groupId/comments', GroupController.addGroupComment);
router.post('/:groupId/track-meet', GroupController.trackMeetJoin);
router.get('/:groupId/track-meet', GroupController.getMeetTracking);

// Group Work Submission Routes
router.post('/:groupId/upload', upload.array('files'), GroupController.uploadWork);
router.delete('/work-file/:fileId', GroupController.deleteWorkFile);
router.post('/:groupId/submit', GroupController.submitWork);

export default router;
