import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import { AuthContext } from "../context/AuthContext";
import MyList from "../components/MyList";

const MyPlaylist = () => {
  const { myPlaylist, fetchMyPlaylist, loading, error } =
    useContext(PlaylistContext);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authData.isAuthenticated) {
      fetchMyPlaylist();
    } else {
      // If not authenticated, redirect to login
      navigate("/login");
    }
  }, [authData.isAuthenticated, navigate]);

  // Handle authentication errors
  useEffect(() => {
    if (error && error.includes("Session expired")) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (!authData.isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view your playlists.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <div className="playlist-page-header">
        <h1 className="playlist-page-title">My Playlists</h1>
        <p className="playlist-page-subtitle">
          Your personal collection of music
        </p>
      </div>

      {loading && (
        <div className="loading-state">Loading your playlists...</div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          {error.includes("Session expired") && (
            <button onClick={() => navigate("/login")}>Login Again</button>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="my-playlist-container">
          {myPlaylist && myPlaylist.length > 0 ? (
            myPlaylist.map((playlist) => (
              <MyList
                key={playlist.id}
                id={playlist.id}
                name={playlist.name}
                des={playlist.description}
                img={playlist.image}
                owner={playlist.owner}
              />
            ))
          ) : (
            <div className="no-playlists-message">
              <p>No playlists found. Create your first playlist!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPlaylist;
