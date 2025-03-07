import React, { useState, useContext } from "react";
import { YoutubeContext } from "../context/YoutubeContext";

const Songs = () => {
  const [inputText, setInputText] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { postSongsName, youtubeLinks, postSongID } =
    useContext(YoutubeContext);

  const handleFetchYoutubeLinks = async () => {
    if (inputText.trim().length === 0) {
      alert("Please enter a song name to fetch YouTube IDs.");
      return;
    }
    await postSongsName([inputText]);
    alert("Fetched YouTube IDs! Now click 'Download as ZIP'");
  };

  const handleDownloadZip = async () => {
    if (youtubeLinks.length === 0) {
      alert("No YouTube IDs available. Fetch them first!");
      return;
    }

    setDownloading(true);
    alert("Downloading resources, please wait...");

    setTimeout(async () => {
      try {
        while (1) {
          const response = await postSongID(youtubeLinks);
          if (response?.ok) return;
        }
        alert("Downloading ZIP file...");
      } catch (error) {
        console.error("Error downloading ZIP:", error);
        alert(
          "Please wait a few more seconds, the backend is still processing your resources."
        );
      }
      setDownloading(false);
    }, 5000);
  };

  return (
    <div className="input-container">
      <div>
        <label>Song Name</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter the Song Name"
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
