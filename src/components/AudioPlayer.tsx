import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';
import { Track } from '../types/track';

// ====== Styled Components ======

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  display: flex;
  justify-content: space-between;
  //grid-template-columns: minmax(180px, 1fr) 2fr minmax(150px, 1fr);
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0.8rem;
    gap: 0.8rem;
  }
`;

const TrackSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 180px;
  max-width: 300px;
  
  @media (max-width: 768px) {
    justify-content: center;
    max-width: 100%;
  }
`;

const CoverArt = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #333;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TrackInfo = styled.div`
  min-width: 0;
  overflow: hidden;
`;

const TrackTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 768px) {
    order: -1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeDisplay = styled.span`
  font-size: 0.8rem;
  color: #b3b3b3;
  min-width: 45px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    height: 6px;
  }
`;

const Progress = styled.div<{ $width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$width}%;
  background: #1db954;
  border-radius: inherit;
  transition: width 0.1s linear;
`;

const Buffer = styled.div<{ $width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$width}%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: inherit;
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-width: 150px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const VolumeSlider = styled.input`
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  margin: 0;
  vertical-align: middle;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #1db954;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
  }
  
  &:hover {
    &::-webkit-slider-thumb {
      transform: scale(1.2);
    }
  }
`;

const IconButton = styled.button<{ $primary?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$primary ? '#1db954' : '#fff'};
  width: ${props => props.$primary ? '40px' : '32px'};
  height: ${props => props.$primary ? '40px' : '32px'};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: ${props => props.$primary ? '24px' : '20px'};
    height: ${props => props.$primary ? '24px' : '20px'};
    display: block;
  }
`;

// ====== Icons ======

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const PreviousIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

// ====== Types ======

interface AudioPlayerProps {
  track: Track | null;
}

// ====== Main Component ======

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);
  
  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);
  
  // Toggle play/pause
  const togglePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Play error:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [isPlaying]);
  
  // Skip forward/backward
  const handleSkip = useCallback((direction: 'forward' | 'backward', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    const skipAmount = 10;
    const newTime = direction === 'forward'
      ? Math.min(currentTime + skipAmount, duration)
      : Math.max(currentTime - skipAmount, 0);
    
    audioRef.current.currentTime = newTime;
  }, [currentTime, duration]);
  
  // Effect specifically for volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Persistent audio element ref to prevent recreating it on component remount
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    return () => {
      // Don't destroy audio element on unmount to keep playback between page transitions
      // Just detach from ref but let it continue playing
      // audioRef.current = null;
    };
  }, []);
  
  // Setup HLS when track changes
  useEffect(() => {
    // Reset player state when track changes
    setCurrentTime(0);
    setDuration(0);
    setBufferedProgress(0);
    
    if (!track) return;
    
    const audio = audioRef.current;
    if (!audio) return;
    
    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    const streamUrl = `http://localhost:8085/api/file/track/${track.id}/index.m3u8`;
    
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hlsRef.current = hls;
      
      hls.attachMedia(audio);
      hls.loadSource(streamUrl);

      // Configure HLS events
      hls.on(Hls.Events.BUFFER_CREATED, () => {
        // Set initial volume
        audio.volume = volume;
        
        // Auto-play when loaded
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error("Play error:", err);
            });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal HLS error, destroying...");
              hls.destroy();
              break;
          }
        }
      });
      
      
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = streamUrl;
      audio.volume = volume;
      
      audio.addEventListener('loadedmetadata', () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(console.error);
        }
      });
    }
    
    return () => {
      // Don't destroy HLS or pause on component unmount to keep playback between page transitions
      // Just clean up when changing tracks
      // if (hlsRef.current) {
      //   hlsRef.current.destroy();
      // }
      // audio.pause();
      // audio.src = '';
    };
  }, [track]); // Removed volume from dependencies
  
  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    const onProgress = () => {
      if (audio.buffered.length > 0 && audio.duration > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        setBufferedProgress((bufferedEnd / audio.duration) * 100);
      }
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('progress', onProgress);
    
    // Force sync with current isPlaying state
    if (isPlaying && audio.paused) {
      audio.play().catch(err => {
        console.error("Failed to resume playback:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
    
    return () => {
      // Remove event listeners on cleanup but don't stop playback
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('progress', onProgress);
    };
  }, [isPlaying]);

  if (!track) return null;

  const coverUrl = track.avatarUrl ? `http://localhost:8085/api/file/image/${track.avatarUrl}` : "https://placehold.co/400";
  
  return (
    <PlayerContainer>
      <TrackSection>
        <CoverArt>
          <img src={coverUrl} alt={track.title} />
        </CoverArt>
        <TrackInfo>
          <TrackTitle>{track.title || 'Loading...'}</TrackTitle>
          <ArtistName>{track.user?.name}</ArtistName>
        </TrackInfo>
      </TrackSection>
      
      <ControlsSection>
        <ButtonGroup>
          <IconButton onClick={(e) => handleSkip('backward', e)}>
            <PreviousIcon />
          </IconButton>
          <IconButton $primary onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <IconButton onClick={(e) => handleSkip('forward', e)}>
            <NextIcon />
          </IconButton>
        </ButtonGroup>
        
        <ProgressSection>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <ProgressBar ref={progressRef} onClick={handleProgressClick}>
            <Buffer $width={bufferedProgress} />
            <Progress $width={(currentTime / duration) * 100 || 0} />
          </ProgressBar>
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressSection>
      </ControlsSection>
      
      <VolumeSection>
        <IconButton>
          <VolumeIcon />
        </IconButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeSection>
      
      {/* Use an existing audio element instead of creating a new one on every render */}
      {/* <audio ref={audioRef} /> */}
    </PlayerContainer>
  );
};

export default AudioPlayer;