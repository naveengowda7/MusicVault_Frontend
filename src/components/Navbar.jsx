import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <span>Music</span>
            <span>Vault</span>
          </NavLink>
        </h1>
      </div>
      <ul className="links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-bold" : "text-greay-600"
            }
          >
            Home
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/song"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-bold" : "text-gray-600"
            }
          >
            Songs
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/playlist"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Playlist
          </NavLink>
        </li>
        <li>
          <a
            href="https://developer.spotify.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify API
          </a>
        </li>
        <li>
          <a
            href="https://developers.google.com/youtube/v3/docs/search/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube API
          </a>
        </li>
      </ul>
      <span className="disNone">::::</span>
    </nav>
  );
};

export default Navbar;
