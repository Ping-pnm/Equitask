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
            const groups = await GroupModel.getAllGroupsForAssignment(assignmentId);
            console.log('[GroupController.getAllGroupsForAssignment] groups:', JSON.stringify(groups, null, 2));
            res.status(200).json(groups);
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
            res.status(500).json({ message: "Error deleting group" });
        }
    },

    uploadWork: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { assignmentId } = req.body;
            const files = req.files || [];

            if (files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploadedFiles = [];
            for (const file of files) {
                const fileUrl = file.path.replace(/\\/g, '/');
                const fileId = await GroupModel.uploadGroupFile(groupId, assignmentId, fileUrl);
                uploadedFiles.push({ fileId, fileUrl });
            }

            res.status(201).json({ message: "Files uploaded successfully", files: uploadedFiles });
        } catch (err) {
            console.error("GroupController.uploadWork Error:", err);
            res.status(500).json({ message: "Error uploading work" });
        }
    },

    deleteWorkFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const success = await GroupModel.deleteGroupFile(fileId);
            if (success) {
                res.status(200).json({ message: "File deleted successfully" });
            } else {
                res.status(404).json({ message: "File not found" });
            }
        } catch (err) {
            console.error("GroupController.deleteWorkFile Error:", err);
            res.status(500).json({ message: "Error deleting work file" });
        }
    },

    submitWork: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { assignmentId, isSubmitted } = req.body;
            const result = await GroupModel.submitGroupWork(groupId, assignmentId, isSubmitted);
            if (result) {
                res.status(200).json({ 
                    message: isSubmitted ? "Work submitted" : "Work unsubmitted",
                    ...result
                });
            } else {
                res.status(404).json({ message: "Group assignment not found" });
            }
        } catch (err) {
            console.error("GroupController.submitWork Error:", err);
            res.status(500).json({ message: "Error submitting work" });
        }
    },

    gradeGroup: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { grades } = req.body;
            await GroupModel.gradeGroup(groupId, grades);
            res.status(200).json({ message: "Group graded successfully" });
        } catch (err) {
            console.error("GroupController.gradeGroup Error:", err);
            res.status(500).json({ message: "Error grading group" });
        }
    }
};

export default GroupController;
