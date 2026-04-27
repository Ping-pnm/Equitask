import AssignmentModel from "../models/AssignmentModel.js";

const WorkController = {
    getWorkFeed: async (req, res) => {
        try {
            const { classId } = req.params;  

            const response = await AssignmentModel.getAllByClassId(classId);

            res.status(200).json(response);
        } catch(err) {
            console.error("Create Class Error:", err);
            res.status(500).json({ message: "Server error fetching classes"});
        }
    } 
};

export default WorkController;