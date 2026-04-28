import GroupModel from "../models/GroupModel.js";

const GroupController = {
    getClassMembersWithGroupStatus: async (req, res) => {
        try {
            const { classId, assignmentId } = req.params;
            const members = await GroupModel.getClassMembersWithGroupStatus(classId, assignmentId);
            res.status(200).json(members);
        } catch (err) {
            console.error("GroupController.getMembersForAssignment Error:", err);
            res.status(500).json({ message: "Error fetching members" });
        }
    },

    createGroup: async (req, res) => {
        try {
            const { groupName, assignmentId, creatorId, classId, meetLink, memberIds } = req.body;

            if (!groupName || !assignmentId || !creatorId || !classId) {
                return res.status(400).json({ message: "Group name, Assignment ID, Class ID, and Creator ID are required" });
            }

            // Check if creator is already in a group
            const creatorInGroup = await GroupModel.checkUserHasGroup(creatorId, assignmentId);
            if (creatorInGroup) {
                return res.status(400).json({ message: "You are already in a group for this assignment." });
            }

            // Check if any of the added members are already in a group
            for (const userId of memberIds) {
                const inGroup = await GroupModel.checkUserHasGroup(userId, assignmentId);
                if (inGroup) {
                    return res.status(400).json({ message: `One or more selected members are already in a group.` });
                }
            }

            await GroupModel.createGroup(groupName, assignmentId, creatorId, classId, meetLink, memberIds);
            res.status(201).json({ message: "Group created successfully" });
        } catch (err) {
            console.error("GroupController.createGroup Error:", err);
            res.status(500).json({ message: "Error creating group" });
        }
    },

    getGroupForUser: async (req, res) => {
        try {
            const { userId, assignmentId } = req.params;
            const group = await GroupModel.getGroupForUser(userId, assignmentId);
            res.status(200).json(group);
        } catch (err) {
            console.error("GroupController.getGroupForUser Error:", err);
            res.status(500).json({ message: "Error fetching user group" });
        }
    },

    getAllGroupsForAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const rows = await GroupModel.getAllGroupsForAssignment(assignmentId);
            
            // Group the rows by groupId
            const groupsMap = new Map();
            rows.forEach(row => {
                if (!groupsMap.has(row.groupId)) {
                    groupsMap.set(row.groupId, {
                        groupId: row.groupId,
                        groupName: row.groupName,
                        assignmentId: row.assignmentId,
                        classId: row.classId,
                        meetLink: row.meetLink,
                        createdAt: row.createdAt,
                        members: []
                    });
                }
                if (row.userId) {
                    groupsMap.get(row.groupId).members.push({
                        userId: row.userId,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email
                    });
                }
            });

            res.status(200).json(Array.from(groupsMap.values()));
        } catch (err) {
            console.error("GroupController.getAllGroupsForAssignment Error:", err);
            res.status(500).json({ message: "Error fetching all groups" });
        }
    },

    deleteGroup: async (req, res) => {
        try {
            const { groupId } = req.params;
            await GroupModel.deleteGroup(groupId);
            res.status(200).json({ message: "Group deleted successfully" });
        } catch (err) {
            console.error("GroupController.deleteGroup Error:", err);
            res.status(500).json({ message: "Error deleting group" });
        }
    },

    getGroupById: async (req, res) => {
        try {
            const { groupId } = req.params;
            const group = await GroupModel.getGroupById(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            res.status(200).json(group);
        } catch (err) {
            console.error("GroupController.getGroupById Error:", err);
            res.status(500).json({ message: "Error fetching group details" });
        }
    },

    updateGroup: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { groupName, meetLink, memberIds, creatorId } = req.body;

            if (!groupName) {
                return res.status(400).json({ message: "Group name is required" });
            }

            // Get group to know the assignmentId
            const group = await GroupModel.getGroupById(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }

            // Check if any added members are already in ANOTHER group
            for (const userId of memberIds) {
                const hasAnother = await GroupModel.checkUserHasAnotherGroup(userId, group.assignmentId, groupId);
                if (hasAnother) {
                    return res.status(400).json({ message: `One or more selected members are already in another group.` });
                }
            }

            await GroupModel.updateGroup(groupId, groupName, meetLink, memberIds, creatorId);
            res.status(200).json({ message: "Group updated successfully" });
        } catch (err) {
            console.error("GroupController.updateGroup Error:", err);
            res.status(500).json({ message: "Error updating group" });
        }
    },

    getGroupComments: async (req, res) => {
        try {
            const { groupId } = req.params;
            const comments = await GroupModel.getGroupComments(groupId);
            res.status(200).json(comments);
        } catch (err) {
            console.error("GroupController.getGroupComments Error:", err);
            res.status(500).json({ message: "Error fetching group comments" });
        }
    },

    addGroupComment: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { userId, comment } = req.body;

            if (!userId || !comment) {
                return res.status(400).json({ message: "User ID and comment text are required" });
            }

            const commentId = await GroupModel.addGroupComment(groupId, userId, comment);
            res.status(201).json({ message: "Comment added successfully", commentId });
        } catch (err) {
            console.error("GroupController.addGroupComment Error:", err);
            res.status(500).json({ message: "Error adding group comment" });
        }
    },

    trackMeetJoin: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            await GroupModel.trackMeetJoin(userId, groupId);
            res.status(200).json({ message: "Meet join tracked successfully" });
        } catch (err) {
            console.error("GroupController.trackMeetJoin Error:", err);
            res.status(500).json({ message: "Error tracking meet join" });
        }
    },

    getMeetTracking: async (req, res) => {
        try {
            const { groupId } = req.params;
            const tracking = await GroupModel.getMeetTracking(groupId);
            res.status(200).json(tracking);
        } catch (err) {
            console.error("GroupController.getMeetTracking Error:", err);
            res.status(500).json({ message: "Error fetching meet tracking" });
        }
    }
};

export default GroupController;
