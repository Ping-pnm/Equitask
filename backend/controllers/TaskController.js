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
    }
};

export default TaskController;
