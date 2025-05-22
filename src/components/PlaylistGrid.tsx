import React from 'react';
import styled from 'styled-components';
import { Playlist } from '../types/playlist';
import PlaylistCard from './PlaylistCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6rem;
  padding: 1rem;
`;

interface PlaylistGridProps {
  playlists: Playlist[];
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  return (
    <GridContainer>
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </GridContainer>
  );
};

export default PlaylistGrid;