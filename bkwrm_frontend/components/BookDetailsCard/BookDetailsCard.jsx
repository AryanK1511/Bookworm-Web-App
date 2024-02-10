import React from "react";
import { Card, Badge } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import styles from "./BookDetailsCard.module.css";

// ========== BOOK DETAILS CARD COMPONENT ===========
const BookDetailsCard = ({ bookDetails, reviews }) => {
	// Calculate average rating
	const averageRating =
		reviews.reduce((acc, review) => acc + review.rating, 0) /
			reviews.length || 0;

	return (
		<Card className={`${styles.bookCard} mb-4`}>
			<Card.Img
				variant="bottom"
				className={styles.cardImage}
				src={bookDetails?.volumeInfo?.imageLinks?.thumbnail}
			/>
			<Card.Body className={styles.cardBody}>
				<Card.Text className={styles.cardText}>
					<div
						dangerouslySetInnerHTML={{
							__html: bookDetails?.volumeInfo?.description,
						}}
					/>
				</Card.Text>
				<StarRatings
					className={styles.starRating}
					rating={Math.floor(averageRating)}
					starRatedColor="gold"
					numberOfStars={5}
					name="rating"
					size="small"
					starDimension="20px"
				/>
				<Badge className={styles.cardBadge} bg="info">
					<Badge bg="secondary">{reviews.length}</Badge> Reviews{" "}
				</Badge>
			</Card.Body>
		</Card>
	);
};

export default BookDetailsCard;
