import React, { useEffect } from "react";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { isAuthenticated, getToken } from "@/lib/userAuth";
import { jwtDecode } from "jwt-decode";

export default function App({ Component, pageProps }) {
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
