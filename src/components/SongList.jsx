import React from "react";

const SongList = ({ image, name, setSongsList, songsList, selectAll }) => {
  const handleOnChange = () => {
    setSongsList((prevState) => {
      const exists = prevState.includes(name);
      if (exists) {
        return prevState.filter((song) => song !== name);
      }
      return [...prevState, name];
    });
  };

  const displayName = name.length > 50 ? name.substring(0, 50) + "..." : name;
  const isAdded = songsList.includes(name);

  return (
    <article className={isAdded | selectAll ? "track-added  track" : "track"}>
      <img src={image} alt={name} width="50" height="50" />
      <p>{displayName}</p>
      <button onClick={handleOnChange} className={isAdded ? "added" : ""}>
        {isAdded ? "song added" : "Add Song"}
      </button>
    </article>
  );
};

export default SongList;