import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import AlbumPage from "./pages/AlbumPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllAlbumsPage from "./pages/AllAlbumPage";
import AllTracksPage from "./pages/AllTrackPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import FavoriteTracksPage from "./pages/FavoriteTracksPage";
import CollectionPage from "./pages/CollectionPage";
import AllPlaylistPage from "./pages/AllPlaylistPage";
import PlaylistPage from "./pages/PlaylistPage";
import CreateAlbumPage from "./pages/CreateAlbumPage";
import HomePage from "./pages/HomePage";
import AudioPlayer from "./components/AudioPlayer";
import { AudioPlayerProvider, useAudioPlayer } from "./contexts/AudioPlayerContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "./contexts/AuthContext";

// Inner App component that can use the context hooks
const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/register'];
  const shouldShowNavBar = !hideNavRoutes.includes(location.pathname);
  const shouldShowPlayer = !hideNavRoutes.includes(location.pathname);
  const { currentTrack } = useAudioPlayer();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {shouldShowNavBar && <NavBar />}
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:id" element={<ProfilePage />} />
            <Route path="/profile/me" element={<ProfilePage />} />
            <Route path="/user/:id/tracks" element={<AllTracksPage />} />
            <Route path="/user/:id/albums" element={<AllAlbumsPage />} />
            <Route path="/playlist/:id/" element={<PlaylistPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/create-album" element={<CreateAlbumPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/collection/favorite" element={<FavoriteTracksPage />} />
            <Route path="/collection/playlists" element={<AllPlaylistPage />} />
          </Route>
        </Routes>
      </main>
      {currentTrack && shouldShowPlayer && <AudioPlayer track={currentTrack} />}
    </>
  );
};

// Main App component that provides the context providers
function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <AppContent />
      </AudioPlayerProvider>
    </AuthProvider>
  );
}

export default App;