import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TrackList from '../components/TrackList';
import { Playlist } from '../types/playlist';
import playlistService from '../services/playlistService';
import { LoadingSpinner } from '../components/LoadingSpinner';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const EmptyMessage = styled.p`
  color: #aaa;
  font-style: italic;
`;


const FavoriteTracksPage: React.FC = () => {
 const [favoritePlaylist, setPlaylist] = useState<Playlist>();
 const [isLoaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoritePlaylist: Playlist = await playlistService.getFavorite("461653ce-c293-4461-89b4-995018ff3ec7");
        setPlaylist(favoritePlaylist);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchData();
  }, []);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Title>Любимые треки</Title>

      {favoritePlaylist && favoritePlaylist.tracks.length > 0 ? (
        <TrackList tracks={favoritePlaylist.tracks} />
      ) : (
        <EmptyMessage>Нет любимых треков.</EmptyMessage>
      )}
    </PageContainer>
  );
};

export default FavoriteTracksPage;