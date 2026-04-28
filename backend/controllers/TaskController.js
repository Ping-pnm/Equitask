import TaskModel from '../models/TaskModel.js';

const TaskController = {
    createTask: async (req, res) => {
        try {
            const taskId = await TaskModel.create(req.body);
            res.status(201).json({ message: "Task created successfully", taskId });
        } catch (err) {
            console.error("TaskController.createTask Error:", err);
            res.status(500).json({ message: "Error creating task" });
        }
    },

    getGroupTasks: async (req, res) => {
        try {
            const { groupId, assignmentId } = req.params;
            const tasks = await TaskModel.getTasksByGroupAndAssignment(groupId, assignmentId);
            res.status(200).json(tasks);
        } catch (err) {
            console.error("TaskController.getGroupTasks Error:", err);
            res.status(500).json({ message: "Error fetching tasks" });
        }
    },

    getTaskDetail: async (req, res) => {
        try {
            const { taskId } = req.params;
            const task = await TaskModel.getById(taskId);
            if (!task) return res.status(404).json({ message: "Task not found" });
            res.status(200).json(task);
        } catch (err) {
            console.error("TaskController.getTaskDetail Error:", err);
            res.status(500).json({ message: "Error fetching task detail" });
        }
    },

    uploadWork: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { groupId, assignmentId } = req.body;
            const files = req.files || [];

            if (files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const uploadedFiles = [];
            for (const file of files) {
                const fileUrl = file.path.replace(/\\/g, '/');
                const fileId = await TaskModel.uploadTaskFile(taskId, groupId, assignmentId, fileUrl);
                uploadedFiles.push({ fileId, fileUrl });
            }

            res.status(201).json({ message: "Files uploaded successfully", files: uploadedFiles });
        } catch (err) {
            console.error("TaskController.uploadWork Error:", err);
            res.status(500).json({ message: "Error uploading work" });
        }
    },

    deleteTaskFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const success = await TaskModel.deleteFile(fileId);
            if (success) {
                res.status(200).json({ message: "File deleted successfully" });
            } else {
                res.status(404).json({ message: "File not found" });
            }
        } catch (err) {
            console.error("TaskController.deleteTaskFile Error:", err);
            res.status(500).json({ message: "Error deleting task file" });
        }
    },

    submitWork: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { isSubmitted } = req.body;
            const success = await TaskModel.submitTask(taskId, isSubmitted);
            if (success) {
                res.status(200).json({ message: isSubmitted ? "Task submitted" : "Task unsubmitted" });
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        } catch (err) {
            console.error("TaskController.submitWork Error:", err);
            res.status(500).json({ message: "Error submitting task" });
        }
    }
};

export default TaskController;
