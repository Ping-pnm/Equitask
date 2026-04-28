import express from 'express';
import GroupController from '../controllers/GroupController.js';

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

export default router;
