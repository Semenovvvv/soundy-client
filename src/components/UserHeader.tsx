import React from 'react';
import styled from 'styled-components';
import { User } from '../types/user';

const UserHeaderContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const UserAvatar = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(29, 185, 84, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 250px;
  }
`;

const UserName = styled.h1`
  margin-top: 0;
  font-size: 2.5rem;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const UserEmail = styled.p`
  color: #b3b3b3;
  font-size: 1.1rem;
  margin: 0.5rem 0;
`;

const UserJoined = styled.p`
  color: #aaa;
  margin: 0.5rem 0;
`;

const UserBio = styled.p`
  margin: 1.5rem 0;
  line-height: 1.6;
  color: #e0e0e0;
  font-size: 1.1rem;
`;

const EditProfileButton = styled.button`
  background: transparent;
  border: 1px solid #1db954;
  color: #1db954;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(29, 185, 84, 0.1);
    transform: translateY(-2px);
  }
`;

const CurrentUserBadge = styled.span`
  background: #1db954;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 1rem;
  vertical-align: middle;
`;

const UserRole = styled.span`
  color: #aaa;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

interface UserHeaderProps {
  user: User;
  onEditProfile?: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, onEditProfile }) => {
  const avatarUrl = user.avatarUrl || 'https://via.placeholder.com/150';
  const isCurrentUser = user.isCurrentUser;

  return (
    <UserHeaderContainer>
      <UserAvatar src={avatarUrl} alt={`Аватар ${user.name}`} />
      <UserInfo>
        <UserName>
          {user.name}
          {isCurrentUser && <CurrentUserBadge>Это вы</CurrentUserBadge>}
          {user.role && <UserRole>({user.role})</UserRole>}
        </UserName>
        <UserEmail>{user.email}</UserEmail>
        <UserJoined>Участник с {new Date(user.createdAt).toLocaleDateString()}</UserJoined>
        {user.bio && <UserBio>{user.bio}</UserBio>}
        {isCurrentUser && (
          <EditProfileButton onClick={onEditProfile}>
            Редактировать профиль
          </EditProfileButton>
        )}
      </UserInfo>
    </UserHeaderContainer>
  );
};

export default UserHeader;