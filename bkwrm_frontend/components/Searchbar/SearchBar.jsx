import React, { useState, useEffect } from "react";

// ===== SEARCHBAR COMPONENT =====
const SearchBar = ({ query, setQuery }) => {

    // Function to handle the query change
    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="flex justify-center searchBar">
        <div className="searchbarTextbox rounded-md">
            <input
            className="bg-transparent border-none text-gray-500 mr-3 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Search books..."
            aria-label="Search books"
            onChange={handleQueryChange}
            />
        </div>
        </div>
    );
};

export default SearchBar;
