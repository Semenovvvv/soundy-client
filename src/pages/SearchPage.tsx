/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CategoryButtons from "../components/Search/CategoryButtons";
import SearchBar from "../components/Search/SearchBar";
import TrackList from "../components/TrackList";
import AlbumGrid from "../components/AlbumGrid";
import UserGrid from "../components/UserGrid";
import searchService from "../services/searchService";
import { Track } from "../types/track";
import { Album } from "../types/album";
import { User } from "../types/user";
import { Playlist } from "../types/playlist";
import styled from "styled-components";
import EmptyState from "../components/Search/EmptyState";
import SearchResultCard from "../components/Search/SearchResultCard";

const Container = styled.div`
  padding: 2rem;
`;

const PlaylistResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #aaa;
`;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Треки");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
  
      try {
        switch (selectedCategory) {
          case "Треки": {
            const response = await searchService.searchTracks({ pattern: query });
            setResults(response.tracks || []);
            break;
          }
  
          case "Альбомы": {
            const response = await searchService.searchAlbums({ pattern: query });
            setResults(response.albums || []);
            break;
          }
  
          case "Пользователи": {
            const response = await searchService.searchUsers({ pattern: query });
            setResults(response.users || []);
            break;
          }
  
          case "Плейлисты": {
            const response = await searchService.searchPlaylists({ pattern: query });
            setResults(response.playlists || []);
            break;
          }
  
          default:
            setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Ошибка при поиске. Пожалуйста, попробуйте снова.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500); // Debounce search requests
  
    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory]);

  const renderResults = () => {
    if (isLoading) return <Loading>Загрузка результатов...</Loading>;
    
    if (error) return <EmptyState>{error}</EmptyState>;
    
    if (results.length === 0 && query.trim()) 
      return <EmptyState>Ничего не найдено</EmptyState>;
    
    if (results.length === 0) 
      return <EmptyState>Введите запрос для поиска</EmptyState>;

    switch (selectedCategory) {
      case "Треки":
        return <TrackList tracks={results as Track[]} />;

      case "Пользователи":
        return <UserGrid users={results as User[]} />;

      case "Альбомы":
        return <AlbumGrid albums={results as Album[]} />;

      case "Плейлисты":
        return (
          <PlaylistResults>
            {(results as Playlist[]).map((playlist) => (
              <SearchResultCard 
                key={playlist.id} 
                type="playlist" 
                data={playlist} 
              />
            ))}
          </PlaylistResults>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <SearchBar onSearch={handleSearch} />
      <CategoryButtons
        categories={["Треки", "Пользователи", "Альбомы", "Плейлисты"]}
        onSelectCategory={setSelectedCategory}
      />
      <div className="search-results">{renderResults()}</div>
    </Container>
  );
};

export default SearchPage;
