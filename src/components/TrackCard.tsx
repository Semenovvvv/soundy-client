// import React, { useState } from "react";
import styled from "styled-components";
import { Track } from "../types/track";
import config from "../config";
// import { useAuth } from "../contexts/AuthContext";
// import trackService from "../services/trackService";
// import Toast from "./Toast";

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

// const LikeButton = styled.button<{ isLiked: boolean }>`
//   background: none;
//   border: none;
//   font-size: 18px;
//   color: ${(props) => (props.isLiked ? "#ff4d4d" : "#999")};
//   outline: none;
//   transition: color 0.3s ease;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 4px;
//   &:hover {
//     color: ${(props) => (props.isLiked ? "#ff3333" : "#ff4d4d")};
//   }
//   &:focus{
//     outline: none;
//   }
// `;

// const ActionButton = styled.button`
//   background: none;
//   border: none;
//   font-size: 18px;
//   color: #929292;
//   outline: none;
//   transition: color 0.3s ease;
//   &:hover {
//     color: #ff4d4d;
//   }
//   &:focus{
//     outline: none;
//   }
// `;

const Duration = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
  color: #929292;
`;

interface TrackCardProps {
  track: Track;
  onPlay: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
  showDeleteButton?: boolean;
}

// const HeartIcon = ({ isLiked }: { isLiked: boolean }) => (
//   <svg 
//     width="20" 
//     height="20" 
//     viewBox="0 0 24 24" 
//     fill={isLiked ? "currentColor" : "none"} 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//   </svg>
// );

const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  onPlay, 
  // onDelete,
  // showDeleteButton = false 
}) => {
  //const [isLiked, setIsLiked] = useState(track.isLiked);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");
  const { id, title, user, duration, } = track;
  // const { user: currentUser } = useAuth();

  const avatarUrl = track.avatarUrl ? `${config.MEDIA_URL}/image/${track.avatarUrl}` : "https://placehold.co/400";

  // const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   //e.stopPropagation();
    
  //   if (!currentUser) {
  //     setToastMessage("Войдите в аккаунт, чтобы лайкать треки");
  //     setShowToast(true);
  //     return;
  //   }
    
  //   try {
  //     const updatedTrack = await trackService.likeTrack(id);
  //     // setIsLiked(updatedTrack.isLiked);
      
  //     if (updatedTrack.isLiked) {
  //       setToastMessage("Трек добавлен в избранное");
  //     } else {
  //       setToastMessage("Трек удален из избранного");
  //     }
      
  //     setShowToast(true);
  //   } catch (error) {
  //     console.error("Error liking track:", error);
  //     setToastMessage("Не удалось лайкнуть трек");
  //     setShowToast(true);
  //   }
  // };

  const handlePlay = () => {
    onPlay(id);
  };

  // const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   if (onDelete) {
  //     onDelete(id);
  //   }
  // };

  // Проверяем, имеет ли пользователь право удалять трек
  // (если это автор трека или если пользователь владелец альбома)
  // const canDelete = showDeleteButton && currentUser && 
  //   (currentUser.id === track.userId || currentUser.id === track.albumOwnerId);

  return (
    <>
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
          {/* <LikeButton isLiked={isLiked} onClick={handleLike}>
            <HeartIcon isLiked={isLiked} />
          </LikeButton> */}
          <Duration>{formatDuration(duration)}</Duration>
          {/* {canDelete && (
            <ActionButton onClick={handleDelete} title="Удалить трек">
              🗑️
            </ActionButton>
          )} */}
        </Controls>
      </TrackContainer>
      
      {/* <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      /> */}
    </>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default TrackCard;
