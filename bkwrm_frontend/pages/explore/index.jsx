// Import necessary hooks and components
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import ExplorePageBookCard from "@/components/ExplorePageBookCard/ExplorePageBookCard";
import SearchBar from "@/components/Searchbar/SearchBar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import styles from "./explore.module.css";

// ========== EXPLORE PAGE ==========
const ExplorePage = () => {
    // Setting the States 
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");

    // Getting the router
    const router = useRouter();

    // Authentication check
    const [user] = useAtom(userAtom);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user.isAuthenticated) router.push('/login');
    }, [user, router]);

    // Function to fetch books from the Google Books API
    // Debounce the function to prevent too many requests
    const fetchBooks = debounce(async (query) => {
        if (!query.trim()) return;
        const API_KEY = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=20`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setBooks(data.items || []);
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        }
    }, 300);

    // Fetch books when query changes
    useEffect(() => {
        if (query) fetchBooks(query);
    }, [query]);

    return (
        <div className={`${styles.explorePage} p-4 bg-black min-h-screen text-white`}>
            <div className="text-center mt-10 pt-16 pb-4">
                <h1 className={`${styles.titleHeading} text-4xl font-bold mb-2`}>
                <span className={styles.orangeYellow}>Explore</span>{' '}
                <span className={styles.red}>Books</span>
                </h1>
                <p className="mb-4 text-xl">Search your favourite books</p>
            </div>
            <SearchBar query={query} setQuery={setQuery} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {books.map((book) => (
                    <ExplorePageBookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;