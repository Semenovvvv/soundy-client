import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { Link } from 'react-router-dom';
import latestService from '../services/latestService';
import { User } from '../types/user';
import { Album } from '../types/album';
// import { Playlist } from '../types/playlist';
import AlbumGrid from '../components/AlbumGrid';
import UserGrid from '../components/UserGrid';
// import config from '../config';
import { LoadingSpinner } from '../components/LoadingSpinner';
import PageLayout from '../components/PageLayout';

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
`;

// const PlaylistGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//   gap: 1.5rem;
// `;

// const PlaylistCard = styled(Link)`
//   display: flex;
//   flex-direction: column;
//   background-color: #1e1e1e;
//   border-radius: 8px;
//   overflow: hidden;
//   text-decoration: none;
//   transition: transform 0.2s ease;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const PlaylistImage = styled.img`
//   width: 100%;
//   aspect-ratio: 1 / 1;
//   object-fit: cover;
// `;

// const PlaylistInfo = styled.div`
//   padding: 1rem;
// `;

// const PlaylistTitle = styled.h3`
//   font-size: 1rem;
//   margin: 0;
//   color: #fff;
//   margin-bottom: 0.5rem;
// `;

// const PlaylistAuthor = styled.p`
//   font-size: 0.8rem;
//   color: #aaa;
//   margin: 0;
// `;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

// const formatAvatarUrl = (url: string | null | undefined): string => {
//   if (!url) return 'https://via.placeholder.com/200';
//   return url.startsWith('http') ? url : `${config.MEDIA_URL}/${url}`;
// };

const HomePage: React.FC = () => {
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [latestAlbums, setLatestAlbums] = useState<Album[]>([]);
  //const [latestPlaylists, setLatestPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [users, albums] = await Promise.all([
          latestService.getLatestUsers(10),
          latestService.getLatestAlbums(10),
          //latestService.getLatestPlaylists(10)
        ]);

        setLatestUsers(users);
        setLatestAlbums(albums);
        // setLatestPlaylists(playlists);
      } catch (err) {
        console.error('Error fetching latest data:', err);
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
  }, []);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <PageLayout>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Section>
          <SectionTitle>Последние альбомы</SectionTitle>
          <AlbumGrid albums={latestAlbums} />
        </Section>

        {/* <Section>
          <SectionTitle>Последние плейлисты</SectionTitle>
          <PlaylistGrid>
            {latestPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} to={`/playlist/${playlist.id}`}>
                <PlaylistImage src={formatAvatarUrl(playlist.avatarUrl)} alt={playlist.title} />
                <PlaylistInfo>
                  <PlaylistTitle>{playlist.title}</PlaylistTitle>
                  <PlaylistAuthor>{playlist.author?.name || 'Unknown User'}</PlaylistAuthor>
                </PlaylistInfo>
              </PlaylistCard>
            ))}
          </PlaylistGrid>
        </Section> */}

        <Section>
          <SectionTitle>Новые пользователи</SectionTitle>
          <UserGrid users={latestUsers} />
        </Section>
    </PageLayout>
  );
};

export default HomePage;