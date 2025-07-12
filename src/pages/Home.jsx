import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { authData, checkAuthStatus } = useContext(AuthContext);

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();
  }, []);

  return (
    <div className="main-content">
      <div className="hero-content">
        <div className="title-card">
          <span>
            <h2>Fetch & Download</h2>
          </span>
          <span className="spotify-span">Spotify</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="spotify-span">Playlist</span>
          <div className="title-card-div">
            {authData.isAuthenticated ? (
              <>
                <Link className="song" to="/song">
                  <h2>Songs</h2>
                </Link>
                <span> | </span>
                <Link to="/playlist">
                  <h2 className="palylist">Playlists</h2>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <h2>Login</h2>
              </Link>
            )}
          </div>
        </div>
        <p className="lighter-text">
          <span>Free </span>
          download your spotify songs, playlists in high quality
        </p>
      </div>
    </div>
  );
};

export default Home;
