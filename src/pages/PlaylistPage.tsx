import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import TrackCard from '../components/TrackCard';
import playlistService from '../services/playlistService';
import { Playlist } from '../types/playlist';
import { LoadingSpinner } from '../components/LoadingSpinner';

const PageContainer = styled.div`
  padding: 2rem;
  color: #fff;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background-color: #1a1a1a;
`;

const PlaylistCover = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaylistTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const PlaylistAuthor = styled.p`
  font-size: 1rem;
  color: #aaa;
  margin: 0.5rem 0;
`;

const PlaylistDate = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const TracksSection = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PlaylistPage: React.FC = () => {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [loading, setLoading] = useState<boolean>(true);


  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlist = await playlistService.getPlaylistById(id!);
        setPlaylist(playlist!);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PlaylistHeader>
        <PlaylistCover src={playlist!.avatarUrl!} alt={playlist!.title} />
        <PlaylistInfo>
          <PlaylistTitle>{playlist!.title}</PlaylistTitle>
          <PlaylistAuthor>
            {playlist?.authorId}
          </PlaylistAuthor>
          <PlaylistDate>Добавлено {playlist?.createdAt.toString()}</PlaylistDate>
        </PlaylistInfo>
      </PlaylistHeader>

      <TracksSection>
        <SectionTitle>Треки</SectionTitle>
        <TracksList>
          {playlist!.tracks?.map((track) => (
            <TrackCard key={track.id} track={track} onPlay={() => {}} />
          ))}
        </TracksList>
      </TracksSection>
    </PageContainer>
  );
};

export default PlaylistPage;