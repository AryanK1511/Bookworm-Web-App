import React, { useState } from "react";
import { authenticateUser } from "@/lib/userAuth";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { userAtom } from "@/store";
import { jwtDecode } from "jwt-decode";

// ========== LOGIN PAGE ==========
const LoginPage = () => {
    // Get the userAtom state and set the userAtom state
    const [ userState, setUserState ] = useAtom(userAtom);
    const router = useRouter()
    
    // Set state for auth
    const [ loginCred, setLoginCred ] = useState("");
    const [ password, setPassword ] = useState("");

    // State var for login error message
    const [loginError, setLoginError] = useState(null);

    // Update state with user inputs
    const handleInputChange = (e, setter) => setter(e.target.value);

    // Handle Form Submission
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            // Prepare user details
            const userDetails = {
                "login_credential": loginCred,
                "password": password 
            };

            // Call the authenticateUser function
            const response = await authenticateUser(userDetails);
            setUserState({ isAuthenticated: true, user: jwtDecode(response.token) });
            router.push("/");
            
        } catch (error) {
            let errs = {};
            errs["auth"] = "Incorrect username or password";
            // Set the registration error message
            setErrors(errs);
            console.error("Login Failed:", error.message);
        }
    };

    return (
        <div className="min-h-screen loginSignupPage flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold formHeading">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <a href="/signup" className="font-medium formSubheading">
                        sign up for a new account
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={submitForm}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Username or Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    required
                                    className="formInput appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setLoginCred)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="formInput appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setPassword)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="form-btn w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <div>
                                <button
                                    type="button"
                                    className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="w-5 h-5 mr-2" aria-hidden="true" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.9 0 7 1.6 9.4 4.7l7.2-7.2C37.9 3.9 31.3 1 24 1 14.8 1 6.8 5.8 2.1 13.1l8.3 6.4C12.6 13.8 18 10.5 24 10.5z"/>
                                        <path fill="#4285F4" d="M46.6 24.2c0-1.3-.1-2.5-.4-3.7H24v7.2h12.8c-.6 3-2.3 5.5-4.7 7.2l7.2 5.6c4.4-4 6.9-9.8 6.9-16.3z"/>
                                        <path fill="#FBBC05" d="M10.4 28.9c-.2-1-.3-2-.3-3.1s.1-2.1.3-3.1l-8.3-6.4C1 19.6 0 21.7 0 24s1 4.4 2.1 6.5l8.3-6.4z"/>
                                        <path fill="#34A853" d="M24 46c6.3 0 11.6-2.1 15.5-5.6l-7.2-5.6c-2.1 1.4-4.8 2.3-8.3 2.3-5 0-9.3-3.4-10.8-7.9l-8.4 6.5C6.8 40.2 14.8 46 24 46z"/>
                                        <path fill="none" d="M0 0h48v48H0z"/>
                                    </svg>
                                    <span className="ml-3">Sign in with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
