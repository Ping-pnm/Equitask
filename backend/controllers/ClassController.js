import ClassModel from "../models/ClassModel.js";
import AnnouncementModel from "../models/AnnouncementModel.js";
import AssignmentModel from "../models/AssignmentModel.js";

const ClassController = {
    listClasses: async (req, res) => {
        try {
            const userId = req.query.userId
            
            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            const classes = await ClassModel.getAllClasses(userId);
            
            res.status(200).json(classes);

        } catch (err) {
            console.error("List Classes Error:", err);
            res.status(500).json({ message: "Server error fetching classes" });
        }
    },
    createClass: async (req, res) => {
        try{
            const { userId, title, section, subject } = req.body;

            const newClassId = await ClassModel.createClass(userId, title, section, subject);
            res.status(200).json({ classId: newClassId, message: "Class created successfully" });
        } catch(err) {
            console.error("Create Class Error:", err);
            res.status(500).json({ message: "Server error fetching classes"});
        }
    },
    getStreamFeed: async (req, res) => {
        try {
            const { classId } = req.params;

            const assignments = await AssignmentModel.getAllByClassId(classId);
            const announcements = await AnnouncementModel.getAllByClassId(classId);

            // Tag each item to distinguish them on the frontend
            const taggedAssignments = assignments.map(a => ({ ...a, type: 'assignment' }));
            const taggedAnnouncements = announcements.map(a => ({ ...a, type: 'announcement' }));

            // Combine and sort by date (Newest first)
            const combinedFeed = [...taggedAssignments, ...taggedAnnouncements].sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Format the date to show: Day Month, HH:MM
            const formattedFeed = combinedFeed.map(item => ({
                ...item,
                createdAt: new Date(item.createdAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            }));

            res.status(200).json(formattedFeed);

        } catch(err) {
            console.error("Get Stream Feed Error:", err);
            res.status(500).json({ message: "Server error fetching feed" });
        }
    },
    postAnnouncement: async (req, res) => {
        try {
            const { content, creatorId} = req.body;
            const { classId } = req.params;

            const newAnnouncementId = await AnnouncementModel.createAnnouncement(content, creatorId, classId);

            res.status(200).json(newAnnouncementId);
        } catch (err) {
            console.error("List Classes Error:", err);
            res.status(500).json({ message: "Server error fetching classes" });
        }
    }
};

export default ClassController;