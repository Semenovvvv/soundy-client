import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import TrackCard from '../components/TrackCard';
import { mockAlbums } from '../mocks/albumMock';

const PageContainer = styled.div`
  padding: 2rem;
  color: #fff;
`;

const AlbumHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background-color: #1a1a1a;
`;

const AlbumCover = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const AlbumAuthor = styled.p`
  font-size: 1rem;
  color: #aaa;
  margin: 0.5rem 0;
`;

const AlbumDate = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const TracksSection = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const album = mockAlbums[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (!album || id == null) {
    return <div>Альбом не найден</div>;
  }


  return (
    <PageContainer>
      <AlbumHeader>
        <AlbumCover src={album.avatarUrl!} alt={album.title} />
        <AlbumInfo>
          <AlbumTitle>{album.title}</AlbumTitle>
          <AlbumAuthor>
            {album.authors.map((author, idx) =>
              idx < album.authors.length - 1 ? `${author.name}, ` : author.name
            )}
          </AlbumAuthor>
          <AlbumDate>Добавлено {new Date(album.createdAt).toLocaleDateString()}</AlbumDate>
        </AlbumInfo>
      </AlbumHeader>

      <TracksSection>
        <SectionTitle>Треки</SectionTitle>
        <TracksList>
          {album.tracks?.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </TracksList>
      </TracksSection>
    </PageContainer>
  );
};

export default AlbumPage;