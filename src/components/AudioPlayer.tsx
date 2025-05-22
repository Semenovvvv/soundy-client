import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styled, { keyframes, css } from 'styled-components';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: auto;
  background: linear-gradient(90deg, #232526 0%, #414345 100%);
  color: white;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -8px 32px rgba(0,0,0,0.35);
  z-index: 1001;
  max-width: 100vw;
  gap: 1rem;
  box-sizing: border-box;
  @media (max-width: 900px) {
    padding: 0.5rem 0.3rem 1.2rem 0.3rem;
    gap: 0.5rem;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 0.2rem 2.2rem 0.2rem;
    gap: 0.3rem;
  }
`;

const AlbumArt = styled.div`
  width: 56px;
  height: 56px;
  background: #444;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TrackInfo = styled.div`
  flex: 2;
  min-width: 0;
  max-width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  @media (max-width: 700px) {
    max-width: 100vw;
    align-items: flex-start;
  }
`;

const TrackTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.p`
  margin: 0;
  color: #b3b3b3;
  font-size: 0.92rem;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressContainer = styled.div`
  flex: 4;
  min-width: 0;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 0.7rem;
  @media (max-width: 900px) {
    margin: 0 0.2rem;
    max-width: 220px;
  }
  @media (max-width: 700px) {
    margin: 0 0.1rem;
    max-width: 100vw;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  margin-bottom: 0.2rem;
`;

const Progress = styled.div.attrs<{ $progress: number }>((props) => ({
  style: {
    width: `${props.$progress}%`,
  },
}))<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #1db954 0%, #1ed760 100%);
  border-radius: 4px;
  position: absolute;
  transition: width 0.1s linear;
`;

const BufferedProgress = styled.div.attrs<{ $bufferedPercent: number }>((props) => ({
  style: {
    width: `${props.$bufferedPercent}%`,
  },
}))<{ $bufferedPercent: number }>`
  height: 100%;
  background: rgba(255,255,255,0.25);
  border-radius: 4px;
  position: absolute;
  z-index: 0;
`;

const Time = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #b3b3b3;
  margin-top: 0.1rem;
  font-variant-numeric: tabular-nums;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex: 1;
  justify-content: center;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 #1db95455; }
  70% { box-shadow: 0 0 0 10px #1db95400; }
  100% { box-shadow: 0 0 0 0 #1db95400; }
`;

const Button = styled.button<{ $main?: boolean }>`
  background: ${({ $main }) => $main ? 'linear-gradient(90deg, #1db954 0%, #1ed760 100%)' : 'none'};
  border: none;
  color: ${({ $main }) => $main ? '#fff' : '#fff'};
  cursor: pointer;
  padding: ${({ $main }) => $main ? '0.7rem' : '0.35rem'};
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ $main }) => $main ? '0 4px 16px #1db95433' : 'none'};
  font-size: 1.1rem;
  ${({ $main }) => $main && css`animation: ${pulse} 1.5s infinite;`}
  &:hover {
    background: ${({ $main }) => $main ? 'linear-gradient(90deg, #1ed760 0%, #1db954 100%)' : 'rgba(255,255,255,0.08)'};
    transform: scale(1.08);
  }
  &:active {
    transform: scale(0.96);
  }
  svg {
    width: ${({ $main }) => $main ? '28px' : '22px'};
    height: ${({ $main }) => $main ? '28px' : '22px'};
  }
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 70px;
  flex: 1;
  justify-content: flex-end;
`;

const VolumeSlider = styled.input`
  width: 60px;
  height: 5px;
  -webkit-appearance: none;
  background: rgba(255,255,255,0.18);
  border-radius: 2.5px;
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #1db954;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px #1db95444;
  }
`;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const SkipPrevious = () => (
  <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const SkipNext = () => (
  <svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

interface AudioPlayerProps {
  trackId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ trackId }) => {
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateBuffered = () => {
      if (audio.duration > 0) {
        let bufferedTime = 0;
        for (let i = 0; i < audio.buffered.length; i++) {
          bufferedTime = Math.max(bufferedTime, audio.buffered.end(i));
        }
        setBufferedPercent((bufferedTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('progress', updateBuffered);
    return () => {
      audio.removeEventListener('progress', updateBuffered);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // audio.play(); // УБРАН автозапуск
        // setIsPlaying(true);
      });
      hls.loadSource(`http://localhost:8085/api/file/track/${trackId}/index.m3u8`);
      return () => {
        hls.destroy();
      };
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = `http://localhost:8085/api/file/track/${trackId}/index.m3u8`;
      // audio.play(); // УБРАН автозапуск
      // setIsPlaying(true);
    }
  }, [trackId]);

  return (
    <PlayerContainer>
      <AlbumArt>
        <img src="/placeholder-album-art.jpg" alt="Album Art" />
      </AlbumArt>
      <TrackInfo>
        <TrackTitle>Chill Vibes</TrackTitle>
        <Artist>Unknown Artist</Artist>
      </TrackInfo>
      <ControlButtons>
        <Button onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}>
          <SkipPrevious />
        </Button>
        <Button $main onClick={() => {
          if (audioRef.current) {
            if (!isPlaying) {
              audioRef.current.play();
              setIsPlaying(true);
            } else {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }
        }}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}>
          <SkipNext />
        </Button>
      </ControlButtons>
      <ProgressContainer>
        <ProgressBar ref={progressBarRef} onClick={handleProgressClick}>
          <BufferedProgress $bufferedPercent={bufferedPercent} />
          <Progress $progress={(currentTime / duration) * 100 || 0} />
        </ProgressBar>
        <Time>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </Time>
      </ProgressContainer>
      <VolumeContainer>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeContainer>
      <audio ref={audioRef} />
    </PlayerContainer>
  );
};

export default AudioPlayer;