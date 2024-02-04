import React, { useState, useEffect } from "react";
import Link from "next/link";
import { addBookToReadingList } from "@/lib/readingList";
import { useRouter } from "next/router";

// ========== BOOK CARD COMPONENT COMPONENT ===========
const ExplorePageBookCard = ({ book }) => {
    const router = useRouter();

    // Define a state variable to track the result of the async operation
    const [isAddingBook, setIsAddingBook] = React.useState(false);

    // Add book to reading list
    const handleBookAddition = async () => {
        setIsAddingBook(true); // Set loading state

        try {
            // Call the add function
            const response = await addBookToReadingList(book);

            // Check if login is successful
            if (response.success) {
                // Redirect to the users reading list
                router.push("/reading-list");
            } else {
                console.error("Addition of book to reading list failed:", response.message);
                router.push("/explore");
            }
        } catch (error) {
            console.error("Error adding book to reading list:", error);
            setIsAddingBook(false); // Reset loading state on error
        }
    };

    useEffect(() => {
        setIsAddingBook(false); // Reset loading state when the component unmounts
    }, []);

    return (
        <div className="bg-dark rounded overflow-hidden shadow-lg">
            <img className="w-full h-72 object-cover" src={book.volumeInfo.imageLinks?.thumbnail || '/default_book_image_url'} alt={book.volumeInfo.title} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-white">{book.volumeInfo.title}</div>
                <p className="text-gray-400 text-base">
                    {book.volumeInfo.authors?.join(', ')}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <Link href={`/explore/${book.id}`} legacyBehavior>
                    <a className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Read more...</a>
                </Link>
                <button
                    onClick={handleBookAddition}
                    className="inline-block border border-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 hover:border-gray-400"
                    disabled={isAddingBook} // Disable the button during the async operation
                >
                    {isAddingBook ? "Adding..." : "Add to Reading List"}
                </button>
            </div>
        </div>
    );
};

export default ExplorePageBookCard;
