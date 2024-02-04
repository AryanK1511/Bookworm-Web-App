import React, { useState } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Transition } from "@headlessui/react";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import 'bootstrap/dist/css/bootstrap.min.css';

// ========== NAVBAR COMPONENT ==========
const Navbar = () => {
  // Getting the user state from the store
  const [{ isAuthenticated, user }] = useAtom(userAtom);
  
  // Setting the state for the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbarStyle">
      <div className="max-w-8xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-7">
          <Link legacyBehavior href="/">
            <a className="bkwrmLogoWord">Bookworm</a>
          </Link>
          <Link legacyBehavior href="/about">
            <a className="navLink">About</a>
          </Link>
          <Link legacyBehavior href="/explore">
            <a className="navLink">Explore</a>
          </Link>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          {!user ? (
            <Link legacyBehavior href="/login">
              <a className={`py-2 px-4 loginButton rounded`}>Log In</a>
            </Link>
          ) : (
            <ProfileDropdown user={user} />
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2">
            {isMenuOpen ? (
              <CloseIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

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
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
};

export default Navbar;
