import React from "react";
import styled from "styled-components";
import { Album } from "../types/album";
import { useNavigate } from "react-router-dom";
import config from "../config";


const AlbumContainer = styled.div`
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

const AlbumCover = styled.img`
  width: 14rem;
  height: 14rem;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const AlbumTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #eeeeee;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlbumArtist = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin: 0;
`;

type AlbumCardProps = {
  album: Album;
};

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const navigate = useNavigate();

  const { title } = album;

  const coverUrl = album.avatarUrl ? `${config.MEDIA_URL}/image/${album.avatarUrl}` : "https://placehold.co/400";

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    navigate(`/album/${album.id}`, { state: { album } });
  };

  return (
    <AlbumContainer>
      <AlbumCover src={coverUrl} alt={title} onClick={handleClick} />
      <AlbumTitle>{title}</AlbumTitle>
      <AlbumArtist>
        {album.authors && album.authors.length > 0
          ? album.authors.map((author) => author.name).join(", ")
          : ""}
      </AlbumArtist>
    </AlbumContainer>
  );
};

export default AlbumCard;
