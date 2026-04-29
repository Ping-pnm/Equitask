export async function getWorkFeed(classId, userId, onlyGroupWork = false) {
    try {
        const url = new URL(`http://localhost:3000/api/work/feed/${classId}`);
        if (userId) url.searchParams.append('userId', userId);
        if (onlyGroupWork) url.searchParams.append('onlyGroupWork', 'true');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch work feeds');
        }

        const data = await response.json();
        return data;
        
    } catch(err) {
        console.error("workService Error", err);
        throw err;
    }
}

export async function assignWork(formData) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/assign`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to assign work');
        }

        const data = await response.json();
        return data;
    } catch(err) {
        console.error("workService assignWork Error", err);
        throw err;
    }
}

export async function getAssignment(assignmentId, userId = null) {
    try {
        const url = userId 
            ? `http://localhost:3000/api/work/${assignmentId}?userId=${userId}`
            : `http://localhost:3000/api/work/${assignmentId}`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch assignment');
        }
        return await response.json();
    } catch (err) {
        console.error("workService getAssignment Error", err);
        throw err;
    }
}

export async function updateWork(assignmentId, formData) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/${assignmentId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService updateWork Error", err);
        throw err;
    }
}

export async function deleteWork(assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/${assignmentId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService deleteWork Error", err);
        throw err;
    }
}

/* ===== Group Services ===== */

export async function getGroupMembers(classId, assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/members/${classId}/${assignmentId}`);
        if (!response.ok) throw new Error("Failed to fetch group members");
        return await response.json();
    } catch (err) {
        console.error("workService.getGroupMembers Error:", err);
        throw err;
    }
}

export async function createGroup(groupData) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create group');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.createGroup Error:", err);
        throw err;
    }
}

export async function getUserGroup(userId, assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/user/${userId}/${assignmentId}`);
        if (!response.ok) throw new Error("Failed to fetch user group");
        return await response.json();
    } catch (err) {
        console.error("workService.getUserGroup Error:", err);
        throw err;
    }
}

export async function deleteGroup(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete group");
        return await response.json();
    } catch (err) {
        console.error("workService.deleteGroup Error:", err);
        throw err;
    }
}

export async function getAllGroupsForAssignment(assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/all/${assignmentId}`);
        if (!response.ok) throw new Error("Failed to fetch all groups");
        return await response.json();
    } catch (err) {
        console.error("workService.getAllGroupsForAssignment Error:", err);
        throw err;
    }
}

export async function getGroup(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch group details');
        }
        return await response.json();
    } catch (err) {
        console.error("workService.getGroup Error:", err);
        throw err;
    }
}

export async function updateGroup(groupId, groupData) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update group');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.updateGroup Error:", err);
        throw err;
    }
}

export async function getGroupComments(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/comments`);
        if (!response.ok) throw new Error("Failed to fetch group comments");
        return await response.json();
    } catch (err) {
        console.error("workService.getGroupComments Error:", err);
        throw err;
    }
}

export async function addGroupComment(groupId, userId, comment) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, comment }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add comment');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.addGroupComment Error:", err);
        throw err;
    }
}

export async function trackMeetJoin(groupId, userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/track-meet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error("Failed to track meet join");
        return await response.json();
    } catch (err) {
        console.error("workService.trackMeetJoin Error:", err);
        throw err;
    }
}

export async function getMeetTracking(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/track-meet`);
        if (!response.ok) throw new Error("Failed to fetch meet tracking");
        return await response.json();
    } catch (err) {
        console.error("workService.getMeetTracking Error:", err);
        throw err;
    }
}

export async function uploadGroupWork(groupId, assignmentId, files) {
    try {
        const formData = new FormData();
        formData.append('assignmentId', assignmentId);
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`http://localhost:3000/api/group/${groupId}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.uploadGroupWork Error:", err);
        throw err;
    }
}

export async function deleteGroupWork(fileId) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/work-file/${fileId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete work file');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.deleteGroupWork Error:", err);
        throw err;
    }
}

export async function submitGroupWork(groupId, assignmentId, isSubmitted) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId, isSubmitted })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.submitGroupWork Error:", err);
        throw err;
    }
}

export async function gradeGroup(groupId, grades) {
    try {
        const response = await fetch(`http://localhost:3000/api/group/${groupId}/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grades })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to grade group');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.gradeGroup Error:", err);
        throw err;
    }
}

export async function getTaskDetail(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/task/${taskId}`);
        if (!response.ok) throw new Error("Failed to fetch task detail");
        return await response.json();
    } catch (err) {
        console.error("workService.getTaskDetail Error:", err);
        throw err;
    }
}

export async function uploadTaskWork(taskId, groupId, assignmentId, files) {
    try {
        const formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('assignmentId', assignmentId);
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`http://localhost:3000/api/task/${taskId}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload task work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.uploadTaskWork Error:", err);
        throw err;
    }
}

export async function deleteTaskWork(fileId) {
    try {
        const response = await fetch(`http://localhost:3000/api/task/work-file/${fileId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete task work file');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.deleteTaskWork Error:", err);
        throw err;
    }
}

export async function submitTaskWork(taskId, isSubmitted) {
    try {
        const response = await fetch(`http://localhost:3000/api/task/${taskId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isSubmitted })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit task work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.submitTaskWork Error:", err);
        throw err;
    }
}

export async function uploadIndividualWork(userId, assignmentId, files) {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('assignmentId', assignmentId);
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`http://localhost:3000/api/work/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload individual work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.uploadIndividualWork Error:", err);
        throw err;
    }
}

export async function deleteIndividualWork(fileId) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/file/${fileId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete individual file');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.deleteIndividualWork Error:", err);
        throw err;
    }
}

export async function submitIndividualWork(userId, assignmentId, isSubmitted) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, assignmentId, isSubmitted })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit individual work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.submitIndividualWork Error:", err);
        throw err;
    }
}

export async function getAllIndividualSubmissions(assignmentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/submissions/${assignmentId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch individual submissions');
        }
        return await response.json();
    } catch (err) {
        console.error("workService.getAllIndividualSubmissions Error:", err);
        throw err;
    }
}

export async function gradeIndividualWork(userId, assignmentId, grades) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, assignmentId, grades })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to grade work');
        }

        return await response.json();
    } catch (err) {
        console.error("workService.gradeIndividualWork Error:", err);
        throw err;
    }
}