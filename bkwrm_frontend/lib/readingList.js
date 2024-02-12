import { getToken } from "./userAuth";

/*
===================================
Reading list functionality
===================================
*/

// => Add book to user's reading list
const addBookToReadingList = async (book) => {
	const token = getToken();

	// Format the authors array into a string
	const authors = book.volumeInfo.authors
		? book.volumeInfo.authors.join(", ")
		: "Anonymous";

	// Make a POST request to the /register route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/books/add`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({
				google_books_id: book.id,
				title: book.volumeInfo.title,
				authors: authors,
				image_url: book.volumeInfo.imageLinks?.thumbnail,
			}),
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return { success: true, message: data.message };
	} else {
		console.error("Addition of book to reading list failed:", data.message);
		return { success: false, message: data.message };
	}
};

// => Get all books in user's reading list
const getReadingList = async () => {
	const token = getToken();

	// Make a GET request to the /books route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/books/readinglist`,
		{
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return {
			success: true,
			message: data.message,
			data: data.reading_list,
		};
	} else {
		console.error("Failed to get reading list:", data.message);
		return { success: false, message: data.message };
	}
};

// => Delete book from user's reading list
const deleteBookFromReadingList = async (bookId) => {
	const token = getToken();

	// Make a DELETE request to the /books route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/books/remove`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({ google_books_id: bookId }),
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return { success: true, message: data.message };
	} else {
		console.error("Failed to delete book from reading list:", data.message);
		return { success: false, message: data.message };
	}
};

// => Check if a book is in the user's reading list
const checkBookInReadingList = async (googleBooksId) => {
    const token = getToken();

    // Make a GET request to a new endpoint that checks for book presence in the reading list
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/check?google_books_id=${googleBooksId}`,
        {
            method: "GET",
            headers: {
				"Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        },
    );

    const data = await response.json();

    // If the response is ok, return the data indicating whether the book is in the reading list
    if (response.ok) {
        return { success: true, inReadingList: data.inReadingList };
    } else {
        console.error("Failed to check book in reading list:", data.message);
        return { success: false, message: data.message };
    }
};


// => Update book status
const updateBookStatus = async (bookId, status) => {
	const token = getToken();

	// Make a PUT request to the /books route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/books/update`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({ status: status, google_books_id: bookId }),
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return { success: true, message: data.message };
	} else {
		console.error("Failed to update book status:", data.message);
		return { success: false, message: data.message };
	}
};

// => Delete all books from reading list
const deleteAllBooks = async () => {
	const token = getToken();

	// Make a DELETE request to the /books route of the API
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/books/remove-all`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	// Throw an error if response is not 200
	if (response.ok) {
		return { success: true, message: data.message };
	} else {
		console.error(
			"Failed to delete all books from reading list:",
			data.message,
		);
		return { success: false, message: data.message };
	}
};

export {
	addBookToReadingList,
	getReadingList,
	deleteBookFromReadingList,
	updateBookStatus,
	deleteAllBooks,
	checkBookInReadingList
};
