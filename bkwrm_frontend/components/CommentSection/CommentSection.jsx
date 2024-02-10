import React, { useState } from 'react';
import { Button, ListGroup, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { addReview } from '@/lib/bookDetails';
import { useRouter } from 'next/router';

const CommentSection = ({ reviews, id, fetchBookDetails}) => {
    console.log(id);
    const router = useRouter();

    const [ newComment, setNewComment ] = useState('');
    const [ rating, setRating ] = useState(0);

    const [ user ] = useAtom(userAtom);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        // Add your submission logic here
        console.log(newComment, rating);
        console.log("User ID: ", user.user.sub.id);

        let result = await addReview(id, newComment, rating);

        if (result.success) {  
            await fetchBookDetails(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Optional: for smooth scrolling
            });
            setNewComment('');
            setRating(0);
            // After adding the comment and updating the state
    
        } else {
            router.push('/explore');
        }
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    return (
        <div>
            <ListGroup variant="flush">
                {reviews && reviews.length > 0 && reviews.map(review => (
                    <ListGroup.Item key={review.id} className="d-flex align-items-start">
                        {/* User's Profile Picture */}
                        <Image 
                            src={review.profile_picture || 'default_profile_pic_url'} 
                            roundedCircle 
                            style={{ width: '50px', height: '50px', marginRight: '15px' }} 
                        />
                        {/* User Rating and Review */}
                        <div className="flex-grow-1">
                            <div><strong>{review.fullname || 'Anonymous'}</strong></div>
                            <div style={{ color: 'gray'}}>{review.username}</div>
                            <div style={{ color: 'gray', marginBottom: '10px' }}>
                                {new Date(review.date_posted).toLocaleDateString()} {new Date(review.date_posted).toLocaleTimeString()}
                            </div>
                            <div>{review.review_text}</div>
                            <StarRatings
                                rating={review.rating}
                                starDimension="20px"
                                starSpacing="2px"
                                starRatedColor="gold"
                            />
                        </div>
                        {/* Conditionally render a delete button */}
        {review.user_id === user.user.sub.id && (
            <Button variant="danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                Delete
            </Button>
        )}
                    </ListGroup.Item>
                ))}
            </ListGroup><br />
            {/* Form to submit more reviews */}
            <Form onSubmit={handleReviewSubmit}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Leave a comment..."
                        aria-label="Comment"
                        aria-describedby="basic-addon2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button variant="outline-secondary" type="submit">
                        Post
                    </Button>
                </InputGroup>
                <StarRatings
                    rating={rating}
                    starRatedColor="gold"
                    changeRating={handleRatingChange}
                    numberOfStars={5}
                    name='rating'
                />
            </Form>
        </div>
    );
};

export default CommentSection;
