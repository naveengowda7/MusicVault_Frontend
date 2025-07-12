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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songNames }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube IDs");
      }

      const data = await response.json();
      // Assuming YouTube service returns { videoUrl: [...] }, pass to download service
      const processResponse = await fetch(
        "https://musicvault-service-download.onrender.com/api/process",
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ links: data.videoUrl }),
        }
      );

      if (!processResponse.ok) {
        throw new Error("Failed to process YouTube links");
      }

      const processData = await processResponse.json();
      setYoutubeLinks(processData.ids || []); // Store MongoDB _ids
    } catch (error) {
      console.error("Error processing songs:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const postSongID = async (ids) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://musicvault-service-download.onrender.com/api/download",
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ZIP file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "songs.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return response;
    } catch (error) {
      console.error("Error downloading ZIP file:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkFileStatus = async () => {
    try {
      const response = await fetch(
        "https://musicvault-service-download.onrender.com/api/files?page=1&limit=10&status=completed",
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to check file status");
      return await response.json(); // Expect { files: [...], totalPages, currentPage, total }
    } catch (error) {
      console.error("Error checking file status:", error);
      throw error;
    }
  };

  return (
    <YoutubeContext.Provider
      value={{
        youtubeLinks,
        loading,
        postSongsName,
        postSongID,
        checkFileStatus,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};
