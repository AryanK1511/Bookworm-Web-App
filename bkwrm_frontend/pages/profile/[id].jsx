import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserDetails } from '@/lib/userFunctions';
import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import styles from './ProfilePage.module.css';

// ========== PROFILE PAGE ==========
const ProfilePage = () => {
    // Define Router and get user ID from URL
    const router = useRouter();
    const { id } = router.query;

    // State var for user details
    const [ userDetails, setUserDetails ] = useState({});

    // Fetch user details from server
    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await getUserDetails(id);
            if (response.success) {
                setUserDetails(response.data);
            } else {
                router.push('/');
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    return (
        <Container className={`d-flex justify-content-center align-items-center ${styles.profileContainer}`}>
            <Card className={styles.profileCard}>
                <Card.Body className={styles.cardBody}>
                    <div className={styles.imageContainer}>
                        <img src={userDetails.profile_picture} alt="Profile Picture" className={styles.profileImage} />
                    </div>
                    <Card.Title className={styles.cardTitle}>{userDetails.fullname}</Card.Title>
                    <ListGroup className={styles.listGroup}>
                        <ListGroup.Item className={styles.item}>{userDetails.email}</ListGroup.Item>
                        <ListGroup.Item className={styles.item}>{userDetails.username}</ListGroup.Item>
                        <ListGroup.Item className={styles.item}>
                            <p>Member Since:</p>
                            <p>{new Date(userDetails.date_joined).toLocaleDateString()}</p>
                        </ListGroup.Item>
                    </ListGroup>
                    <Button variant="primary" className={styles.editButton} onClick={() => router.push(`/edit-profile/${id}`)}>Edit Profile</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfilePage;
