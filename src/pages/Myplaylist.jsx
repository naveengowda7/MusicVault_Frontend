import React, { useContext, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import MyList from "../components/MyList";

const MyPlaylist = () => {
  const { myPlaylist, fetchMyPlaylist, loading, error } =
    useContext(PlaylistContext);

  useEffect(() => {
    fetchMyPlaylist();
  }, []);

  // const handleOnClick = (e, playlistId) => {
  //   e.preventDefault();
  //   useEffect(() => {
  //     fetchOtherPlaylist(playlistId);
  //   }, [playlistId]);
  // };

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
      {error && <div className="error-state">{error}</div>}

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
