import { useCallback } from 'react';
import { Track } from '../types/track';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

export function useTrackPlayer() {
  const { setCurrentTrack, setPlayerVisible } = useAudioPlayer();
  
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setPlayerVisible(true);
  }, [setCurrentTrack, setPlayerVisible]);
  
  const playTrackById = useCallback((trackId: string, tracks: Track[]) => {
    const trackToPlay = tracks.find(t => t.id === trackId);
    if (trackToPlay) {
      playTrack(trackToPlay);
    }
  }, [playTrack]);

  return {
    playTrack,
    playTrackById
  };
} 