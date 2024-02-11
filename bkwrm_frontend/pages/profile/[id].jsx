import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserDetails } from "@/lib/userFunctions";
import { Button, Card, Container, ListGroup } from "react-bootstrap";
import { useAtom } from "jotai";
import { userAtom } from "@/store";

// ========== PROFILE PAGE ==========
const ProfilePage = () => {
	// Define Router and get user ID from URL
	const router = useRouter();
	const { id } = router.query;
	const [user, setUser] = useAtom(userAtom);

	// State var for user details
	const [userDetails, setUserDetails] = useState({});

	useEffect(() => {
		// Redirect the user if they try to access someone else's profile
		if (user.isAuthenticated && user.user.sub.id !== id) {
			router.push(`/profile/${user.user.sub.id}`);
		}
	}, [id]);

	// Fetch user details from server
	useEffect(() => {
		const fetchUserDetails = async () => {
			const response = await getUserDetails(id);
			if (response.success) {
				setUserDetails(response.data);
			} else {
				router.push("/");
			}
		};

		if (id) {
			fetchUserDetails();
		}
	}, [id]);

	return (
		<Container className="d-flex justify-content-center align-items-center profile-container">
			<Card className="form-card">
				<Card.Body className="card-body">
					<div>
						<img
							src={userDetails.profile_picture}
							alt="Profile Picture"
							className="profile-image"
						/>
					</div>
					<Card.Title className="card-title">
						{userDetails.fullname}
					</Card.Title>
					<ListGroup className="list-group">
						<ListGroup.Item className="item">
							{userDetails.email}
						</ListGroup.Item>
						<ListGroup.Item className="item">
							{userDetails.username}
						</ListGroup.Item>
						<ListGroup.Item className="item">
							<p>Member Since:</p>
							<p>
								{new Date(
									userDetails.date_joined,
								).toLocaleDateString()}
							</p>
						</ListGroup.Item>
					</ListGroup>
					<Button
						variant="primary"
						className="save-button"
						onClick={() => router.push(`/profile/edit/${id}`)}
					>
						Edit Profile
					</Button>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default ProfilePage;
