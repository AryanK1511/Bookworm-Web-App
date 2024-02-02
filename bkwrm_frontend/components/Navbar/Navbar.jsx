import React, { useState, useEffect } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Transition } from "@headlessui/react";
import SearchBar from "@/components/Searchbar/SearchBar";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";
import { isUserAuthenticated } from "@/lib/userAuth";
import { useAtom } from "jotai";
import { userAtom } from "@/store";

// ========== NAVBAR COMPONENT ==========
const Navbar = () => {
  // Tracking user atom state
  const [{ isAuthenticated, user }] = useAtom(userAtom);
  // Tracking menu state to toggle hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [user, setUser] = useState(null);

  // Effect to check user authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Checking auth status...")
      console.log("User data:", user);
      console.log("isAuthenticated:", isAuthenticated);
      // Use atoms to check auth status
      

      // const authStatus = await isUserAuthenticated();
      // const authStatus = await isUserAuthenticated();
      // if (authStatus.isAuthenticated) {
      //   setUser(authStatus.user); // Set user data if authenticated
      // } else {
      //   setUser(null); // Clear user data if not authenticated
      // }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log("User data:", user);
  }, []);

  return (
    <nav className="navbarStyle">
      <div className="max-w-8xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Bookworm Logo */}
        <div className="flex items-center">
          <Link legacyBehavior href="/">
            <a className="bkwrmLogoWord">Bookworm</a>
          </Link>
        </div>

        {/* Hamburger Menu and Profile Dropdown for Mobile Screens */}
        <div className="flex items-center md:hidden">
          {/* Profile Dropdown, always shown */}
          {user && <ProfileDropdown user={user} />}

          {/* Hamburger Menu */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2">
            {isMenuOpen ? (
              <CloseIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navigation Links for Large Screens */}
        <div className="hidden md:flex items-center space-x-7">
          <Link legacyBehavior href="/">
            <a className="navLink">Home</a>
          </Link>
          <Link legacyBehavior href="/about">
            <a className="navLink">About</a>
          </Link>
          <Link legacyBehavior href="/explore">
            <a className="navLink">Explore</a>
          </Link>
          {user && (
            <Link legacyBehavior href="/reading-list">
              <a className="navLink">Reading List</a>
            </Link>
          )}

          {!user && (
            <Link legacyBehavior href="/login">
              <a className={`py-2 px-4 loginButton rounded`}>Log In</a>
            </Link>
          )}
        </div>

        {/* Profile Dropdown for Large Screens */}
        {user && (
          <div className="hidden md:block">
            <ProfileDropdown user={user} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isMenuOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {(ref) => (
          <div ref={ref} className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link legacyBehavior href="/">
                <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">
                  Home
                </a>
              </Link>
              <Link legacyBehavior href="/about">
                <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">
                  About
                </a>
              </Link>
              <Link legacyBehavior href="/explore">
                <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">
                  Explore
                </a>
              </Link>
              {user && (
                <Link legacyBehavior href="/reading-list">
                  <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">
                    Your Reading List
                  </a>
                </Link>
              )}
              {/* Mobile SearchBar */}
              <SearchBar />
              {!user && (
                <Link legacyBehavior href="/login">
                  <a
                    className={`loginButton block px-3 py-2 rounded-md font-medium`}
                  >
                    Log In
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
};

export default Navbar;
