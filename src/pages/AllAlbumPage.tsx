import styled from "styled-components";
import AlbumGrid from "../components/AlbumGrid";
import { Album } from "../types/album";
import { useEffect } from "react";

const PageContainer = styled.div`
  padding: 1rem 4rem 0 4rem;
`;

const Header = styled.h2`
  font-size: 40px;
  margin-left: 1rem;
`;

const AllAlbumsPage = () => {
  const albums: Album[] = [
    {
      id: "album-1",
      title: "Nightfall",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
    {
      id: "album-2",
      title: "Chill Vibes",
      authors: [
        {
          id: "user-1",
          email: "dj.luna@example.com",
          name: "DJ Luna",
          createdAt: "2023-08-15T20:30:00Z",
          avatarUrl: "https://example.com/avatars/djluna.jpg ",
          bio: "Electronic music producer with a passion for deep house and ambient vibes.",
        },
      ],
      createdAt: "",
      avatarUrl: "https://placehold.co/400",
    },
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  return (
    <PageContainer>
      <Header>Все альбомы</Header>
      <AlbumGrid albums={albums} />
    </PageContainer>
  );
};

export default AllAlbumsPage;
