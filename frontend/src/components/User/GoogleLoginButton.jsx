import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const navigate = useNavigate(); // React Router's navigation hook

    // Google login handler
    const handleGoogleLogin = async (idToken) => {
        try {
            // Send the ID token to the backend for verification
            const response = await axios.post(
                "http://localhost:8080/api/v1/auth/google-success",
                { idToken }, // Send the ID token in the request body
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Store the JWT token and user data (issued by your backend) in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect to the profile page or dashboard
            navigate("/");
        } catch (error) {
            console.error("Google login failed:", error.response?.data || error.message);
            alert("Google login failed. Please try again.");
        }
    };

    const handleSuccess = (credentialResponse) => {
        // Extract the ID token from the Google login response
        const idToken = credentialResponse.credential;

        // Call the Google login handler
        handleGoogleLogin(idToken);
    };

    const handleError = () => {
        console.error("Google login failed");
        alert("Google login failed. Please try again.");
    };

    return (
        <GoogleOAuthProvider clientId="184415282669-ts6p0120f740395ulkpt5shvbudpmvbq.apps.googleusercontent.com">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;