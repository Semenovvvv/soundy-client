import React from "react";
import { Track } from "../types/track";
import TrackCard from "./TrackCard";
import styled from "styled-components";
import { useTrackPlayer } from "../hooks/useTrackPlayer";

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackList: React.FC<{ tracks: Track[] | undefined }> = ({ tracks }) => {
  const { playTrackById } = useTrackPlayer();

  const handlePlayTrack = (trackId: string) => {
    if (tracks) {
      playTrackById(trackId, tracks);
    }
  };

  if (!tracks || tracks.length === 0) return null;

  return (
    <TracksContainer>
      {tracks.map((track) => (
        <TrackCard track={track} key={track.id} onPlay={handlePlayTrack} />
      ))}
    </TracksContainer>
  );
};

export default TrackList;
