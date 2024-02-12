import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { isAuthenticated, getToken } from "@/lib/userAuth";
import { jwtDecode } from "jwt-decode";
import Footer from "@/components/Footer/Footer";
import { removeToken } from "@/lib/userAuth";

// ========== APP COMPONENT (LAYOUT) ==========
export default function App({ Component, pageProps }) {
	// Function to check if the token is expired
	function isTokenExpired(token) {
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000; // Convert to seconds
		return decodedToken.exp < currentTime;
	}
	// Getting the user state from the store
	const [user, setUser] = useAtom(userAtom);

	// Check if the user is authenticated
	// If the user is authenticated, set the user state to the user
	useEffect(() => {
		if (isAuthenticated()) {
			const token = getToken();
			if (isTokenExpired(token)) {
				removeToken(); // Remove the expired token
				setUser({ isAuthenticated: false, user: null }); // Update user state
			} else {
				let usr = jwtDecode(token);
				setUser({ isAuthenticated: true, user: usr });
			}
		}
	}, []);

	return (
		<div className="body-wrapper">
			<Navbar />

			<main style={{ flex: 1 }}>
				<Component {...pageProps} />
			</main>
			<Footer />
		</div>
	);
}
