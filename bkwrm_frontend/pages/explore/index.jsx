import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import ExplorePageBookCard from "@/components/ExplorePageBookCard/ExplorePageBookCard";
import SearchBar from "@/components/Searchbar/SearchBar";

// ========== EXPLORE PAGE ==========
const ExplorePage = () => {
    // State to store details
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");
    const [inputValue, setInputValue] = useState("");

    // Function to fetch books from the Google Books API
    // This function is delayed as it is debounced to avoid making too many requests
    const fetchBooks = debounce(async (query) => {
        if (!query.trim()) return; // Avoid empty query search
        const API_KEY = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
        )}&key=${API_KEY}&maxResults=20`;

        try {
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data.items || []);
        } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
        }
    }, 300);

    // Effect to handle real-time search when query changes
    useEffect(() => {
        if (query) fetchBooks(query);
    }, [query]);

    // Function to handle the query change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="p-4">
        <h1 className="text-2xl text-center font-bold mb-6">Explore Books</h1>
        <div className="flex justify-center mb-8">
            <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for books..."
            className="p-2 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
            <div
                key={book.id}
                className="border rounded-lg p-4 flex flex-col items-center"
            >
                <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="w-1/2 mb-4"
                />
                <h2 className="text-lg font-semibold">{book.volumeInfo.title}</h2>
                <p className="text-md text-gray-800">
                {book.volumeInfo.authors?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                {book.volumeInfo.publishedDate}
                </p>
            </div>
            ))}
        </div>
        {books.length === 0 && query && (
            <div className="text-center text-gray-500">
            No books found. Try searching for something else.
            </div>
        )}
        </div>
    );
};

export default ExplorePage;
