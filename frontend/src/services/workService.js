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