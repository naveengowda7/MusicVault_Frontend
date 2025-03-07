import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Callback from "./components/Callback";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import "./App.css";
import Layout from "./components/Layout";
import Playlist from "./pages/Playlist";
import { PlaylistProvider } from "./context/PlaylistContext";
import MyPlaylist from "./pages/Myplaylist";
import Tracks from "./pages/Tracks";
import { YoutubeProvider } from "./context/YoutubeContext";
import Songs from "./pages/Songs";

const App = () => {
  return (
    <AuthProvider>
      <PlaylistProvider>
        <YoutubeProvider>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/playlist/my-playlist" element={<MyPlaylist />} />
              <Route
                path="/playlist/other-playlist/:playlistId"
                element={<Tracks />}
              />
              <Route path="/song" element={<Songs />} />
            </Route>
          </Routes>
        </YoutubeProvider>
      </PlaylistProvider>
    </AuthProvider>
  );
};

export default App;
