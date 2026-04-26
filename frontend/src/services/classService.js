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
