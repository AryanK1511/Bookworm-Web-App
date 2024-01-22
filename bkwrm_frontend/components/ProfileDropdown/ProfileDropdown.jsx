"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ProfileDropdown.css";

// ===== PROFILE DROPDOWN COMPONENT =====
const ProfileDropdown = ({ user }) => {
    // Setting the States and References
    const [ isOpen, setIsOpen ] = useState(false);
    const dropdownRef = useRef(null);

    // Function to close the dropdown when clicked outside
    const handleClickOutside = (event) => {
        // Check to see whether the se clicked outside and whether the target is not a child of the dropdown component
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    // Handle outside click
    useEffect(() => {
        // Bind event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the even listener on cleanup
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User's Profile Picture */}
            <button onClick={() => setIsOpen(!isOpen)} className="block">
                <Image
                    src="/assets/images/default_profile_pic.jpg"
                    alt="User profile picture"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown absolute right-0 w-48 py-2 mt-2 rounded-md">
                    <Link legacyBehavior href="/profile">
                        <a className="dropdown-link block px-4 py-2 text-sm">Your Profile</a>
                    </Link>
                    <Link legacyBehavior href="/reading-list">
                        <a className="dropdown-link block px-4 py-2 text-sm">Your Reading List</a>
                    </Link>
                    <Link legacyBehavior href="/logout">
                        <a className="dropdown-link block px-4 py-2 text-sm">Logout</a>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;