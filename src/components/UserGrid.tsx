import React from "react";
import styled from "styled-components";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import config from "../config";
import authService from "../services/authService";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 5rem;
  padding: 2rem;
`;

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Avatar = styled.div<{ src: string | null }>`
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserName = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: #d3d3d3;
  margin-top: 0.5rem;
`;

interface UserGridProps {
  users: User[];
}

const UserGrid: React.FC<UserGridProps> = ({ users }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    const currentUserId = authService.getUserId();
    
    console.log(`User clicked: ${userId}, Current user: ${currentUserId}`);
    
    if (currentUserId === userId) {
      console.log('Navigating to own profile: /profile/me');
      navigate('/profile/me');
    } else {
      console.log(`Navigating to user profile: /user/${userId}`);
      navigate(`/user/${userId}`);
    }
  };

  const formatAvatarUrl = (url: string | null | undefined): string => {
    if (!url) return "https://placehold.co/400";
    if (url.startsWith('http')) return url;
    return `${config.MEDIA_URL}/image/${url}`;
  };

  return (
    <GridContainer>
      {users.map((user) => (
        <UserCard key={user.id}>
          <Avatar
            src={formatAvatarUrl(user.avatarUrl)}
            onClick={() => handleUserClick(user.id)}
          />
          <UserName>{user.name}</UserName>
        </UserCard>
      ))}
    </GridContainer>
  );
};

export default UserGrid;