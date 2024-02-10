import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookDetailsCard from '@/components/BookDetailsCard/BookDetailsCard';
import { getBookDetails } from '@/lib/bookDetails';
import { useRouter } from 'next/router';
import CommentSection from '@/components/CommentSection/CommentSection';
import { useAtom } from "jotai";
import { userAtom } from "@/store";

// ========== BOOK PAGE ==========
const ExploreSpecificBook = () => {
    const router = useRouter();
    const { id } = router.query;

    // Setting the States
    const [ bookDetails, setBookDetails ] = useState({});
    const [ reviews, setReviews ] = useState([{}]);

    // Authentication check
    const [user] = useAtom(userAtom);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user.isAuthenticated) router.push('/login');
    }, [user, router]);

    // Fetching the book details
    useEffect(() => {
        // Ensure the function is only called when id is available and router is ready
        if (router.isReady && id) {
            const fetchBookDetails = async (bookId) => {
                const response = await getBookDetails(bookId);
                if (response.success) {
                    setBookDetails(response.data.book_details);
                    setReviews(response.data.reviews);
                    console.log(response.data);
                } else {
                    router.push('/explore');
                }
            };
            fetchBookDetails(id);
        }
    }, [id, router.isReady]); // Add both id and router.isReady as dependencies

    return (
        <Container>
            <h1 className='book-title-heading'>{bookDetails?.volumeInfo?.title}</h1>
            <h3 className='book-title-author'>By <span id='book-author'>{bookDetails?.volumeInfo?.authors ? bookDetails.volumeInfo.authors.join(", ") : "Anonymous"}</span></h3>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <BookDetailsCard bookDetails={bookDetails} reviews={reviews} />
                    <CommentSection reviews={reviews} id={bookDetails?.id} />
                </Col>
            </Row>
        </Container>
    );
};

export default ExploreSpecificBook;
