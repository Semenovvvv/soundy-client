import React, { useState } from "react";
import styled from "styled-components";
import { Track } from "../types/track";
import config from "../config";

const TrackContainer = styled.div`
  display: flex;
  //align-items: center;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: transparent;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #5e5e5e; /* Белый или любой другой светлый цвет */
    cursor: pointer; /* Необязательно — изменение курсора */
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0 0 0 0;
  color: #eeeeee;
`;

const Author = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #929292;
  margin: 0 0 0 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  background: none;
  border: none;
  font-size: 18px;
  /* color: ${(props) => (props.isLiked ? "#ff4d4d" : "#999")}; */
  outline: none;
  transition: color 0.3s ease;
  &:focus{
    outline: none;
  }
`;

const Duration = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
  color: #929292;
`;

const TrackCard: React.FC<{ track: Track; onPlay: (trackId: string) => void }> = ({ track, onPlay }) => {
  const [isLiked, setIsLiked] = useState(track.isLiked);
  const { id, title, user, duration, } = track;

  const avatarUrl = track.avatarUrl ? `${config.MEDIA_URL}/image/${track.avatarUrl}` : "https://placehold.co/400";

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const handlePlay = () => {
    onPlay(id);
  };

  return (
    <TrackContainer onClick={handlePlay}>
      <Avatar
        src={avatarUrl || "https://placehold.co/400"}
        alt="Track"
      />
      <InfoContainer>
        <Title>{title}</Title>
        <Author>
          {user?.name}
        </Author>
      </InfoContainer>
      <Controls>
        <LikeButton isLiked={isLiked} onClick={handleLike}>
          {isLiked ? "❤️" : "🖤"}
        </LikeButton>
        <Duration>{formatDuration(duration)}</Duration>
      </Controls>
    </TrackContainer>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default TrackCard;
