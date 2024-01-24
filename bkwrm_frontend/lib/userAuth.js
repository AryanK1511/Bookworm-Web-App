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

// => Authenticate user for login
const authenticateUser = async (userDetails) => {
    try {
        // Make a POST request to the /register route of the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
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

const isUserAuthenticated = async (userDetails) => {
    try {
        // Make a POST request to the /register route of the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/status`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
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
