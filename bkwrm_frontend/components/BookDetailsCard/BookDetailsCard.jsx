import React from "react";
import { Card, Badge } from "react-bootstrap";
import StarRatings from "react-star-ratings";

const BookDetailsCard = ({ bookDetails, reviews }) => {
	// Calculate average rating
	const averageRating =
		reviews.reduce((acc, review) => acc + review.rating, 0) /
			reviews.length || 0;

	return (
		<Card className="mb-4 book-card">
			<Card.Img
				variant="top"
				src={bookDetails?.volumeInfo?.imageLinks?.thumbnail}
			/>
			<Card.Body>
				<Card.Text>{bookDetails?.volumeInfo?.description}</Card.Text>
				<StarRatings
					rating={averageRating}
					starRatedColor="gold"
					numberOfStars={5}
					name="rating"
				/>
				<Badge bg="secondary">{reviews.length} Reviews</Badge>
			</Card.Body>
		</Card>
	);
};

export default BookDetailsCard;
