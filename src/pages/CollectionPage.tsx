import { useEffect, useState } from "react";
import React from 'react';
import {  useNavigate, useParams } from "react-router-dom";
import styled from 'styled-components';
import playlistService from "../services/playlistService";
import { Playlist } from "../types/playlist";
import TrackList from "../components/TrackList";
import { LoadingSpinner } from "../components/LoadingSpinner";
import HorizontalPlaylistRow from "../components/HorizontalPlaylistRow";


const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [favoritePlaylist, setPlaylist] = useState<Playlist>();
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoritePlaylist: Playlist =await playlistService.getFavorite("461653ce-c293-4461-89b4-995018ff3ec7");
        const playlists: Playlist[] = await playlistService.getPlaylistsByUserId("461653ce-c293-4461-89b4-995018ff3ec7");
        setPlaylist(favoritePlaylist);
        setPlaylists(playlists);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  const handleViewAllTracksClick = () => {
    navigate("/collection/favorite");
  };

  const handleViewAllPlaylistsClick = () => {
    navigate("/collection/playlists");
  };

  return (
    <div>
      <Container>
        <section className="tracks">
          <div className="section-header">
            <h2 className="view-all-btn" onClick={handleViewAllTracksClick}>
              Все треки <span className="arrow">→</span>
            </h2>
          </div>
          <TrackList
            tracks={favoritePlaylist?.tracks.slice(0, 5)}
          ></TrackList>
        </section>
      </Container>
      <Container>
        <section className="tracks">
          <div className="section-header">
            <h2 className="view-all-btn" onClick={handleViewAllPlaylistsClick}>
              Все плейлисты <span className="arrow">→</span>
            </h2>
          </div>
          <HorizontalPlaylistRow playlists={playlists?.slice(0, 5)}></HorizontalPlaylistRow>
        </section>
      </Container>
    </div>
  );
};

export default CollectionPage;
