import React, { useRef } from "react";
import styled from "styled-components";
import { Playlist } from "../types/playlist";
import PlaylistCard from "./PlaylistCard";

const RowContainer = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: 1rem 1rem;
  gap: 1rem;
  scroll-behavior: smooth;
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:focus{
    outline:none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.329);
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
`;

interface HorizontalPlaylistRowProps {
  playlists: Playlist[] | undefined;
}

const HorizontalPlaylistRow: React.FC<HorizontalPlaylistRowProps> = ({ playlists }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <ScrollButton className="left" onClick={scrollLeft}>&lt;</ScrollButton>
      <ScrollButton className="right" onClick={scrollRight}>&gt;</ScrollButton>

      <RowContainer ref={containerRef}>
        {playlists?.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </RowContainer>
    </div>
  );
};

export default HorizontalPlaylistRow;