import React, { useState } from "react";

// ===== SEARCHBAR COMPONENT =====
const SearchBar = () => {
    // Defining the states to track the search field
    const [ searchText, setSearchText ] = useState(null);

    return (
        <div className="flex justify-center searchBar">
            <div className="searchbarTextbox rounded-md">
            <input className="bg-transparent border-none text-gray-500 mr-3 px-2 leading-tight focus:outline-none" type="text" placeholder="Search books..." aria-label="Search books" />
            <button className="searchButton text-white  px-4 py-2">Search</button>
            </div>
        </div>
    );
}

export default SearchBar;