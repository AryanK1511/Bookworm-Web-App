import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ExplorePageBookCard = ({ book }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={book.volumeInfo.imageLinks.thumbnail} />
            <Card.Body>
                <Card.Title>{book.volumeInfo.title}</Card.Title>
                <Card.Header>{book.volumeInfo.authors}</Card.Header>
                <Card.Text>{book.volumeInfo.description}</Card.Text>
                <Button variant="primary">Add to Reading List</Button>
                <Button variant="primary">Show Details</Button>
            </Card.Body>
        </Card>
    );
};

export default ExplorePageBookCard;