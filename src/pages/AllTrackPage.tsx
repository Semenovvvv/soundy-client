// AllTracksPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Track } from '../types/track';
import '../styles/AllTrackPage.css';
import trackService from '../services/trackService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import TrackList from '../components/TrackList';

interface LocationState {
  tracks?: Track[];
}

const AllTracksPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all tracks from the user
  useEffect(() => {
    // If tracks were passed through navigation state, use them
    const state = location.state as LocationState | undefined;
    if (state?.tracks && state.tracks.length > 0) {
      setTracks(state.tracks);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchTracks = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const userTracks = await trackService.getTracksByAuthor(id);
        setTracks(userTracks);
      } catch (err) {
        console.error("Failed to fetch tracks:", err);
        setError("Не удалось загрузить треки");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [id, location.state]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="all-tracks-page">
      <div className="page-header">
        <h1>Все треки</h1>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">Сортировать по:</label>
          <select 
            id="sort-select"
            className="sort-select"
          >
            <option value="title">Названию</option>
            <option value="artist">Исполнителю</option>
            <option value="duration">Длительности</option>
          </select>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="empty-state">У пользователя нет треков</div>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
};

export default AllTracksPage;