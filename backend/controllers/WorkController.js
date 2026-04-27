import AssignmentModel from "../models/AssignmentModel.js";

const WorkController = {
    getWorkFeed: async (req, res) => {
        try {
            const { classId } = req.params;  

            const response = await AssignmentModel.getAllByClassId(classId);

            res.status(200).json(response);
        } catch(err) {
            console.error("Fetch Work Error:", err);
            res.status(500).json({ message: "Server error fetching classes"});
        }
    },
    assignWork: async (req, res) => {
        try {
            const { 
                classId, 
                creatorId, 
                title, 
                instruction, 
                points, 
                dueDate, 
                isGroupWork, 
                rubricCriterias, 
                rubricLevels, 
                rubricCells 
            } = req.body;
            
            const files = req.files || [];

            // rubrics data arrives as JSON strings via FormData
            const rubricData = {
                criterias: JSON.parse(rubricCriterias || '[]'),
                levels: JSON.parse(rubricLevels || '[]'),
                cells: JSON.parse(rubricCells || '[]')
            };

            const assignmentData = {
                classId,
                creatorId,
                title,
                instruction,
                points: parseInt(points) || 100,
                dueDate: dueDate.replace('T', ' '),
                isGroupWork: isGroupWork === 'true',
                rubrics: rubricData,
                files: files.map(f => ({
                    fileName: f.originalname,
                    fileUrl: f.path.replace(/\\/g, '/')
                }))
            };

            const newAssignmentId = await AssignmentModel.create(assignmentData);

            res.status(201).json({ 
                message: "Assignment created successfully", 
                assignmentId: newAssignmentId 
            });
        } catch (err) {
            console.error("Assign Work Error:", err);
            res.status(500).json({ message: "Server error creating assignment" });
        }
    } 
};

export default WorkController;