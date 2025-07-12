import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Callback = () => {
  const { setAuthData, checkAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if authentication was successful
        const isAuthenticated = await checkAuthStatus();

        if (isAuthenticated) {
          setAuthData({ isAuthenticated: true });

          // Redirect after successful authentication
          const redirectTimer = setTimeout(() => {
            navigate("/");
          }, 2000);

          return () => clearTimeout(redirectTimer);
        } else {
          // Authentication failed, redirect to login
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Error in callback:", error);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [setAuthData, checkAuthStatus, navigate]);

  return (
    <div>
      <h1>SpotTube</h1>
      <div>
        <span>Authenticating...</span>
        <p>Processing authentication, please wait...</p>
      </div>
    </div>
  );
};

export default Callback;
