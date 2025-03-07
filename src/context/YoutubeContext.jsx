import React, { createContext, useState } from "react";

export const YoutubeContext = createContext();

export const YoutubeProvider = ({ children }) => {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const postSongsName = async (songNames) => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://musicvault-service1-youtube.onrender.com/api/youtube/video",
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ songNames }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch My Playlist");
      }

      const data = await response.json();
      console.log(data);
      setYoutubeLinks(data.videoUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const postSongID = async (youtubeLinks) => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://musicvault-service-download.onrender.com/api/download",
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: youtubeLinks }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ZIP file");
      }

      // Convert response to blob for direct download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a hidden <a> tag to download
      const a = document.createElement("a");
      a.href = url;
      a.download = "songs.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ZIP file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YoutubeContext.Provider
      value={{
        youtubeLinks,
        loading,
        postSongsName,
        postSongID,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};
