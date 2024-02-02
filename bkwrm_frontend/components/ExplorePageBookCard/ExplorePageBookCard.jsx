import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from './ExplorePageBookCard.module.css';

// ========== EXPLORE PAGE BOOK CARD COMPONENT ===========
const ExplorePageBookCard = ({ book }) => {
    return (
        <Card className={`${styles.bookCard} bg-dark text-white`} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={book.volumeInfo.imageLinks?.thumbnail || 'default_book_image_url'} />
            <Card.Body>
                <Card.Title>{book.volumeInfo.title}</Card.Title>
                <Card.Header className="bg-primary">{book.volumeInfo.authors?.join(', ')}</Card.Header>
                <Card.Text className={`${styles.cardText} text-white-50`}>{book.volumeInfo.description}</Card.Text>
                <Button variant="outline-light">Add to Reading List</Button>
                <Button variant="outline-light" className="ms-2">Show Details</Button>
            </Card.Body>
        </Card>
    );
};

export default ExplorePageBookCard;