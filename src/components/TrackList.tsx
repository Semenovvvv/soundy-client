import React from "react";
import { Track } from "../types/track";
import TrackCard from "./TrackCard";
import styled from "styled-components";

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackList: React.FC<{ tracks: Track[] | undefined }> = ({ tracks }) => {
  if (tracks?.length === 0) return;
  return (
    <TracksContainer>
      {tracks?.map((track) => (
        <TrackCard track={track} key={track.id} />
      ))}
    </TracksContainer>
  );
};

export default TrackList;
