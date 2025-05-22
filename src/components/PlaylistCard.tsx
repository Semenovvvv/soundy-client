import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Playlist } from "../types/playlist";


const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 14rem;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlaylistCover = styled.img`
  width: 14rem;
  height: 14rem;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const PlaylistTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #eeeeee;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaylistArtist = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin: 0;
`;

type PlaylistCardProps = {
  playlist: Playlist;
};

const AlbumCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  const { title, avatarUrl, author } = playlist;

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <PlaylistContainer>
      <PlaylistCover src={avatarUrl || "https://placehold.co/400"} alt={title} onClick={handleClick} />
      <PlaylistTitle>{title}</PlaylistTitle>
      <PlaylistArtist>
        {author?.name}
      </PlaylistArtist>
    </PlaylistContainer>
  );
};

export default AlbumCard;
