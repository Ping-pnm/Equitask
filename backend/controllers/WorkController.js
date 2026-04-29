import AssignmentModel from "../models/AssignmentModel.js";

const WorkController = {
    getWorkFeed: async (req, res) => {
        try {
            const { classId } = req.params;
            const { userId, onlyGroupWork } = req.query;

            const response = await AssignmentModel.getAllByClassId(classId, userId, onlyGroupWork === 'true');

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
    },
    getAssignment: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const { userId } = req.query;
            const assignment = await AssignmentModel.getById(assignmentId, userId);
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" });
            }
            res.status(200).json(assignment);
        } catch (err) {
            console.error("Get Assignment Error:", err);
            res.status(500).json({ message: "Server error fetching assignment" });
        }
    },
    updateWork: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const { 
                title, 
                instruction, 
                points, 
                dueDate, 
                isGroupWork, 
                rubricCriterias, 
                rubricLevels, 
                rubricCells,
                existingFiles // Sent as JSON string from frontend
            } = req.body;
            
            const newFiles = req.files || [];

            // Parse Rubric Data
            const rubricData = {
                criterias: JSON.parse(rubricCriterias || '[]'),
                levels: JSON.parse(rubricLevels || '[]'),
                cells: JSON.parse(rubricCells || '[]')
            };

            // Parse existing files and combine with new uploads
            const parsedExistingFiles = JSON.parse(existingFiles || '[]').map(f => ({
                fileUrl: f.fileUrl
            }));

            const combinedFiles = [
                ...parsedExistingFiles,
                ...newFiles.map(f => ({
                    fileUrl: f.path.replace(/\\/g, '/')
                }))
            ];

            const updateData = {
                title,
                instruction,
                points: parseInt(points),
                dueDate: dueDate.replace('T', ' '),
                isGroupWork: isGroupWork === 'true',
                rubrics: rubricData,
                files: combinedFiles
            };

            const success = await AssignmentModel.update(assignmentId, updateData);
            
            if (success) {
                res.status(200).json({ message: "Assignment updated successfully" });
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (err) {
            console.error("Update Work Error:", err);
            res.status(500).json({ message: "Server error updating assignment" });
        }
    },
    deleteWork: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const success = await AssignmentModel.delete(assignmentId);
            if (success) {
                res.status(200).json({ message: "Assignment deleted successfully" });
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (err) {
            console.error("Delete Work Error:", err);
            res.status(500).json({ message: "Server error deleting assignment" });
        }
    },
    uploadIndividualFile: async (req, res) => {
        try {
            const { userId, assignmentId } = req.body;
            const files = req.files || [];

            if (files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploadedFiles = [];
            for (const file of files) {
                const fileUrl = file.path.replace(/\\/g, '/');
                const fileId = await AssignmentModel.uploadIndividualFile(userId, assignmentId, fileUrl);
                uploadedFiles.push({ fileId, fileUrl });
            }

            res.status(201).json({ message: "Files uploaded successfully", files: uploadedFiles });
        } catch (err) {
            console.error("Upload Individual File Error:", err);
            res.status(500).json({ message: "Server error uploading file" });
        }
    },
    deleteIndividualFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const success = await AssignmentModel.deleteIndividualFile(fileId);
            if (success) {
                res.status(200).json({ message: "File deleted successfully" });
            } else {
                res.status(404).json({ message: "File not found" });
            }
        } catch (err) {
            console.error("Delete Individual File Error:", err);
            res.status(500).json({ message: "Server error deleting file" });
        }
    },
    submitIndividualWork: async (req, res) => {
        try {
            const { userId, assignmentId, isSubmitted } = req.body;
            await AssignmentModel.submitIndividualWork(userId, assignmentId, isSubmitted);
            res.status(200).json({ message: isSubmitted ? "Work submitted" : "Work unsubmitted" });
        } catch (err) {
            console.error("Submit Individual Work Error:", err);
            res.status(500).json({ message: "Server error submitting work" });
        }
    },
    getIndividualSubmissions: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const submissions = await AssignmentModel.getAllIndividualSubmissions(assignmentId);
            res.status(200).json(submissions);
        } catch (err) {
            console.error("Get Individual Submissions Error:", err);
            res.status(500).json({ message: "Server error fetching submissions" });
        }
    },
    gradeIndividualWork: async (req, res) => {
        try {
            const { userId, assignmentId, grades } = req.body;
            await AssignmentModel.gradeIndividualWork(userId, assignmentId, grades);
            res.status(200).json({ message: "Work graded successfully" });
        } catch (err) {
            console.error("Grade Individual Work Error:", err);
            res.status(500).json({ message: "Server error grading work" });
        }
    }
};

export default WorkController;