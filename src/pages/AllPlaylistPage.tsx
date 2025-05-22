import styled from "styled-components";
import { useEffect, useState } from "react";
import PlaylistGrid from "../components/PlaylistGrid";
import { Playlist } from "../types/playlist";
import playlistService from "../services/playlistService";
import { LoadingSpinner } from "../components/LoadingSpinner";

const PageContainer = styled.div`
  padding: 1rem 4rem 0 4rem;
`;

const Header = styled.h2`
  font-size: 40px;
  margin-left: 1rem;
`;

const AllPlaylistPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const [loading, setLoading] = useState<boolean>(true);
  window.scrollTo({ top: 0, behavior: "auto" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlists: Playlist[] = await playlistService.getPlaylistsByUserId("461653ce-c293-4461-89b4-995018ff3ec7");
        setPlaylists(playlists);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header>Все плейлисты</Header>
      <PlaylistGrid playlists={playlists!} />
    </PageContainer>
  );
};

export default AllPlaylistPage;
