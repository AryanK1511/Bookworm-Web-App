import React, { useEffect } from "react";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { isAuthenticated, getToken } from "@/lib/userAuth";
import { jwtDecode } from "jwt-decode";

// ========== APP COMPONENT (LAYOUT) ==========
export default function App({ Component, pageProps }) {
  // Getting the user state from the store
  const [user, setUser] = useAtom(userAtom);

  // Set user state on page load
  useEffect(() => {
    if (isAuthenticated()) {
      setUser({ isAuthenticated: true, user: jwtDecode(getToken()) });
    }
  }, []);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
