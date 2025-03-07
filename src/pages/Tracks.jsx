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

  const { postSongsName, postSongID, youtubeLinks } =
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
      await postSongsName(songsList);
      alert("Fetched YouTube IDs! Now click 'Download as ZIP'");
    } else {
      alert("No songs selected to fetch YouTube IDs.");
    }
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
          if (response?.status(200)) return;
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
        {youtubeLinks.length > 0 && (
          <button
            className="download-zip"
            onClick={handleDownloadZip}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download as ZIP"}
          </button>
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
