import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';
import { Track } from '../types/track';
import config from "../config";
import { useAuth } from '../contexts/AuthContext';

// ====== Styled Components ======

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 0.6rem 1.5rem;
  display: flex;
  justify-content: space-between;
  //grid-template-columns: minmax(180px, 1fr) 2fr minmax(150px, 1fr);
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  /* Ensure player doesn't block scrolling */
  height: auto;
  max-height: 90px;
  /* Add smooth transition */
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0.8rem;
    gap: 0.8rem;
    max-height: 160px;
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
  font-size: 0.9rem;
  color: #b3b3b3;
  min-width: 2rem;
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
    position: relative;
    top: -4px;
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
  width: ${props => props.$primary ? '48px' : '36px'};
  height: ${props => props.$primary ? '48px' : '36px'};
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
    width: ${props => props.$primary ? '28px' : '24px'};
    height: ${props => props.$primary ? '28px' : '24px'};
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

const VolumeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>
);

// ====== Types ======

interface AudioPlayerProps {
  track: Track | null;
}

// ====== Main Component ======

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const { getAccessToken } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  
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
      if (isMuted && newVolume > 0) {
        setIsMuted(false);
      }
    }
  }, [isMuted]);
  
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
  
  // Toggle mute/unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);
  
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
    
    // Добавляем токен авторизации к URL стрима
    const accessToken = getAccessToken();
    let streamUrl = `${config.MEDIA_URL}/track/${track.id}/index.m3u8`;
    
    // Если есть токен, добавляем его в URL
    if (accessToken) {
      streamUrl = `${streamUrl}?token=${encodeURIComponent(accessToken)}`;
    }
    
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr, url) => {
          // Если в URL еще нет токена, добавляем заголовок авторизации к запросам
          if (!url.includes('token=') && accessToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
          }
        }
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

      hls.on(Hls.Events.ERROR, (_, data) => {
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
  }, [track, getAccessToken]); // Добавлен getAccessToken в зависимости
  
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

  const coverUrl = track.avatarUrl ? `${config.MEDIA_URL}/image/${track.avatarUrl}` : "https://placehold.co/400";
  
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
        <IconButton onClick={toggleMute}>
          {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
        </IconButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </VolumeSection>
      
      {/* Use an existing audio element instead of creating a new one on every render */}
      {/* <audio ref={audioRef} /> */}
    </PlayerContainer>
  );
};

export default AudioPlayer;