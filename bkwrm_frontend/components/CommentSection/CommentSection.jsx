import React, { useState } from 'react';
import { Button, ListGroup, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { addReview } from '@/lib/bookDetails';
import { useRouter } from 'next/router';

const CommentSection = ({ reviews, id }) => {
    console.log(id);
    const router = useRouter();

    const [ newComment, setNewComment ] = useState('');
    const [ rating, setRating ] = useState(0);

    const [ user ] = useAtom(userAtom);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        // Add your submission logic here
        console.log(newComment, rating);

        let result = await addReview(id, newComment, rating);

        // Clear the input fields
        setNewComment('');
        setRating(0);

        if (result.success) {   
            router.replace(`/explore/${id}`);
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
