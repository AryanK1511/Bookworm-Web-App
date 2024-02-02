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

// => Read token from local storage
const readToken = () => {
    const token = getToken();
    if (token) {
        return token;
    }
    return null;
}

// => Remove token from local storage
const removeToken = () => {
    localStorage.removeItem('access_token');
}

// => Register user in the database
const registerUser = async (userDetails) => {
    try {
        // Make a POST request to the /register route of the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        });

        const data = response.json();

        // Throw an error if response is not 200
        if (response.ok) {
            setToken(data.jwt_token);
            return { success: true, message: data.message};
        } else {
            console.error("Registration Failed:", error.message);
            return { success: false, message: error.message };
        }
    } catch (error) {
        console.error("Error during user registration:", error.message);
        return { success: false, message: error.message };
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
        } else {
            throw new Error(data.message || `HTTP error! Status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("Error during user authentication:", error.message);
        throw error;
    }
};

// => Check to see whether a user is authenticated
const isUserAuthenticated = async () => {
    try {
        // Make a POST request to the /register route of the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/status`, {
            method: 'GET', 
            headers: {
                "Content-Type": "application/json"
            },
        });

        // Throw an error if response is not 200
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error during user registration:", error.message);
        throw error; 
    }
};

export { registerUser, authenticateUser, isUserAuthenticated }; 
