import React, { createContext, useState } from "react";

export const YoutubeContext = createContext();

export const YoutubeProvider = ({ children }) => {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedIds, setProcessedIds] = useState([]); // Add this state

  const postSongsName = async (songNames) => {
    setLoading(true);
    try {
      console.log("Posting songs:", songNames);

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch YouTube IDs");
      }

      const data = await response.json();
      console.log("YouTube API response:", data);

      // Store video URLs temporarily
      setYoutubeLinks(data.videoUrl || []);

      // Process the links with download service
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
        const errorData = await processResponse.json();
        throw new Error(errorData.message || "Failed to process YouTube links");
      }

      const processData = await processResponse.json();
      console.log("Process API response:", processData);

      // Store the processed IDs
      setProcessedIds(processData.ids || []);

      return { success: true, ids: processData.ids || [] };
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
      console.log("Downloading with IDs:", ids);

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate ZIP file");
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check file status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking file status:", error);
      throw error;
    }
  };

  return (
    <YoutubeContext.Provider
      value={{
        youtubeLinks,
        processedIds, // Add this to the context
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
