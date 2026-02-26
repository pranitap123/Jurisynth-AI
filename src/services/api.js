export const updateUserSettings = async (payload) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/users/settings', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
    }
    return response.json();
};