export async function getAllClasses(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/getall?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch classes');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("classService Error:", error);
        throw error;
    }
}

export async function createClass(userId, title, section, subject) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                title,
                section,
                subject
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create class');
        }

        const newClassId = await response.json();
        return newClassId;
   } catch(err) {
        console.error("classService Error", err);
        throw err;
   }
}

export async function getStreamFeed(classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/feed/${classId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch announcements and assignments');
        }

        const data = await response.json();
        return data;
        
    } catch(err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function postAnnouncement(content, creatorId, classId, files) {
    try {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('creatorId', creatorId);
        
        // Append all files to the 'files' field
        files.forEach((file, index) => {
            console.log(`Appending file ${index}:`, file.name);
            formData.append('files', file);
        });

        const response = await fetch(`http://localhost:3000/api/class/announce/${classId}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to post announcement');
        }

        const newAnnouncementId = await response.json();
        return newAnnouncementId;
        
    } catch(err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function getLeaders(classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/leaders/${classId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch leaders');
        }

        const data = await response.json();
        return data;
        
    } catch(err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function getMembers(classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/members/${classId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch members');
        }

        const data = await response.json();
        return data;
        
    } catch(err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function deleteMembers(userId, classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/member/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                classId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete member');
        }

        const data = await response.json();
        return data;
        
    } catch(err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function inviteToClass(email, classId, type) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, classId, type })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send invite');
        }

        return await response.json();
    } catch (err) {
        console.error("classService Error", err);
        throw err;
    }
}

export async function getWorkFeed(classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/work/feed/${classId}`, {
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
        console.error("classService Error", err);
        throw err;
    }
}