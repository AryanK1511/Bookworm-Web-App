import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Button,
	Badge,
	DropdownButton,
	Dropdown,
	Alert,
} from "react-bootstrap";
import { getReadingList, deleteAllBooks } from "@/lib/readingList";
import { useRouter } from "next/router";
import BookCard from "@/components/ReadingListBookCard/ReadingListBookCard";

// ========== ReadingList Page Component ==========
const ReadingListPage = () => {
	// Define state variables
	const [readingList, setReadingList] = useState([]);
	const [filter, setFilter] = useState("All");

	// Define a router instance
	const router = useRouter();

	// Fetch the reading list
	const fetchReadingList = async () => {
		const response = await getReadingList();

		if (response.success) {
			setReadingList(response.data);
		} else {
			console.error("Failed to get reading list:", response.message);
		}
	};

	// Handle delete all books
	const handleDeleteAll = async () => {
		const response = await deleteAllBooks();

		if (response.success) {
			fetchReadingList(); // Refresh the reading list
		}
	};

	// Fetch the reading list on initial render
	useEffect(() => {
		fetchReadingList();
	}, []);

	// Filter the reading list based on the selected status
	const filteredList =
		filter === "All"
			? readingList
			: readingList.filter(
					(book) => book.status === filter.toLowerCase(),
				);

	return (
		<Container>
			<h1 className="rl-title-heading">My Reading List</h1>
			<div className="filter-badge">
				<Badge pill bg="secondary" className="filter-badge">
					{filter} Books
				</Badge>
			</div>
			<br />
			<br />
			<Dropdown align="end" className="rl-dropdown">
				<Dropdown.Toggle
					id="filter-dropdown"
					className="rl-dropdown-btn"
				>
					<span className="filter-text">Select Filter</span>
				</Dropdown.Toggle>
				<Dropdown.Menu className="dropdown-menu">
					<Dropdown.Item
						className="dropdown-item"
						onClick={() => setFilter("All")}
					>
						All
					</Dropdown.Item>
					<Dropdown.Item
						className="dropdown-item"
						onClick={() => setFilter("Unread")}
					>
						Unread
					</Dropdown.Item>
					<Dropdown.Item
						className="dropdown-item"
						onClick={() => setFilter("Reading")}
					>
						Reading
					</Dropdown.Item>
					<Dropdown.Item
						className="dropdown-item"
						onClick={() => setFilter("Read")}
					>
						Read
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			{filteredList.length > 0 ? (
				<div className="filter-badge">
					<Row>
						{filteredList.map((book) => (
							<Col key={book.id} sm={12} md={6} lg={4}>
								<BookCard
									book={book}
									fetchReadingList={fetchReadingList}
								/>
							</Col>
						))}
					</Row>
					<Button
						variant="danger"
						className="delete-btn"
						onClick={handleDeleteAll}
					>
						Delete All
					</Button>
				</div>
			) : (
				<Alert variant="info" className="alert-banner">
					<span className="alert-banner-text">List is empty</span>
					<br />
					<Button
						variant="primary"
						onClick={() => router.push("/explore")}
						className="alert-btn"
					>
						Explore Books
					</Button>
				</Alert>
			)}
		</Container>
	);
};

export default ReadingListPage;
