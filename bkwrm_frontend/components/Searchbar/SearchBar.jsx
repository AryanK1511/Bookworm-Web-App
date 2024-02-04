import React from "react";
import styles from "./Searchbar.module.css";

// ===== SEARCHBAR COMPONENT =====
const SearchBar = ({ query, setQuery }) => {

    // Function to handle the query change
    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="flex justify-center items-center mb-14">
            <div className="relative w-full max-w-md">
                <input
                    className={`${styles.searchInput} w-full  rounded-lg text-sm focus:outline-none focus:border-blue-500`}
                    type="text"
                    placeholder="Search books..."
                    aria-label="Search books"
                    value={query}
                    onChange={handleQueryChange}
                />
            </div>
        </div>
    );
};

export default SearchBar;
