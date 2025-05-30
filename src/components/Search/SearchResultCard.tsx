// components/SearchResultCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Track } from '../../types/track';
import { Album } from '../../types/album';
import { Playlist } from '../../types/playlist';
import { User } from '../../types/user';
import config from "../../config";

const CardContainer = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #1e1e1e;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2a2a2a;
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  margin: 0;
`;

// Helper to format avatar URLs
const formatAvatarUrl = (url: string | null | undefined): string => {
  if (!url) return 'https://via.placeholder.com/60';
  
  return url.startsWith('http') 
    ? url 
    : `${config.MEDIA_URL}/${url}`;
};

const SearchResultCard: React.FC<{
  type: 'track' | 'user' | 'album' | 'playlist';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}> = ({ type, data }) => {
  let content;

  if (type === 'track') {
    const track = data as Track;
    content = (
      <>
        <Avatar src={formatAvatarUrl(track.avatarUrl)} alt="Track" />
        <Info>
          <Title>{track.title}</Title>
          <Subtitle>
            {track.user?.name || ''}
          </Subtitle>
        </Info>
      </>
    );
  } else if (type === 'user') {
    const user = data as User;
    content = (
      <>
        <Avatar src={formatAvatarUrl(user.avatarUrl)} alt="User" />
        <Info>
          <Title>{user.name}</Title>
          <Subtitle>{user.email}</Subtitle>
        </Info>
      </>
    );
  } else if (type === 'album') {
    const album = data as Album;
    content = (
      <>
        <Avatar src={formatAvatarUrl(album.avatarUrl)} alt="Album" />
        <Info>
          <Title>{album.title}</Title>
          <Subtitle>
            {album.authors && album.authors.length > 0 
              ? album.authors.map((author) => author.name).join(', ') 
              : ''}
          </Subtitle>
        </Info>
      </>
    );
  } else if (type === 'playlist') {
    const playlist = data as Playlist;
    content = (
      <>
        <Avatar src={formatAvatarUrl(playlist.avatarUrl)} alt="Playlist" />
        <Info>
          <Title>{playlist.title}</Title>
          <Subtitle>{playlist.author?.name || ''}</Subtitle>
        </Info>
      </>
    );
  }

  return (
    <CardContainer to={`/${type}/${data.id}`}>
      {content}
    </CardContainer>
  );
};

export default SearchResultCard;