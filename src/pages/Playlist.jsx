import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractPlaylistId } from "../utils/extractPlaylistId";

const Playlist = () => {
  const navigate = useNavigate();
  const [inputLink, setInputLink] = useState("");

  const handleOnClick = (e) => {
    e.preventDefault();
    const selectedPlaylist = e.target.id;

    if (selectedPlaylist === "my") {
      navigate("/playlist/my-playlist");
    } else {
      const playlistId = extractPlaylistId(inputLink);
      if (playlistId) {
        navigate(`/playlist/other-playlist/${playlistId}`);
      } else {
        alert("Invalid Spotify playlist URL");
      }
    }
  };

  return (
    <div className="main-playlist">
      <h1>SpoTube Playlist</h1>
      <h2>Downloader</h2>
      <input
        type="text"
        placeholder="Enter Spotify Playlist URL"
        value={inputLink}
        onChange={(e) => setInputLink(e.target.value)}
      />
      <div>
        <button onClick={handleOnClick} id="my">
          MY Playlist
        </button>
        <button onClick={handleOnClick} id="other">
          Other Playlist
        </button>
      </div>
    </div>
  );
};

export default Playlist;
