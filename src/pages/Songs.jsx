import React, { useState, useContext } from "react";
import { YoutubeContext } from "../context/YoutubeContext";

const Songs = () => {
  const [inputText, setInputText] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { postSongsName, youtubeLinks, postSongID, checkFileStatus } =
    useContext(YoutubeContext);

  const handleFetchYoutubeLinks = async () => {
    if (inputText.trim().length === 0) {
      alert("Please enter a song name to fetch YouTube IDs.");
      return;
    }
    try {
      await postSongsName([inputText]);
      alert("Fetched YouTube IDs! Now click 'Download as ZIP'");
    } catch (error) {
      alert("Failed to fetch YouTube IDs. Please try again.");
    }
  };

  const handleDownloadZip = async () => {
    if (youtubeLinks.length === 0) {
      alert("No YouTube IDs available. Fetch them first!");
      return;
    }

    setDownloading(true);
    try {
      const status = await checkFileStatus();
      if (status.files && status.files.length > 0) {
        const availableIds = status.files
          .filter((file) => youtubeLinks.includes(file._id.toString()))
          .map((file) => file._id.toString());
        if (availableIds.length === 0) {
          alert(
            "Files are still processing. Please try again in a few seconds."
          );
          return;
        }
        await postSongID(availableIds);
        alert("ZIP file downloaded successfully!");
      } else {
        alert("Files are still processing. Please try again in a few seconds.");
      }
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      alert("Error downloading ZIP. Please try again.");
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
      <button onClick={handleFetchYoutubeLinks} disabled={downloading}>
        Fetch YouTube IDs
      </button>
      <button onClick={handleDownloadZip} disabled={downloading}>
        {downloading ? "Processing..." : "Download as ZIP"}
      </button>
    </div>
  );
};

export default Songs;
