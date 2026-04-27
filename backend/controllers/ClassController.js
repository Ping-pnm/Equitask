import ClassModel from "../models/ClassModel.js";
import AnnouncementModel from "../models/AnnouncementModel.js";
import AssignmentModel from "../models/AssignmentModel.js";
import FilesModel from "../models/FilesModel.js";
import UserModel from "../models/UserModel.js";

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
            
            // Fetch files for each announcement in parallel
            const taggedAnnouncements = await Promise.all(announcements.map(async (a) => {
                const files = await FilesModel.getAnnouncementFiles(a.announcementId);
                return { ...a, type: 'announcement', files };
            }));

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
            // Debugging: See exactly what is arriving
            console.log("--- New Announcement Request ---");
            console.log("Body:", req.body);
            console.log("Files:", req.files);

            const { content, creatorId } = req.body;
            const { classId } = req.params;
            const files = req.files; 
            
            if (!content && (!files || files.length === 0)) {
                return res.status(400).json({ message: "Content or files are required" });
            }

            const newAnnouncementId = await AnnouncementModel.createAnnouncement(content, creatorId, classId);

            await FilesModel.AttachFilesToAnnouncement(newAnnouncementId, files);

            res.status(200).json(newAnnouncementId);
        } catch (err) {
            console.error("List Classes Error:", err);
            res.status(500).json({ message: "Server error fetching classes" });
        }
    },

    getClassLeaders: async (req, res) => {
        try {
            const { classId } = req.params;
            const leaders = await UserModel.getLeaders(classId);
            res.status(200).json(leaders);
        } catch(err) {
            console.error("Error fetching leaders:", err);
            res.status(500).json({ message: "Server error fetching leaders" });
        }
    },

    getClassMembers: async (req, res) => {
       try {
            const { classId } = req.params;
            const members = await UserModel.getMembers(classId);
            res.status(200).json(members);
        } catch(err) {
            console.error("Error fetching members:", err);
            res.status(500).json({ message: "Server error fetching members" });
        } 
    },

    removeMember: async (req, res) => {
        try {
            const { userId, classId } = req.body;
            if (!userId || !classId) {
                return res.status(400).json({ message: "User ID and Class ID are required" });
            }

            await UserModel.removeMemberFromClass(userId, classId);
            res.status(200).json({ message: "Member removed successfully" });
        } catch (err) {
            console.error("Error removing member:", err);
            res.status(500).json({ message: "Server error removing member" });
        }
    }
};

export default ClassController;