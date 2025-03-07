import React, { createContext, useState, useEffect } from "react";
import { extractPlaylist } from "../utils/extractPlaylist";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [myPlaylist, setMyPlaylist] = useState(null);
  const [otherPlaylist, setOtherPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [songsList, setSongsList] = useState([]);

  const fetchMyPlaylist = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://musicvault-service-spotify.onrender.com/api/playlist/my", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch My Playlist");
      let data = await response.json();
      data = extractPlaylist(data);
      setMyPlaylist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherPlaylist = async (playlistId) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://musicvault-service-spotify.onrender.com/api/playlist/${playlistId}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch Other Playlist");
      let data = await response.json();
      setOtherPlaylist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        myPlaylist,
        otherPlaylist,
        fetchMyPlaylist,
        fetchOtherPlaylist,
        loading,
        error,
        songsList,
        setSongsList,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
