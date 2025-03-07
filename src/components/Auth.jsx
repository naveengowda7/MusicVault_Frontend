import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="login">
      <button onClick={login}>Spotify Login</button>
    </div>
  );
};

export default Auth;
