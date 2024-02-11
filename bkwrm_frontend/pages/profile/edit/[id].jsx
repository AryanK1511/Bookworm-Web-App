import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserDetails, updateUserProfile } from "@/lib/userFunctions";
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap";
import { userAtom } from "@/store";
import { useAtom } from "jotai";
import { getToken } from "@/lib/userAuth";
import { jwtDecode } from "jwt-decode";

// ========== EDIT PROFILE PAGE ==========
const EditProfilePage = () => {
	const router = useRouter();
	const { id } = router.query;

	// State vars for user details
	const [user, setUser] = useAtom(userAtom);
	const [userDetails, setUserDetails] = useState({});
	const [username, setUsername] = useState("");
	const [fullname, setFullname] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		// Redirect the user if they try to access someone else's profile
		if (user.isAuthenticated && user.user.sub.id !== id) {
			router.push(`/profile/edit/${user.user.sub.id}`);
		}
	}, [id]);

	// Default profile picture URL
	const defaultProfilePic =
		"https://res.cloudinary.com/dtjzbh27c/image/upload/v1707052869/default_profile_pic.avif";

	// Fetch user details from server
	useEffect(() => {
		const fetchUserDetails = async () => {
			const response = await getUserDetails(id);

			if (response.success) {
				setUserDetails(response.data);
				setUsername(response.data.username);
				setFullname(response.data.fullname);
			} else {
				router.push("/");
			}
		};

		if (id) {
			fetchUserDetails();
		}
	}, [id]);

	// Handle deleting the profile picture
	const handleDeleteProfilePicture = async () => {
		// Call updateUserProfile to set the profile picture to the default
		const response = await updateUserProfile(
			id,
			{
				fullname, // keep the other details the same
				username,
			},
			null,
			true,
		);

		// Update the profile picture state
		if (response.success) {
			setUserDetails({
				...userDetails,
				profile_picture: defaultProfilePic,
			});
			let usr = jwtDecode(getToken());
			setUser({ isAuthenticated: true, user: usr });

			// Refresh the page or show a success message
			router.push(`/profile/${id}`);
		} else {
			// Set the error message to be displayed
			setErrorMessage(response.message);
		}
	};

	// Handle save changes
	const handleSaveChanges = async (e) => {
		e.preventDefault(); // Prevent default form submission

		// Reset error message state
		setErrorMessage("");

		// Call updateUserProfile from your userFunctions library
		const response = await updateUserProfile(
			id,
			{
				fullname,
				username,
			},
			profilePicture,
		);

		if (response.success) {
			let usr = jwtDecode(getToken());
			setUser({ isAuthenticated: true, user: usr });

			// Redirect to profile page
			router.push(`/profile/${id}`);
		} else {
			// Set the error message to be displayed
			setErrorMessage(response.message);
		}
	};

	// Handle file change
	const handleFileChange = (event) => {
		setProfilePicture(event.target.files[0]);
	};

	return (
		<Container className="d-flex justify-content-center align-items-center profile-container">
			<Card className="form-card">
				<Form>
					<Card.Body className="card-body">
						<div>
							<img
								src={
									userDetails?.profile_picture ||
									"/default_profile_pic.png"
								}
								alt="Profile Picture"
								className="profile-image"
							/>
						</div>
						<Form.Group
							controlId="formProfilePicture"
							className="profile-picture-form"
						>
							<Form.Label>
								Profile Picture (Less than 10 MB)
							</Form.Label>
							<Form.Control
								type="file"
								onChange={handleFileChange}
							/>
						</Form.Group>
						<Button
							variant="danger"
							className="delete-profile-pic-button"
							onClick={handleDeleteProfilePicture}
							style={{
								display:
									userDetails.profile_picture !==
									defaultProfilePic
										? "block"
										: "none",
							}} // Only display the button if the profile picture is not the default
						>
							Delete Profile Picture
						</Button>
						<br />

						<Form.Group
							controlId="formUsername"
							className="username-form"
						>
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter new username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Form.Group>
						<Form.Group
							controlId="formFullname"
							className="fullname-form"
						>
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter new full name"
								value={fullname}
								onChange={(e) => setFullname(e.target.value)}
							/>
						</Form.Group>
						{/* Error Message */}
						{errorMessage && (
							<>
								<p className="errorMessage">{errorMessage}</p>
								<br />
							</>
						)}
						<Button
							variant="primary"
							className="save-button"
							onClick={handleSaveChanges}
						>
							Save Changes
						</Button>
					</Card.Body>
				</Form>
			</Card>
		</Container>
	);
};

export default EditProfilePage;
