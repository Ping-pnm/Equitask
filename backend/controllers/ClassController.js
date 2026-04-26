import ClassModel from "../models/ClassModel.js";

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
    }
};

export default ClassController;