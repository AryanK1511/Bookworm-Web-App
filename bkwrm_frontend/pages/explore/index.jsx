import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import ExplorePageBookCard from "@/components/ExplorePageBookCard/ExplorePageBookCard";
import SearchBar from "@/components/Searchbar/SearchBar";

// ========== EXPLORE PAGE ==========
const ExplorePage = () => {
    // State to store details
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");

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

    return (
        <div className="p-4 bg-black min-h-screen text-white">
            <h1 className="text-3xl text-center font-bold mb-6">Explore Books</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {books.map((book) => (
                    <ExplorePageBookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;
