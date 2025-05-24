/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CategoryButtons from "../components/Search/CategoryButtons";

import SearchBar from "../components/Search/SearchBar";
import TrackList from "../components/TrackList";
import AlbumGrid from "../components/AlbumGrid";
import UserGrid from "../components/UserGrid";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Треки");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
  
      let filteredResults: any[] = [];
  
      switch (selectedCategory) {
        case "Треки":
          break;
  
        case "Альбомы":
          break;
  
        case "Пользователи":
          break;
  
        case "Плейлисты":
          break;
  
        default:
          filteredResults = [];
      }
  
      setResults(filteredResults);
    };
  
    fetchData();
  }, [query, selectedCategory]);

  const renderResults = () => {
    if (results.length === 0) return <p>Ничего не найдено</p>;

    switch (selectedCategory) {
      case "Треки":
        return <TrackList tracks={results} />;

      case "Пользователи":
        return <UserGrid users={results} />;

      case "Альбомы":
        return <AlbumGrid albums={results} />;

      // case "Плейлисты":
      //   return <PlaylistList playlists={results} />;

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SearchBar onSearch={handleSearch} />
      <CategoryButtons
        categories={["Треки", "Пользователи", "Альбомы", "Плейлисты"]}
        onSelectCategory={setSelectedCategory}
      />
      <div className="search-results">{renderResults()}</div>
    </div>
  );
};

export default SearchPage;
