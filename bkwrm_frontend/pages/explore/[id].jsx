import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookDetailsCard from '@/components/BookDetailsCard/BookDetailsCard';
import CommentSection from '@/components/CommentSection/CommentSection';
import { getBookDetails } from '@/lib/bookDetails';
import { useRouter } from 'next/router';
import { useAtom } from "jotai";
import { userAtom } from "@/store";

const ExploreSpecificBook = () => {
    const router = useRouter();
    const { id } = router.query;
    const [bookDetails, setBookDetails] = useState({});
    const [reviews, setReviews] = useState([]);
    const [user] = useAtom(userAtom);

    console.log("User: ", user);

    const fetchBookDetails = async () => {
        if (router.isReady && id) {
            const response = await getBookDetails(id);
            if (response.success) {
                setBookDetails(response.data.book_details);
                setReviews(response.data.reviews || []); // Ensure fallback to empty array
            } else {
                // Consider handling errors, e.g., showing a message or redirecting
                console.error("Fetching book details failed:", response.message);
            }
        }
    };

    useEffect(() => {
        fetchBookDetails();
        console.log(reviews)
    }, [id, router.isReady]);

    return (
        <Container>
            <h1 className='book-title-heading'>{bookDetails?.volumeInfo?.title}</h1>
            <h3 className='book-title-author'>By <span id='book-author'>{bookDetails?.volumeInfo?.authors?.join(", ") || "Anonymous"}</span></h3>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <BookDetailsCard bookDetails={bookDetails} reviews={reviews} />
                    <CommentSection reviews={reviews} id={id} fetchBookDetails={fetchBookDetails} />
                </Col>
            </Row>
        </Container>
    );
};

export default ExploreSpecificBook;
