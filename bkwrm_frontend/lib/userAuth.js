// ===================================
// This file contains functions for user authentication and authorization
// ===================================

// => Store token in local storage
const setToken = (token) => {
    localStorage.setItem('access_token', token);
}

// => Get token from local storage
const getToken = () => {
    try {
        return localStorage.getItem('access_token');
    }
    catch (error) {
        return null;
    }
}

// => Remove token from local storage
const removeToken = () => {
    localStorage.removeItem('access_token');
}

// => Register user in the database
const registerUser = async (userDetails) => {
    // Make a POST request to the /register route of the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDetails)
    });

    const data = await response.json();

    // Throw an error if response is not 200
    if (response.ok) {
        return { success: true, message: data.message};
    } else {
        console.error("Registration Failed:", data.message);
        return { success: false, message: data.message };
    }
};

// => Authenticate user for login
const authenticateUser = async (userDetails) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        });

        const data = await response.json();
        if (response.ok) {
            setToken(data.jwt_token);
            return { success: true, message: data.message, token: data.jwt_token};
        } else {
            console.error("Login Failed:", error.message);
            return { success: false, message: error.message };
        }

    } catch (error) {
        console.error("Error during user authentication:", error.message);
        throw error;
    }
};

// => Logout user
const logoutUser = async () => {
    try {
        removeToken(); // Remove the JWT token from local storage
        return { success: true, message: "User logged out successfully" };
    } catch (error) {
        console.error("Logout failed:", error);
        return { success: false, message: "Logout failed" };
    }
};

export { registerUser, authenticateUser, logoutUser, getToken }; 
