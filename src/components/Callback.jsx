import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Callback = () => {
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthData({ isAuthenticated: true });

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [setAuthData, navigate]);

  return (
    <div>
      <h1>SpotTube</h1>
      <div>
        <span>Authenticating...</span>
        <p>Successfully authenticated. Redirecting to homepage...</p>
      </div>
    </div>
  );
};

export default Callback;
