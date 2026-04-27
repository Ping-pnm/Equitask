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

export async function postAnnouncement(content, creatorId, classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/class/announce/${classId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                creatorId: creatorId,
            })
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