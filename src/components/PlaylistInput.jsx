import React, { useState, useEffect } from "react";

const PlaylistInput = ({inputLink,setInputLink}) => {
  const [isValidURL, setIsValidURL] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidSpotifyLink = (url) => {
    const spotifyPattern =
      /^https?:\/\/open\.spotify\.com\/(track|album|playlist|artist|show|episode)\/[a-zA-Z0-9]+(\?.*)?$/;
    return spotifyPattern.test(url);
  };

  useEffect(() => {
    if (!inputLink) {
      setErrorMessage("Required Link To Fetch");
      setIsValidURL(false);
    } else if (!isValidSpotifyLink(inputLink)) {
      setErrorMessage("Not a valid Spotify URL");
      setIsValidURL(false);
    } else {
      setErrorMessage("");
      setIsValidURL(true);
    }
  }, [inputLink]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Spotify link here"
        className="playlist-input"
        value={inputLink}
        onChange={(e) => setInputLink(e.target.value)}
      />
      {errorMessage && (
        <span className="playlist-input-error">{errorMessage}</span>
      )}
      <button disabled={!isValidURL}>Fetch</button>
    </div>
  );
};

export default PlaylistInput;
