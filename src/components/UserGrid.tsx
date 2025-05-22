import React from "react";
import styled from "styled-components";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";

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
    navigate(`/user/${userId}`);
  };

  return (
    <GridContainer>
      {users.map((user) => (
        <UserCard key={user.id}>
          <Avatar
            src={user.avatarUrl}
            onClick={() => handleUserClick(user.id)} // ← передаем id пользователя
          />
          <UserName>{user.name}</UserName>
        </UserCard>
      ))}
    </GridContainer>
  );
};

export default UserGrid;