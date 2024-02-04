import React, { useState } from "react";
import { registerUser } from "@/lib/userAuth";
import { useRouter } from "next/router";

// ========== SIGNUP PAGE ==========
const SignUpPage = () => {
    // Define Router
    const router = useRouter();

    // State vars for managing validation and sending details to server
    const [ fullName, setFullName ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    // State var for registration error message
    const [ registrationError, setRegistrationError ] = useState(null);

    // State vars for validation errors
    const [ errors, setErrors ] = useState({});

    // Update state with user inputs
    const handleInputChange = (e, setter) => setter(e.target.value);
 
    // Validate input fields
    const validate = () => {
        let errors = {};
        if (!fullName) errors.fullName = "Full Name is required";
        if (!username) errors.username = "Username is required";
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Invalid email format";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)) errors.password = "Password must be 8+ characters, with a number, uppercase, and special character";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
 
    // Handle Form Submission
    const submitForm = async (e) => {
        e.preventDefault();
        if (validate()) {
            // Prepare user details
            const userDetails = {
                "fullname": fullName,
                "username": username,
                "email": email,
                "password": password 
            };

            // Call the registerUser function
            const response = await registerUser(userDetails);

            // Check if registration was successful
            if (response.success) {
                // Redirect to login page if registration was successful
                router.push("/login");
            } else {
                // Set the registration error message
                console.log(response)
                setRegistrationError(response.message);
            }
        }
    };
     
    return (
        <div className="min-h-screen loginSignupPage flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="formHeading mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <a href="/login" className="formSubheading font-medium">
                        sign in to your existing account
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={submitForm}>
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="full-name"
                                    name="full-name"
                                    type="text"
                                    autoComplete="name"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none formInput sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setFullName)}
                                />
                            </div>
                            {errors?.fullName && <p className="errorMessage">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="name"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none formInput sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setUsername)}
                                />
                            </div>
                            {errors?.username && <p className="errorMessage">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none formInput sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setEmail)}
                                />
                            </div>
                            {errors?.email && <p className="errorMessage">{errors.email}</p>}
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
                                    autoComplete="new-password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none formInput sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setPassword)}
                                />
                            </div>
                            {errors?.password && <p className="errorMessage">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none formInput sm:text-sm"
                                    onChange={(e) => handleInputChange(e, setConfirmPassword)}
                                />
                            </div>
                            {errors?.confirmPassword && <p className="errorMessage">{errors.confirmPassword}</p>}
                        </div>

                        {/* Registration error message */}
                        {registrationError && (
                            <div className="mt-4">
                                <p className="text-red-600">{registrationError}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="form-btn w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;