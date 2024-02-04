import React, { useEffect, useState } from "react";
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
    const [ loginError, setLoginError ] = useState(null);

    // State vars for validation errors
    const [ errors, setErrors ] = useState({});

    // Do not login if user is already authenticated
    useEffect(() => {  
        if (userState.isAuthenticated) router.push("/explore");
    }, [userState, router]);

    // Update state with user inputs
    const handleInputChange = (e, setter) => setter(e.target.value);

    // Validate input fields
    const validate = () => {
        let errors = {};
        if (!loginCred) errors.loginCred = "Username or email is required";
        if (!password) errors.password = "Password is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    // Handle Form Submission
    const submitForm = async (e) => {
        e.preventDefault();
        if (validate()) {
            // Prepare user details
            const userDetails = {
                "login_credential": loginCred,
                "password": password 
            };

            // Call the authenticateUser function
            const response = await authenticateUser(userDetails);

            // Check if login is successful
            if (response.success) {
                // Set the user state for authentication
                setUserState({ isAuthenticated: true, user: jwtDecode(response.token) });

                // Redirect to explore page if registration was successful
                router.push("/explore");
            } else {
                // Set the registration error message
                setLoginError(response.message);
            }
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
                                    className="formInput appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setLoginCred)}
                                />
                            </div>
                            {errors?.loginCred && <p className="errorMessage">{errors.loginCred}</p>}
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
                                    className="formInput appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setPassword)}
                                />
                            </div>
                            {errors?.password && <p className="errorMessage">{errors.password}</p>}
                        </div>

                        {/* Login error message */}
                        {loginError && (
                            <div className="mt-4">
                                <p className="text-red-600">{loginError}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="form-btn w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;