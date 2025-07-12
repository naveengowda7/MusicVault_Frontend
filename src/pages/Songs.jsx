import React, { useState, useContext } from "react";
import { YoutubeContext } from "../context/YoutubeContext";

const Songs = () => {
  const [inputText, setInputText] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { postSongsName, processedIds, postSongID, checkFileStatus, loading } =
    useContext(YoutubeContext);

  const handleFetchYoutubeLinks = async () => {
    if (inputText.trim().length === 0) {
      alert("Please enter a song name to fetch YouTube IDs.");
      return;
    }

    try {
      const result = await postSongsName([inputText]);
      if (result.success) {
        alert("Fetched YouTube IDs! Now click 'Download as ZIP'");
      }
    } catch (error) {
      alert(`Failed to fetch YouTube IDs: ${error.message}`);
    }
  };

  const handleDownloadZip = async () => {
    if (processedIds.length === 0) {
      alert("No processed IDs available. Fetch them first!");
      return;
    }

    setDownloading(true);
    try {
      // Wait a bit for files to be processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const status = await checkFileStatus();
      console.log("File status:", status);

      if (status.files && status.files.length > 0) {
        const availableIds = status.files
          .filter((file) => processedIds.includes(file._id.toString()))
          .map((file) => file._id.toString());

        if (availableIds.length === 0) {
          // Try using the processedIds directly
          await postSongID(processedIds);
          alert("ZIP file download started!");
        } else {
          await postSongID(availableIds);
          alert("ZIP file downloaded successfully!");
        }
      } else {
        // Try using the processedIds directly as fallback
        await postSongID(processedIds);
        alert("ZIP file download started!");
      }
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      alert(`Error downloading ZIP: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="input-container">
      <div>
        <label>Song Name</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter Song Name"
          className="input-text-box"
        />
      </div>
      <button onClick={handleFetchYoutubeLinks} disabled={loading}>
        {loading ? "Fetching..." : "Fetch YouTube IDs"}
      </button>
      <button
        onClick={handleDownloadZip}
        disabled={downloading || processedIds.length === 0}
      >
        {downloading ? "Processing..." : "Download as ZIP"}
      </button>
      {processedIds.length > 0 && (
        <p>Ready to download {processedIds.length} songs!</p>
      )}
    </div>
  );
};

export default Songs;
