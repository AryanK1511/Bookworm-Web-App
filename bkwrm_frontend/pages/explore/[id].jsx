import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BookDetailsCard from "@/components/BookDetailsCard/BookDetailsCard";
import CommentSection from "@/components/CommentSection/CommentSection";
import { getBookDetails } from "@/lib/bookDetails";
import { useRouter } from "next/router";
import {
	checkBookInReadingList,
	addBookToReadingList,
} from "@/lib/readingList";

// ========== EXPLORE SPECIFIC BOOK PAGE ===========
const ExploreSpecificBook = () => {
	const router = useRouter();
	const { id } = router.query;
	const [bookDetails, setBookDetails] = useState({});
	const [reviews, setReviews] = useState([]);
	const [isInReadingList, setIsInReadingList] = useState(false);

	// Fetch the book details from the API
	const fetchBookDetails = async () => {
		if (router.isReady && id) {
			const response = await getBookDetails(id);
			if (response.success) {
				setBookDetails(response.data.book_details);
				setReviews(response.data.reviews || []); // Ensure fallback to empty array

				// Check if the book is in the reading list
				const inListResponse = await checkBookInReadingList(id);
				setIsInReadingList(inListResponse.inReadingList);
			} else {
				console.error(
					"Fetching book details failed:",
					response.message,
				);
				router.push("/explore");
			}
		}
	};

	// Add the book to the reading list
	const handleAddToReadingList = async () => {
		// Call the API to add the book to the reading list
		const response = await addBookToReadingList(bookDetails);
		if (response.success) {
			setIsInReadingList(true);
			// Optionally, fetch the book details again to update the UI
			fetchBookDetails();
		} else {
			console.error(
				"Adding book to reading list failed:",
				response.message,
			);
		}
	};

	// Fetch the book details when the component mounts
	useEffect(() => {
		fetchBookDetails();
	}, [id]);

	return (
		<Container className="b-container">
			<h1 className="book-title-heading">
				{bookDetails?.volumeInfo?.title}
			</h1>
			<h3 className="book-title-author">
				By{" "}
				<span id="book-author">
					{bookDetails?.volumeInfo?.authors?.join(", ") ||
						"Anonymous"}
				</span>
			</h3>
			<div className="btn-div">
				{!isInReadingList ? (
					<Button variant="primary" onClick={handleAddToReadingList}>
						Add to Reading List
					</Button>
				) : (
					<Button variant="secondary" disabled>
						Added to Reading List
					</Button>
				)}
			</div>
			<Row className="justify-content-md-center">
				<Col md={8}>
					<BookDetailsCard
						bookDetails={bookDetails}
						reviews={reviews}
					/>
					<CommentSection
						reviews={reviews}
						id={id}
						fetchBookDetails={fetchBookDetails}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default ExploreSpecificBook;
