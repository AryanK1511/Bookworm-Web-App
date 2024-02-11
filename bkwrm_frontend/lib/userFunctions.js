import { getToken, setToken } from "./userAuth";

/*
===================================
User Operations
===================================
*/

// => Get user details based on user id
const getUserDetails = async (userId) => {
	const token = getToken();

	// Make a GET request to the /profile/:id route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${userId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return { success: true, message: data.message, data: data.user };
	} else {
		console.error("Failed to get user details:", data.message);
		return { success: false, message: data.message };
	}
};

// => Update User Profile
const updateUserProfile = async (
	userId,
	userDetails,
	profileImageFile,
	resetProfilePic = false,
) => {
	const token = getToken();
	const formData = new FormData();

	// Append the user details to the formData
	formData.append("fullname", userDetails.fullname);
	formData.append("username", userDetails.username);

	// If resetProfilePic is true, set the profile_picture field to 'reset'
	if (resetProfilePic) {
		formData.append("profile_picture", "reset");
	} else if (profileImageFile) {
		// If there's an image file, append it to the formData
		formData.append("profile_picture", profileImageFile);
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/update/${userId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			},
		);

		if (response.ok) {
			const data = await response.json();
			if (data.jwt_token) {
				setToken(data.jwt_token);
			}
			return { success: true, data: data };
		} else {
			const errorData = await response.json();
			return { success: false, message: errorData.message };
		}
	} catch (error) {
		return {
			success: false,
			message: "An error occurred during the request.",
		};
	}
};

export { getUserDetails, updateUserProfile };
