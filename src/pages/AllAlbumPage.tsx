import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AlbumGrid from "../components/AlbumGrid";
import { Album } from "../types/album";
import { useParams, useLocation } from "react-router-dom";
import albumService from "../services/albumService";
import { LoadingSpinner } from "../components/LoadingSpinner";

const PageContainer = styled.div`
  padding: 1rem 4rem 0 4rem;
`;

const Header = styled.h2`
  font-size: 40px;
  margin-left: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 1rem;
  color: #aaa;
  font-size: 1.2rem;
`;

interface LocationState {
  albums?: Album[];
}

const AllAlbumsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    // If albums were passed through navigation state, use them
    const state = location.state as LocationState | undefined;
    if (state?.albums && state.albums.length > 0) {
      setAlbums(state.albums);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchAlbums = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const userAlbums = await albumService.getAlbumsByAuthor(id);
        setAlbums(userAlbums);
      } catch (err) {
        console.error("Failed to fetch albums:", err);
        setError("Не удалось загрузить альбомы");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [id, location.state]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <PageContainer>
      <Header>Все альбомы</Header>
      {albums.length === 0 ? (
        <EmptyState>У пользователя нет альбомов</EmptyState>
      ) : (
        <AlbumGrid albums={albums} />
      )}
    </PageContainer>
  );
};

export default AllAlbumsPage;
