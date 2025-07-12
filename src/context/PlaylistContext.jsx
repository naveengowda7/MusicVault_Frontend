import React, { createContext, useState } from "react";
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

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch My Playlist");
      }

      let data = await response.json();
      data = extractPlaylist(data);
      setMyPlaylist(data);
    } catch (err) {
      console.error("Error fetching my playlist:", err);
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
        `https://musicvault-service1-playlist.onrender.com/api/playlist/${playlistId}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch Other Playlist");
      }

      let data = await response.json();
      setOtherPlaylist(data);
    } catch (err) {
      console.error("Error fetching other playlist:", err);
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
