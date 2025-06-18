import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/ProfilePage.css";
import { User } from "../types/user";
import TrackList from "../components/TrackList";
import UserHeader from "../components/UserHeader";
import { Album } from "../types/album";
import HorizontalAlbumRow from "../components/HorizontalAlbumRow";
import userService from "../services/userService";
import authService from "../services/authService";
import { LoadingSpinner } from "../components/LoadingSpinner";
import styled from 'styled-components';
import { Track } from "../types/track";
import trackService from "../services/trackService";
import albumService from "../services/albumService";
import ProfileEditModal from "../components/ProfileEditModal";
import PageLayout from "../components/PageLayout";

const ProfileContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0rem;
`;

const ViewAllButton = styled.h2`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
  position: relative;
  margin: 0;
  font-size: 1.7rem;
  color: #fff;

  &:hover {
    color: #1ed760;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;

  ${ViewAllButton}:hover & {
    transform: translateX(4px);
  }
`;

const TracksGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

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

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  margin: 1rem 0;
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const handleTracksClick = () => {
    if (user?.id) {
      navigate(`/user/${user.id}/tracks`, {
        state: { tracks }
      });
    }
  };

  const handleAlbumsClick = () => {
    if (user?.id) {
      navigate(`/user/${user.id}/albums`, {
        state: { albums }
      });
    }
  };

  const handleCreateAlbum = () => {
    navigate('/create-album');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Reset state when location changes
  useEffect(() => {
    console.log(`URL changed to: ${location.pathname}, with id param: ${id}`);
    setUser(null);
    setAlbums([]);
    setTracks([]);
    setLoading(true);
    setError(null);
  }, [location.pathname, id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) return; // Skip if not in loading state
      
      try {
        setError(null);
        console.log("Fetching user data...");
        
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          setError("Для просмотра профиля необходимо войти в систему");
          setLoading(false);
          return;
        }
        
        const isViewingOwnProfile = location.pathname === '/profile/me';
        let userData: User;
        
        // Step 1: First load the user data
        try {
          if (isViewingOwnProfile) {
            // Loading current user profile (/profile/me route)
            console.log("Loading current user profile");
            const response = await userService.getCurrentUser();
            // Check if response has a user property and extract the user data
            // @ts-expect-error - Handle API response which might have nested user
            userData = response.user ? response.user : response;
            userData.isCurrentUser = true;
          } else if (id) {
            // Loading a specific user profile by ID
            console.log(`Loading user profile with ID: ${id}`);
            const response = await userService.getUserById(id);
            // Check if response has a user property and extract the user data
            // @ts-expect-error - Handle API response which might have nested user
            userData = response.user ? response.user : response;
            
            // Check if this is actually the current user's profile
            const currentUserId = authService.getUserId();
            userData.isCurrentUser = currentUserId === userData.id;
          } else {
            // This should not happen with proper routing
            throw new Error("Invalid profile URL");
          }
          
          console.log("User data loaded successfully:", userData);
          
          // Set user immediately after loading
          setUser(userData);
          
          // Step 2: Then load the user's content using the userData we just loaded
          console.log(`Loading content for user ID: ${userData.id}`);
          const [userTracks, userAlbums] = await Promise.all([
            trackService.getTracksByAuthor(userData.id),
            albumService.getAlbumsByAuthor(userData.id)
          ]);
          
          console.log(`Loaded ${userTracks.length} tracks and ${userAlbums.length} albums`);
          setTracks(userTracks);
          setAlbums(userAlbums);
          
        } catch (userError) {
          console.error("Error loading user data:", userError);
          throw userError; // Rethrow to be caught by outer try/catch
        }
      } catch (error) {
        console.error("Error in profile page:", error);
        setUser(null);
        setError("Не удалось загрузить профиль пользователя");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, loading, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return <ErrorMessage>{error || "Пользователь не найден"}</ErrorMessage>;
  }

  const isCurrentUser = user.isCurrentUser;

  return (
    <PageLayout>
      <ProfileContainer>
        <UserHeader user={user} onEditProfile={isCurrentUser ? handleEditProfile : undefined} />

        <ProfileContent>
          <Section>
            <SectionHeader>
              <ViewAllButton onClick={handleTracksClick}>
                Треки <Arrow>→</Arrow>
              </ViewAllButton>
            </SectionHeader>

            <TracksGrid>
              {tracks.length > 0 ? (
                <TrackList tracks={tracks.slice(0,5)} />
              ) : (
                <EmptyState>
                  <EmptyStateText>
                    {isCurrentUser 
                      ? "У вас пока нет треков" 
                      : "У этого пользователя нет загруженных треков"}
                  </EmptyStateText>
                </EmptyState>
              )}
            </TracksGrid>
          </Section>

          <Section>
            <SectionHeader>
              <ViewAllButton onClick={handleAlbumsClick}>
                Альбомы <Arrow>→</Arrow>
              </ViewAllButton>
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
          </Section>
        </ProfileContent>

        {showEditModal && user && (
          <ProfileEditModal
            user={user}
            onClose={handleCloseModal}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </ProfileContainer>
    </PageLayout>
  );
};

export default ProfilePage;
