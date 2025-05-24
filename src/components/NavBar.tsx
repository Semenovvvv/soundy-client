import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import authService from "../services/authService";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";

const NavbarContainer = styled.nav`
  background-color: #121212;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const NavbarWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: #1db954;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const Menu = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover,
  &:focus {
    color: #1db954;
  }

  &.active {
    color: #1db954;
    font-weight: bold;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  background-color: #1db954;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1ed760;
  }
`;

const LogoutButton = styled.button`
  color: white;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  background-color: #e74c3c;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentTrack } = useAudioPlayer();

  const handleLogout = async () => {
    try {
      // Stop any playing track
      setCurrentTrack(null);
      
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <Logo to="/">Soundy</Logo>

        <Menu>
          <MenuItem>
            <MenuLink to="/">Главная</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/search">Поиск</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/collection">Коллекция</MenuLink>
          </MenuItem>
        </Menu>

        <ProfileSection>
          <ProfileLink to="/profile/me">Мой профиль</ProfileLink>
          <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
        </ProfileSection>
      </NavbarWrapper> 
    </NavbarContainer>
  );
};

export default NavBar;
