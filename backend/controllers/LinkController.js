import LinkModel from "../models/LinkModel.js";

const LinkController = {
    addLink: async (req, res) => {
        try {
            const { linkUrl, assignmentId, userId, groupId, taskId } = req.body;
            if (!linkUrl || !assignmentId) {
                return res.status(400).json({ message: "Link URL and Assignment ID are required" });
            }

            const linkId = await LinkModel.addLink(linkUrl, assignmentId, userId, groupId, taskId);
            res.status(201).json({ message: "Link added successfully", linkId, linkUrl });
        } catch (err) {
            console.error("LinkController.addLink Error:", err);
            res.status(500).json({ message: "Error adding link" });
        }
    },

    deleteLink: async (req, res) => {
        try {
            const { linkId } = req.params;
            const success = await LinkModel.deleteLink(linkId);
            if (success) {
                res.status(200).json({ message: "Link deleted successfully" });
            } else {
                res.status(404).json({ message: "Link not found" });
            }
        } catch (err) {
            console.error("LinkController.deleteLink Error:", err);
            res.status(500).json({ message: "Error deleting link" });
        }
    }
};

export default LinkController;
