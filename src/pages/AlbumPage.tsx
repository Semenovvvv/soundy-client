import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import { Album } from '../types/album';
import albumService from '../services/albumService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import TrackList from "../components/TrackList";
import config from "../config";
import PageLayout from '../components/PageLayout';
import { useAuth } from '../contexts/AuthContext';
import trackService from '../services/trackService';
import { Track } from '../types/track';

const AlbumHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background-color: #1a1a1a;
`;

const AlbumCover = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const AlbumAuthor = styled.p`
  font-size: 1rem;
  color: #aaa;
  margin: 0.5rem 0;
`;

const AlbumDate = styled.p`
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

interface AlbumPageProps {
  albumProp?: Album;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ albumProp }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [album, setAlbum] = useState<Album | null>(albumProp || null);
  const [loading, setLoading] = useState(!albumProp);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    // If album was provided as a prop, no need to fetch
    if (albumProp) {
      setAlbum(albumProp);
      setLoading(false);
      return;
    }

    // Check if album was passed through location state
    const locationAlbum = location.state?.album as Album | undefined;
    if (locationAlbum) {
      setAlbum(locationAlbum);
      setLoading(false);
      return;
    }

    // Otherwise fetch by ID
    const fetchAlbum = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Use the real API endpoint to fetch album data
        const albumData = await albumService.getAlbumById(id);
        setAlbum(albumData);
      } catch (err) {
        console.error("Failed to fetch album:", err);
        setError("Не удалось загрузить альбом");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, albumProp, location.state]);

  // Обработчик удаления трека
  const handleDeleteTrack = async (trackId: string) => {
    if (!album) return;

    try {
      // Вызываем API для удаления трека
      await trackService.deleteTrack(trackId);
      
      // Обновляем состояние альбома, удаляя трек из списка
      const updatedTracks = album.tracks?.filter(track => track.id !== trackId) || [];
      
      setAlbum({
        ...album,
        tracks: updatedTracks
      });
    } catch (error) {
      console.error("Failed to delete track:", error);
      alert("Не удалось удалить трек. Попробуйте еще раз.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !album) {
    return <div>Альбом не найден</div>;
  }

  // Format the album cover URL
  const coverUrl = album.avatarUrl ? `${config.MEDIA_URL}/image/${album.avatarUrl}` : "https://placehold.co/400";

  // Format the creation date
  const createdDate = typeof album.createdAt === 'string' 
    ? new Date(album.createdAt).toLocaleDateString()
    : new Date(album.createdAt.seconds * 1000).toLocaleDateString();

  // Get author display  
  const getAuthorDisplay = () => {    
    const authors = album?.authors;    
    if (authors && authors.length > 0) {      
      return authors.map((author, idx) =>        
        idx < authors.length - 1 ? `${author.name}, ` : author.name
      );    
    }    
    return "";  
  };

  // Проверяем, является ли текущий пользователь владельцем альбома
  const isOwner = user && album.ownerId === user.id;

  // Добавляем albumOwnerId к трекам, если его нет
  const tracksWithOwnerInfo = album.tracks?.map((track: Track) => ({
    ...track,
    albumOwnerId: album.ownerId
  }));

  return (
    <PageLayout>
      <AlbumHeader>
        <AlbumCover src={coverUrl} alt={album.title} />
        <AlbumInfo>
          <AlbumTitle>{album.title}</AlbumTitle>
          <AlbumAuthor>
            {getAuthorDisplay()}
          </AlbumAuthor>
          <AlbumDate>Добавлено {createdDate}</AlbumDate>
        </AlbumInfo>
      </AlbumHeader>

      <TracksSection>
        <SectionTitle>Треки</SectionTitle>
        <TrackList 
          tracks={tracksWithOwnerInfo} 
          onDeleteTrack={handleDeleteTrack}
          showDeleteButton={isOwner || user?.id === album.ownerId}
        />
      </TracksSection>
    </PageLayout>
  );
};

export default AlbumPage;