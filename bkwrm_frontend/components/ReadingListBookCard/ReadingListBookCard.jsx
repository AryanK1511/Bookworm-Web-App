import React from "react";
import { Card, Button, Badge, Dropdown } from "react-bootstrap";
import { updateBookStatus, deleteBookFromReadingList } from "@/lib/readingList";
import styles from "./ReadingListBookCard.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

// ========== Status Colors ==========
const statusColors = {
	unread: "secondary",
	reading: "warning",
	read: "success",
};

// ========== BookCard Component ==========
const BookCard = ({ book, fetchReadingList }) => {
	const router = useRouter();

	// Function to convert UTC date to local date
	const convertUTCDateToLocalDate = (dateString) => {
		const date = new Date(dateString);
		const newDate = new Date(
			date.getTime() + date.getTimezoneOffset() * 60 * 1000,
		);
		const offset = date.getTimezoneOffset() / 60;
		const hours = date.getHours();
		newDate.setHours(hours - offset);
		return newDate;
	};

	// Format date
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return convertUTCDateToLocalDate(dateString).toLocaleDateString(
			undefined,
			options,
		);
	};

	// Handle status change
	const handleStatusChange = async (newStatus) => {
		const response = await updateBookStatus(
			book.google_books_id,
			newStatus,
		);

		if (response.success) {
			fetchReadingList(); // Refresh the reading list
		} else {
			console.error("Failed to update book status:", response.message);
		}
	};

	// Handle delete book
	const handleDeleteBook = async (bookId) => {
		const response = await deleteBookFromReadingList(bookId);

		if (response.success) {
			fetchReadingList(); // Refresh the reading list
		} else {
			console.error("Failed to delete book:", response.message);
		}
	};

	return (
		<Card className={`shadow-sm ${styles.bookCard}`}>
			<Card.Img
				variant="top"
				src={book.image_url}
				className={styles.cardImage}
			/>
			<Card.Body>
				<Card.Title className={styles.cardTitle}>
					{book.title}
				</Card.Title>
				<Card.Text className={styles.cardAuthor}>
					{book.author}
				</Card.Text>
				<Card.Text className={styles.cardDate}>
					Added on: {formatDate(book.date_added)}
				</Card.Text>
				<div className="d-flex align-items-center">
					<Badge bg={statusColors[book.status]} className="me-2">
						{book.status.toUpperCase()}
					</Badge>
					<Dropdown align="end" className={styles.statusDropdown}>
						<Dropdown.Toggle
							split
							variant={statusColors[book.status]}
							id="dropdown-split-basic"
							className={`btn-sm ${styles.statusDropdownToggle}`} // Apply custom toggle class
						>
							{/* You can leave this empty if you only want the split arrow */}
						</Dropdown.Toggle>
						<Dropdown.Menu className={styles.statusDropdownMenu}>
							{" "}
							{/* Apply custom menu class if needed */}
							<Dropdown.Item
								className={styles.statusDropdownItem}
								eventKey="unread"
								onClick={() => handleStatusChange("unread")}
							>
								Unread
							</Dropdown.Item>
							<Dropdown.Item
								eventKey="reading"
								onClick={() => handleStatusChange("reading")}
							>
								Reading
							</Dropdown.Item>
							<Dropdown.Item
								eventKey="read"
								onClick={() => handleStatusChange("read")}
							>
								Read
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="d-flex justify-content-between">
					<Button
						variant="danger"
						className="mt-2 delete-btn"
						onClick={() => handleDeleteBook(book.google_books_id)}
					>
						Delete
					</Button>
					{""}
					<Button
						className="mt-2 ml-4 delete-btn"
						onClick={() =>
							router.push(`/explore/${book.google_books_id}`)
						}
					>
						View Book
					</Button>
				</div>
			</Card.Body>
		</Card>
	);
};

export default BookCard;
