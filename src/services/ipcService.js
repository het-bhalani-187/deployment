export const searchIPC = async (query) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`http://localhost:5000/api/ipc/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch IPC data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching IPC data:', error);
        throw error;
    }
};

export default searchIPC;