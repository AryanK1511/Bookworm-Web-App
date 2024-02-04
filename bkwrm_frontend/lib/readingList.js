import { getToken } from "./userAuth";

/*
===================================
Reading list functionality
===================================
*/

// => Add book to user's reading list
const addBookToReadingList = async (book) => {
    const token = getToken();
    console.log("Token:", token);

    // Make a POST request to the /register route of the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/add`, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ "google_books_id": book.id })
    });

    const data = await response.json();

    // Throw an error if response is not 200
    if (response.ok) {
        return { success: true, message: data.message};
    } else {
        console.error("Addition of book to reading list failed:", data.message);
        return { success: false, message: data.message };
    }
};

export { addBookToReadingList };