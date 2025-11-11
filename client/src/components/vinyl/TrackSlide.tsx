import { useState, useEffect, useRef } from "react";
import { Vinyl } from "./Vinyl";
import { ALBUM, type Track } from "@/tracks";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface TrackSlideProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onDurationLoad?: (duration: number) => void;
  onAudioRef?: (trackId: string, audio: HTMLAudioElement | null) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TrackSlide({ track, isActive, isPlaying, onPlay, onPause, onDurationLoad, onAudioRef }: TrackSlideProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Register audio ref with parent
  useEffect(() => {
    if (audioRef.current) {
      onAudioRef?.(track.id, audioRef.current);
    }
    return () => {
      onAudioRef?.(track.id, null);
    };
  }, [track.id, onAudioRef]);

  // Sync audio element with isPlaying prop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.paused) {
      audio.play().catch((err) => {
        console.warn("Playback failed (using placeholder audio):", err.message);
        // Keep UI in playing state even if audio fails - vinyl still spins
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, onPause]);

  // Pause when slide becomes inactive
  useEffect(() => {
    if (!isActive && isPlaying) {
      onPause();
    }
  }, [isActive, isPlaying, onPause]);

  // Pause on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        onPause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying, onPause]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      setDuration(dur);
      onDurationLoad?.(dur);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setCurrentTime(0);
      onPause();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onDurationLoad, onPause]);

  // Keyboard space bar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && isActive) {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isPlaying]);

  const handleToggle = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        maxWidth: "640px",
        margin: "0 auto",
        height: "100%",
        gap: "2rem",
      }}
      data-testid={`track-slide-${track.id}`}
    >
      <h2
        style={{
          fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "1rem",
        }}
        data-testid="track-title"
      >
        {track.title}
      </h2>

      <Vinyl 
        isPlaying={isPlaying} 
        onToggle={handleToggle} 
        size={Math.min(window.innerWidth * 0.75, 300)} 
        labelImageSrc={ALBUM.coverSrc}
      />

      <div
        style={{
          fontSize: "1rem",
          color: "#000000",
          fontVariantNumeric: "tabular-nums",
        }}
        role="timer"
        aria-live="off"
        data-testid="track-time"
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <audio
        ref={audioRef}
        src={track.audioSrc}
        preload="metadata"
        data-testid="audio-element"
      />

      <img
        src={kahaniLogo}
        alt="Kahani Logo"
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "16px",
          width: "120px",
          height: "auto",
        }}
        data-testid="kahani-logo"
      />
    </div>
  );
}
