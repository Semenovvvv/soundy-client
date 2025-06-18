import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

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

interface MenuProps {
  isOpen: boolean;
}

interface HamburgerProps {
  isOpen: boolean;
}

const Menu = styled.ul<MenuProps>`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: #121212;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    gap: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
  }
`;

const MenuItem = styled.li`
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const MenuLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: color 0.2s ease;
  
  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
    font-size: 1.2rem;
  }

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
  
  @media (max-width: 768px) {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    flex-direction: column;
    gap: 0.5rem;
    background: rgba(18, 18, 18, 0.9);
    padding: 0.8rem;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
`;

const ProfileLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  background-color: #1db954;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

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
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  &:hover {
    background-color: #c0392b;
  }
`;

const Hamburger = styled.button<HamburgerProps>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: flex;
  }

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: white;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    
    &:first-child {
      transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    &:nth-child(3) {
      transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setCurrentTrack } = useAudioPlayer();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      // Stop any playing track
      setCurrentTrack(null);
      
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <Logo to="/">Soundy</Logo>

        <Hamburger isOpen={isMenuOpen} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </Hamburger>

        <Menu isOpen={isMenuOpen}>
          <MenuItem>
            <MenuLink to="/">Главная</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/search">Поиск</MenuLink>
          </MenuItem>
          {/* <MenuItem>
            <MenuLink to="/collection">Коллекция</MenuLink>
          </MenuItem> */}
        </Menu>

        <ProfileSection>
          <ProfileLink to="/profile/me">
            {user?.username || 'Профиль'}
          </ProfileLink>
          <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
        </ProfileSection>
      </NavbarWrapper>
    </NavbarContainer>
  );
};

export default NavBar;
