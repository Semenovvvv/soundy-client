// components/SearchBar.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 0 0 1px #cacaca;
  background-color: #262626;
  color: white;
  font-size: 1rem;
  width: 75%;
  transition: box-shadow 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #1db954;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #1db954;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1ed760;
  }
  &:focus {
    outline: none;
  }

`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="Искать..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch}>Искать</Button>
    </Container>
  );
};

export default SearchBar;
