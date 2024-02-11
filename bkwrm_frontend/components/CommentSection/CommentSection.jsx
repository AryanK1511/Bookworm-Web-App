import React, { useState } from "react";
import {
	Button,
	ListGroup,
	Form,
	InputGroup,
	FormControl,
	Image,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { addReview, deleteReview } from "@/lib/bookDetails";
import { useRouter } from "next/router";
import styles from "./CommentSection.module.css";

// ========== COMMENT SECTION COMPONENT ===========
const CommentSection = ({ reviews, id, fetchBookDetails }) => {
	const router = useRouter();

	// Setting up the state for the new comment and rating
	const [newComment, setNewComment] = useState("");
	const [rating, setRating] = useState(0);
	// Get the user from the atom
	const [user] = useAtom(userAtom);

	// Function to handle the deletion of a review
	const handleDeleteReview = async (reviewId) => {
		// Call the deleteReview function from the lib
		let result = await deleteReview(reviewId);

		// If the review was deleted successfully, fetch the book details again
		if (result.success) {
			await fetchBookDetails(id);
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		} else {
			router.push("/explore");
		}
	};

	// Function to Submit a new review
	const handleReviewSubmit = async (e) => {
		e.preventDefault();

		// Only publish the comment if the user puts in a rating and text
		if (rating !== 0 && newComment !== "") {
			// Call the addReview function from the lib
			let result = await addReview(id, newComment, rating);

			// If the review was added successfully, fetch the book details again
			if (result.success) {
				await fetchBookDetails(id);
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
				setNewComment("");
				setRating(0);
			} else {
				router.push("/explore");
			}
		}
	};

	// Function to handle the change in the rating
	const handleRatingChange = (newRating) => {
		setRating(newRating);
	};

	return (
		<div>
			{reviews && reviews.length > 0 && (
				<ListGroup className={styles.allComments} variant="flush">
					{reviews.map((review) => (
						<ListGroup.Item
							key={review.id}
							className={`${styles.comment} d-flex align-items-start position-relative`}
						>
							<Image
								src={
									review.profile_picture ||
									"default_profile_pic_url"
								}
								roundedCircle
								style={{
									width: "50px",
									height: "50px",
									marginRight: "15px",
								}}
								className={styles.profPic}
							/>
							<div className="flex-grow-1">
								<div>
									<strong>
										{review.fullname || "Anonymous"}
									</strong>
								</div>
								<div style={{ color: "gray" }}>
									{review.username}
								</div>
								<div
									style={{
										color: "gray",
										marginBottom: "10px",
									}}
								>
									{new Date(
										review.date_posted,
									).toLocaleDateString()}{" "}
									{new Date(
										review.date_posted,
									).toLocaleTimeString()}
								</div>
								<div>{review.review_text}</div>
								<StarRatings
									rating={review.rating}
									starDimension="20px"
									starSpacing="2px"
									starRatedColor="gold"
								/>
							</div>
							{review.user_id === user?.user?.sub.id && (
								<Button
									variant="danger"
									size="sm"
									onClick={() =>
										handleDeleteReview(review.id)
									}
									className={styles.deleteButton}
								>
									Delete
								</Button>
							)}
						</ListGroup.Item>
					))}
				</ListGroup>
			)}
			<br />
			<Form onSubmit={handleReviewSubmit}>
				<InputGroup className="mb-3">
					<FormControl
						className={styles.commentInput}
						placeholder="Leave a comment..."
						aria-label="Comment"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<Button
						className={styles.cardBtn}
						variant="outline-secondary"
						type="submit"
						disabled={rating === 0 || newComment.trim() === ""}
					>
						Post
					</Button>
				</InputGroup>
				<StarRatings
					rating={rating}
					starRatedColor="gold"
					changeRating={handleRatingChange}
					numberOfStars={5}
					name="rating"
					starHoverColor="gold"
					starDimension="20px"
				/>
			</Form>
		</div>
	);
};

export default CommentSection;
