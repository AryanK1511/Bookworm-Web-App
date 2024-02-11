import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, DropdownButton, Dropdown, Alert } from "react-bootstrap";
import { getReadingList, deleteAllBooks } from "@/lib/readingList";
import { useRouter } from "next/router";
import BookCard from "@/components/ReadingListBookCard/ReadingListBookCard";

// ========== ReadingList Page Component ==========
const ReadingListPage = () => {
    // Define state variables
    const [readingList, setReadingList] = useState([]);
    const [filter, setFilter] = useState("");

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
    const filteredList = readingList.filter(book => filter ? book.status === filter : true);

    return (
        <Container>
            <h1 className="rl-title-heading">My Reading List</h1>
            {filteredList.length > 0 ? (
                <>
                    <DropdownButton onSelect={setFilter} title="Filter by Status" className="mb-4 rl-dropdown-btn">
                        <Dropdown.Item eventKey="">All</Dropdown.Item>
                        <Dropdown.Item eventKey="unread">Unread</Dropdown.Item>
                        <Dropdown.Item eventKey="reading">Reading</Dropdown.Item>
                        <Dropdown.Item eventKey="read">Read</Dropdown.Item>
                    </DropdownButton>
                    <Row>
                        {filteredList.map(book => (
                            <Col key={book.id} sm={12} md={6} lg={4}>
                                <BookCard book={book} fetchReadingList={fetchReadingList} />
                            </Col>
                        ))}
                    </Row>
                    <Button variant="danger" className="mt-3 delete-btn" onClick={handleDeleteAll}>Delete All</Button>
                </>
            ) : (
                <Alert className="alert-banner">
                    <span className="alert-banner-text">No Books in this list</span><br /> <Button className="alert-btn" variant="primary" onClick={() => router.push("/explore")}>Explore Books</Button>
                </Alert>
            )}
        </Container>
    );
};

export default ReadingListPage;
