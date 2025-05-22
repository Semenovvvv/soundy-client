// AllTracksPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Track } from '../types/track';
import '../styles/AllTrackPage.css';

const AllTracksPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const [sortBy, setSortBy] = useState<'title' | 'artist' | 'duration'>('title');

  // Загрузка всех треков пользователя
  useEffect(() => {
    // Имитация API-запроса
    setTimeout(() => {
      const mockTracks: Track[] = [ { id: '1', title: 'Ночной драйв', userId: 'DJ Night', duration: 120, createdAt: null, avatarUrl: ""},
        { id: '2', title: 'Городской ветер', userId: 'Urban Sounds', duration: 120, createdAt: null, avatarUrl: ""  },
        { id: '3', title: 'Солнечное утро', userId: 'Morning Vibes', duration: 120, createdAt: null, avatarUrl: ""  },
        { id: '4', title: 'Электро-ночь', userId: 'Neon Lights', duration: 120, createdAt: null, avatarUrl: ""  },
        { id: '5', title: 'Морской бриз', userId: 'Ocean Waves', duration: 120, createdAt: null, avatarUrl: ""  },
        { id: '6', title: 'Звёздная дорога', userId: 'Cosmic Sounds', duration: 120, createdAt: null, avatarUrl: ""  },
        { id: '7', title: 'Горный воздух', userId: 'Mountain Echoes', duration: 120, createdAt: null, avatarUrl: ""  }
      ];
      
      setTracks(mockTracks);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <div className="loading">Загрузка треков...</div>;
  }

  return (
    <div className="all-tracks-page">
      <div className="page-header">
        <h1>Все треки</h1>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">Сортировать по:</label>
          <select 
            id="sort-select"
            //value={sortBy}
            //onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="title">Названию</option>
            <option value="artist">Исполнителю</option>
            <option value="duration">Длительности</option>
          </select>
        </div>
      </div>

      <div className="tracks-table">
        <div className="table-header">
          <span>Название</span>
          <span>Исполнитель</span>
          <span>Длительность</span>
        </div>
        
        <div className="table-body">
          {tracks.map((track) => (
            <div key={track.id} className="track-row">
              <span className="track-title">{track.title}</span>
              <span className="track-artist">{track.userId}</span>
              <span className="track-duration">{track.duration}</span>
              <button className="play-button" aria-label="Воспроизвести">
                ▶️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTracksPage;