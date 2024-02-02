import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import ExplorePageBookCard from "@/components/ExplorePageBookCard/ExplorePageBookCard";
import SearchBar from "@/components/Searchbar/SearchBar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";

// ========== EXPLORE PAGE ==========
const ExplorePage = () => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("");
    const router = useRouter(); // Initialize useRouter

    // Use userAtom to check if user is authenticated
    const [user, setUser] = useAtom(userAtom);

    // Redirect to login page if user is not authenticated
    useEffect(() => {
        if (!user.isAuthenticated) {
            router.push('/login'); // Redirect to login page
        }
    }, [user, router]);

    // Function to fetch books from the Google Books API
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