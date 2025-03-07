import React, { createContext, useState, useContext } from "react";

const initialState = {
  isAuthenticated: false,
};

export const AuthContext = createContext({
  authData: initialState,
  setAuthData: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(initialState);

  const login = () => {
    console.log("Login function triggered");
    window.location.href =
      "https://musicvault-service1-playlist.onrender.com/auth/login";
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, login }}>
      {children}
    </AuthContext.Provider>
  );
};
