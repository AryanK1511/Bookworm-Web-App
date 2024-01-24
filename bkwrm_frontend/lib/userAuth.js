// => Register user in the database
const registerUser = async (userDetails) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error during user registration:", error.message);
        throw error; 
    }
};

export { registerUser }; 
