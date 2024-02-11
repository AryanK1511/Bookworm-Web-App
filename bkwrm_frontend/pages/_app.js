import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { isAuthenticated, getToken } from "@/lib/userAuth";
import { jwtDecode } from "jwt-decode";
import Footer from "@/components/Footer/Footer";

// ========== APP COMPONENT (LAYOUT) ==========
export default function App({ Component, pageProps }) {
	// Getting the user state from the store
	const [user, setUser] = useAtom(userAtom);

	// Setting style
	const appStyle = {
		backgroundColor: "#000000",
		color: "#ffffff",
		minHeight: "100vh", 
	};

	// Set user state on page load
	useEffect(() => {
		if (isAuthenticated()) {
			let usr = jwtDecode(getToken());
			setUser({ isAuthenticated: true, user: usr });
		}
	}, []);

	return (
		<div style={appStyle}>
			<Navbar />
			<Component {...pageProps} />
			{/* <Footer /> */}
		</div>
	);
}
