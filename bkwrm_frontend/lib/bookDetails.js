import { getToken } from "./userAuth";

/*
===================================
Book Details functionality
===================================
*/

// => Get a books details and the review data
const getBookDetails = async (bookId) => {
    const token = getToken();

    // Make a GET request to the /get-details route of the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/get-details/${bookId}`, {
        method: 'GET', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();

    // Throw an error if response is not 200
    if (response.ok) {
        return { success: true, data: data };
    } else {    
        console.error("Fetching book details failed:", data.message);
        return { success: false, message: data.message };
    }
}

// => Add a user review
const addReview = async (bookId, reviewText, rating) => {
    const token = getToken();

    // Make a POST request to the /add-review route of the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/add`, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ "bookId": bookId, "reviewText": reviewText, "rating": rating })
    });
    const data = await response.json();

    // Throw an error if response is not 200
    if (response.ok) {
        return { success: true, data: data };
    } else {    
        console.error("Adding review failed:", data.message);
        return { success: false, message: data.message };
    }
}


export { getBookDetails, addReview };