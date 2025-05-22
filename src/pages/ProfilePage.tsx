import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import { User } from "../types/user";
import TrackList from "../components/TrackList";
import UserHeader from "../components/UserHeader";
import { Album } from "../types/album";
import HorizontalAlbumRow from "../components/HorizontalAlbumRow";
import playlistService from "../services/playlistService";
import userService from "../services/userService";
import authService from "../services/authService";
import { Playlist } from "../types/playlist";
import { LoadingSpinner } from "../components/LoadingSpinner";
import styled from 'styled-components';

const CreateAlbumButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background: #1db954;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 1rem;

  &:hover {
    background: #1ed760;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin: 1rem 0;
`;

const EmptyStateText = styled.p`
  color: #aaa;
  margin-bottom: 1rem;
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userFavoritePlaylist, setPlaylist] = useState<Playlist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleTracksClick = () => {
    navigate(`/user/${user?.id}/tracks`);
  };

  const handleAlbumsClick = () => {
    navigate(`/user/${user?.id}/albums`);
  };

  const handleCreateAlbum = () => {
    navigate('/create-album');
  };

  const handleEditProfile = () => {
    // Пока просто заглушка - здесь можно открыть модальное окно или
    // перенаправить на страницу редактирования профиля
    console.log('Редактирование профиля');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Проверяем текущий путь, чтобы определить, нужно ли загружать данные текущего пользователя
        const isProfileMePath = window.location.pathname === '/profile/me';
        
        console.log("Fetching user data, userId:", userId);
        
        // Если userId не определен, пробуем получить текущего пользователя
        if (!userId && !isProfileMePath) {
          // Проверяем, авторизован ли пользователь
          if (!authService.isAuthenticated()) {
            setError("Для просмотра профиля необходимо войти в систему");
            setLoading(false);
            return;
          }
          // Перенаправляем на страницу текущего пользователя
          navigate('/profile/me', { replace: true });
          return;
        }

        // Если ID равен 'me' или мы на странице /profile/me, получаем информацию о текущем пользователе
        let userData: User;
        
        if (userId === 'me' || isProfileMePath) {
          console.log("Loading current user data");
          userData = await userService.getCurrentUser();
          userData.isCurrentUser = true;
        } else {
          // Получаем информацию о другом пользователе
          console.log(`Loading data for user ID: ${userId}`);
          // Мы знаем, что userId здесь определен, т.к. предыдущие проверки пройдены
          userData = await userService.getUserById(userId as string);
          
          // Проверяем, является ли этот пользователь текущим
          const currentUserId = authService.getUserId();
          if (currentUserId === userData.id) {
            userData.isCurrentUser = true;
          }
        }
        
        console.log("User data loaded:", userData);
        setUser(userData);
        
        // Здесь нужно добавить получение альбомов пользователя и его избранного плейлиста
        // Пока оставим моки до реализации соответствующих API
        try {
          // В реальном API эти запросы нужно заменить на соответствующие
          const userFavoritePlaylist = await playlistService.getFavorite(userData.id);
          setPlaylist(userFavoritePlaylist);
        } catch (playlistError) {
          console.error("Ошибка при загрузке плейлистов:", playlistError);
          setPlaylist(null);
        }
        
        // Здесь будет запрос на получение альбомов пользователя
        // Пока используем моки
        setAlbums([]);
        
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
        setUser(null);
        setError("Не удалось загрузить профиль пользователя");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return <div className="error">{error || "Пользователь не найден"}</div>;
  }

  const isCurrentUser = user.isCurrentUser;

  return (
    <div className="profile-container">
      <UserHeader user={user} onEditProfile={isCurrentUser ? handleEditProfile : undefined} />

      <div className="profile-content">
        <section className="tracks">
          <div className="section-header">
            <h2 className="view-all-btn" onClick={handleTracksClick}>
              Треки <span className="arrow">→</span>
            </h2>
          </div>

          <div className="tracks-grid">
            {userFavoritePlaylist && userFavoritePlaylist.tracks && userFavoritePlaylist.tracks.length > 0 ? (
              <TrackList tracks={userFavoritePlaylist.tracks.slice(0, 5)} />
            ) : (
              <EmptyState>
                <EmptyStateText>
                  {isCurrentUser 
                    ? "У вас пока нет избранных треков" 
                    : "У этого пользователя нет избранных треков"}
                </EmptyStateText>
              </EmptyState>
            )}
          </div>
        </section>

        <section className="playlists">
          <SectionHeader>
            <h2 className="view-all-btn" onClick={handleAlbumsClick}>
              Альбомы <span className="arrow">→</span>
            </h2>
            {isCurrentUser && (
              <CreateAlbumButton onClick={handleCreateAlbum}>
                Создать альбом
              </CreateAlbumButton>
            )}
          </SectionHeader>

          {albums && albums.length > 0 ? (
            <HorizontalAlbumRow albums={albums} />
          ) : (
            <EmptyState>
              <EmptyStateText>
                {isCurrentUser 
                  ? "У вас пока нет альбомов" 
                  : "У этого пользователя нет альбомов"}
              </EmptyStateText>
              {isCurrentUser && (
                <CreateAlbumButton onClick={handleCreateAlbum}>
                  Создать первый альбом
                </CreateAlbumButton>
              )}
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
