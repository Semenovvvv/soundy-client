import React from 'react';
import styled from 'styled-components';
import AlbumCard from './AlbumCard';
import { Album } from '../types/album';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6rem;
  padding: 1rem;
`;

interface AlbumGridProps {
  albums: Album[];
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums }) => {
  return (
    <GridContainer>
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </GridContainer>
  );
};

export default AlbumGrid;