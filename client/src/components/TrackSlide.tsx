import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Vinyl from './Vinyl';
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface TrackSlideProps {
  trackTitle: string;
  audioSrc: string;
  albumCoverSrc: string;
}

export interface TrackSlideRef {
  pause: () => void;
  togglePlayPause: () => void;
}

const TrackSlide = forwardRef<TrackSlideRef, TrackSlideProps>(
  ({ trackTitle, audioSrc, albumCoverSrc }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          // Optimistically set playing state for UI feedback
          setIsPlaying(true);
          audioRef.current.play().catch((err) => {
            console.warn('Playback failed (using placeholder audio):', err.message);
            // Keep UI in playing state even if audio fails - vinyl still spins
          });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      },
      togglePlayPause,
    }));

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      const handleError = (e: Event) => {
        e.preventDefault();
        console.warn('Audio failed to load (using placeholder source)');
        // Don't set isPlaying to false - UI should still show playing state
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }, []);

    const formatTime = (seconds: number): string => {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const vinylSize = typeof window !== 'undefined' && window.innerWidth < 480
      ? Math.min(window.innerWidth * 0.75, 320)
      : 320;

    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        gap: '2rem',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        {/* Track Title */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '1rem',
        }} data-testid="text-track-title">
          {trackTitle}
        </h2>

        {/* Vinyl Record */}
        <Vinyl
          isPlaying={isPlaying}
          onToggle={togglePlayPause}
          size={vinylSize}
          albumCoverSrc={albumCoverSrc}
        />

        {/* Time Display */}
        <div
          role="timer"
          aria-live="off"
          aria-atomic="true"
          style={{
            fontSize: '1rem',
            color: '#000000',
            textAlign: 'center',
          }}
          data-testid="text-time-display"
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
        />

        {/* Kahani Logo */}
        <img
          src={kahaniLogo}
          alt="Kahani Logo"
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '16px',
            width: '120px',
            height: 'auto',
          }}
          data-testid="kahani-logo"
        />
      </div>
    );
  }
);

TrackSlide.displayName = 'TrackSlide';

export default TrackSlide;
