import express from 'express';
import GroupController from '../controllers/GroupController.js';

const router = express.Router();

router.get('/members/:classId/:assignmentId', GroupController.getClassMembersWithGroupStatus);
router.post('/create', GroupController.createGroup);
router.get('/user/:userId/:assignmentId', GroupController.getGroupForUser);
router.delete('/:groupId', GroupController.deleteGroup);
router.get('/all/:assignmentId', GroupController.getAllGroupsForAssignment);

export default router;
