import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const MyList = ({ id, name, img, owner, des }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    console.log("Playlist ID clicked:", id);
    navigate(`/playlist/other-playlist/${id}`);
  };

  return (
    <section className="playlist-card" onClick={handleOnClick}>
      <div className="playlist-img-container">
        <img src={img} alt={name} className="playlist-img" />
        <div className="play-icon-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="card-bottom">
        <div className="card-hero">
          <h3 className="playlist-name">{name}</h3>
          <span className="playlist-owner">By {owner}</span>
          <span className="playlist-id">ID: {id.slice(0, 8)}...</span>
        </div>
        <p className="playlist-description">
          {des || "No description available"}
        </p>
      </div>
    </section>
  );
};

export default MyList;
