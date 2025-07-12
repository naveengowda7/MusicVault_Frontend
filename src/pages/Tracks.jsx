import React, { useContext, useEffect, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { YoutubeContext } from "../context/YoutubeContext";
import { useParams } from "react-router-dom";
import SongList from "../components/SongList";

const Tracks = () => {
  const {
    songsList,
    setSongsList,
    otherPlaylist,
    fetchOtherPlaylist,
    loading,
    error,
  } = useContext(PlaylistContext);
  const { postSongsName, postSongID, processedIds, checkFileStatus } =
    useContext(YoutubeContext);
  const { playlistId } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleOnClick = () => {
    if (selectAll) {
      setSongsList([]);
    } else {
      const allSongs = otherPlaylist.tracks.items.map((item) => item.name);
      setSongsList(allSongs);
    }
    setSelectAll((prevState) => !prevState);
  };

  const handleFetchYoutubeLinks = async () => {
    if (songsList.length > 0) {
      try {
        const result = await postSongsName(songsList);
        if (result.success) {
          alert("Fetched YouTube IDs! Now click 'Download as ZIP'");
        }
      } catch (error) {
        alert(`Failed to fetch YouTube IDs: ${error.message}`);
      }
    } else {
      alert("No songs selected to fetch YouTube IDs.");
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

  useEffect(() => {
    fetchOtherPlaylist(playlistId);
  }, [playlistId]);

  if (loading) return <p>Loading Other Playlist...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="track-list">
      <h1>Other Playlist: {playlistId}</h1>
      <div className="action-buttons">
        <button className="add-all" onClick={handleOnClick}>
          {selectAll ? "Deselect All" : "Add All Songs"}
        </button>
        <button
          className="fetch-ids"
          onClick={handleFetchYoutubeLinks}
          disabled={songsList.length === 0}
        >
          Fetch YouTube IDs
        </button>
        {processedIds.length > 0 && (
          <button
            className="download-zip"
            onClick={handleDownloadZip}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download as ZIP"}
          </button>
        )}
      </div>
      <div>
        <p>Selected songs: {songsList.length}</p>
        {processedIds.length > 0 && (
          <p>Ready to download {processedIds.length} songs!</p>
        )}
      </div>
      {otherPlaylist ? (
        otherPlaylist.tracks.items.map((item) => (
          <SongList
            key={item.id}
            name={item.name}
            image={item.images[2].url}
            setSongsList={setSongsList}
            songsList={songsList}
            selectAll={selectAll}
          />
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Tracks;
