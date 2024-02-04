import { getToken } from "./userAuth";

/*
===================================
User Operations
===================================
*/

// => Get user details based on user id
const getUserDetails = async (userId) => {
    const token = getToken();

    // Make a GET request to the /profile/:id route of the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${userId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    // Throw an error if response is not 200
    if (response.ok) {
        return { success: true, message: data.message, data: data.user };
    } else {
        console.error("Failed to get user details:", data.message);
        return { success: false, message: data.message };
    }
};

export { getUserDetails };