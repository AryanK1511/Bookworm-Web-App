"use client"

import React, { useState } from "react";
import Link from "next/link";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from '@headlessui/react';
import SearchBar from "@/components/Searchbar/SearchBar";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";
import "./Navbar.css";

const Navbar = ({ user }) => {
  // State for the hamburger menu
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  return (
    <nav className="navbar-style">
      <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
        
        {/* Left Section: Bookworm Logo and Links */}
        <div className="flex items-center">
          {/* Bookworm Logo Line */}
          <div className="flex items-center py-4 px-2 bkwrm-logo-word">
            <Link legacyBehavior href="/">
              <a className="bkwrm-logo-text">Bookworm</a>
            </Link>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center py-4 px-2 nav-text space-x-7">
            <Link legacyBehavior href="/">
              <a className="nav-link" href="/">Home</a>
            </Link>
            <Link legacyBehavior href="/about">
              <a className="nav-link" href="/about">About</a>
            </Link>
            <Link legacyBehavior href="/explore">
              <a className="nav-link" href="/expore">Explore</a>
            </Link>
            <Link legacyBehavior href="/reading-list">
              <a className="nav-link">Reading List</a>
            </Link>
          </div>
        </div>

        {/* Right Section: Search Bar and Profile */}
        <div className="flex items-center">
          {/* Search Input */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Profile section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link legacyBehavior href="/login">
                <a className="py-2 px-2 font-medium text-gray-500 rounded hover:text-white transition duration-300">
                  Log In
                </a>
              </Link>
            )}

            {/* Hamburger Menu */}
            <div className="md:hidden flex items-center ml-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                    <CloseIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={isMenuOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-left">
              <Link legacyBehavior href="/">
                <a className="block text-gray-500 hover:bg-green-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Home
                </a>
              </Link>
              <Link legacyBehavior href="/about">
                <a className="block text-gray-500 hover:bg-green-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  About
                </a>
              </Link>
              <Link legacyBehavior href="/explore">
                <a className="block text-gray-500 hover:bg-green-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Explore
                </a>
              </Link>
              <Link legacyBehavior href="/reading-list">
                <a className="block text-gray-500 hover:bg-green-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Your Reading List
                </a>
              </Link>
              {/* Mobile SearchBar */}
              <div className="pt-2">
                <SearchBar />
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <hr className="hr-class" />
    </nav>
  );
};

export default Navbar;
