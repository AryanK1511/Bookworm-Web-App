import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProfileDropdown.module.css";
import { logoutUser } from "@/lib/userAuth";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { userAtom } from "@/store";

// ===== PROFILE DROPDOWN COMPONENT =====
const ProfileDropdown = () => {
	// Getting the user state from the store
	const [userState, setUserState] = useAtom(userAtom);

	// Getting the router
	const router = useRouter();

	// Setting the States and References
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Function to clear JWT and redirect to login page
	const handleLogout = async () => {
		try {
			await logoutUser();
			setUserState({ isAuthenticated: false, user: null });
			router.push("/");
		} catch (error) {
			console.error("Logout Failed:", error.message);
		}
	};

	// Function to close the dropdown when clicked outside
	const handleClickOutside = (event) => {
		// Check to see whether the user clicked outside and whether the target is not a child of the dropdown component
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target)
		) {
			setIsOpen(false);
		}
	};

	// Handle outside click
	useEffect(() => {
		// Bind event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the even listener on cleanup
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			{/* User's Profile Picture */}
			{userState.user && ( // Check if userState.user is not null before rendering the button
				<button onClick={() => setIsOpen(!isOpen)} className="block">
					<Image
						src={userState.user.sub.profile_picture}
						alt="User profile picture"
						width={32}
						height={32}
						className={styles.profPic}
						layout="fixed" // add this if you're using Next.js Image component
					/>
				</button>
			)}

			{/* Dropdown Menu */}
			{isOpen && userState.user && (
				<div
					className={`${styles.dropdown} absolute right-0 w-48 py-2 mt-2 rounded-md`}
				>
					<Link
						legacyBehavior
						href={`/profile/${userState.user.sub.id}`}
					>
						<a
							className={`${styles.dropdownLink} block px-4 py-2 text-sm`}
						>
							Your Profile
						</a>
					</Link>
					<Link legacyBehavior href={`/readinglist/${userState.user.sub.id}`}>
						<a
							className={`${styles.dropdownLink} block px-4 py-2 text-sm`}
						>
							Your Reading List
						</a>
					</Link>
					<button
						onClick={handleLogout}
						className={`${styles.dropdownLink} block px-4 py-2 text-sm`}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileDropdown;
