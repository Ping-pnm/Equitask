export async function createTask(taskData) {
    try {
        const response = await fetch(`http://localhost:3000/api/task/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create task');
        }

        return await response.json();
    } catch (err) {
        console.error("taskService.createTask Error:", err);
        throw err;
    }
}

export async function getGroupTasks(groupId, assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/task/group/${groupId}/${assignmentId}`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        return await response.json();
    } catch (err) {
        console.error("taskService.getGroupTasks Error:", err);
        throw err;
    }
}
