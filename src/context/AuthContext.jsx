import React, { createContext, useState, useEffect } from "react";

const initialState = {
  isAuthenticated: false,
};

export const AuthContext = createContext({
  authData: initialState,
  setAuthData: () => {},
  login: () => {},
  checkAuthStatus: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(initialState);

  // Check authentication by trying to fetch user playlists
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(
        "https://musicvault-service1-playlist.onrender.com/api/playlist/my",
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // If we can fetch playlists, user is authenticated
        setAuthData({ isAuthenticated: true });
        return true;
      } else if (response.status === 401) {
        // User is not authenticated
        setAuthData({ isAuthenticated: false });
        return false;
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthData({ isAuthenticated: false });
      return false;
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = () => {
    console.log("Login function triggered");
    window.location.href =
      "https://musicvault-service1-playlist.onrender.com/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{ authData, setAuthData, login, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
