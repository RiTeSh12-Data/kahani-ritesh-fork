import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2, Play, Pause, Shuffle } from "lucide-react";
import { MiniPlayer } from "@/components/playlist/MiniPlayer";

const FALLBACK_AUDIO_URL = "/audio/fallback-voice-note.mp3";

interface Track {
  questionIndex: number;
  questionText: string;
  mediaUrl: string | null;
  duration?: number;
}

interface AlbumData {
  trial: {
    id: string;
    storytellerName: string;
    buyerName: string;
    selectedAlbum: string;
  };
  album: {
    description: string;
    coverImage: string;
  };
  tracks: Array<{
    questionIndex: number;
    questionText: string;
    mediaUrl: string | null;
  }>;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTotalDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
}

export default function PlaylistAlbumsGallery() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/playlist-albums/:trialId");
  const trialId = params?.trialId || "";

  const {
    data: albumData,
    isLoading,
    error,
  } = useQuery<AlbumData>({
    queryKey: [`/api/albums/${trialId}`],
    enabled: !!trialId,
  });

  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [durations, setDurations] = useState<Map<number, number>>(new Map());
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Register audio element refs
  const handleAudioRef = useCallback(
    (trackIndex: number, audio: HTMLAudioElement | null) => {
      if (audio) {
        audioRefs.current.set(trackIndex, audio);
      } else {
        audioRefs.current.delete(trackIndex);
      }
    },
    []
  );

  // Load duration for a track
  const loadDuration = useCallback((trackIndex: number, audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      setDurations((prev) => new Map(prev).set(trackIndex, audio.duration));
    });
    audio.load();
  }, []);

  // Load durations for all tracks
  useEffect(() => {
    if (albumData?.tracks) {
      albumData.tracks.forEach((track: any, index: number) => {
        if (track.mediaUrl && !durations.has(index)) {
          loadDuration(index, track.mediaUrl);
        }
      });
    }
  }, [albumData, loadDuration, durations]);

  // Handle play/pause
  const handlePlayPause = useCallback(
    (trackIndex: number) => {
      const track = albumData?.tracks[trackIndex];
      if (!track) return;

      const audioUrl = track.mediaUrl || FALLBACK_AUDIO_URL;

      // If clicking the same track, toggle play/pause
      if (playingTrackIndex === trackIndex && currentAudioRef.current) {
        if (isPlaying) {
          currentAudioRef.current.pause();
          setIsPlaying(false);
        } else {
          currentAudioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      // Stop and cleanup current audio if playing
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.removeEventListener("ended", () => {});
        currentAudioRef.current.removeEventListener("pause", () => {});
        currentAudioRef.current.removeEventListener("play", () => {});
        currentAudioRef.current = null;
      }

      // Play new track
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      setPlayingTrackIndex(trackIndex);
      setIsPlaying(true);

      const handleEnded = () => {
        setIsPlaying(false);
        setPlayingTrackIndex(null);
        currentAudioRef.current = null;
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("play", handlePlay);

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setPlayingTrackIndex(null);
        currentAudioRef.current = null;
      });
    },
    [albumData, playingTrackIndex, isPlaying]
  );

  // Handle play button (first track)
  const handlePlay = useCallback(() => {
    if (albumData?.tracks && albumData.tracks.length > 0) {
      handlePlayPause(0);
    }
  }, [albumData, handlePlayPause]);

  // Handle shuffle button
  const handleShuffle = useCallback(() => {
    if (albumData?.tracks && albumData.tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * albumData.tracks.length);
      handlePlayPause(randomIndex);
    }
  }, [albumData, handlePlayPause]);

  // Calculate total duration
  const totalDuration = Array.from(durations.values()).reduce(
    (sum, duration) => sum + duration,
    0
  );

  if (!trialId) {
    return (
      <div
        style={{
          background: "#FDF4DC",
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontFamily: "Outfit", fontSize: "1.5rem", color: "#000" }}>
          Invalid album link
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#FDF4DC",
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p style={{ fontFamily: "Outfit", fontSize: "1.5rem", color: "#000" }}>
          Failed to load album
        </p>
        <button
          onClick={() => setLocation("/")}
          style={{
            fontFamily: "Outfit",
            padding: "0.5rem 1rem",
            background: "#000",
            color: "#FDF4DC",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (isLoading || !albumData) {
    return (
      <div
        style={{
          background: "#FDF4DC",
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontFamily: "Outfit", fontSize: "1.5rem", color: "#000" }}>
          Loading album...
        </p>
      </div>
    );
  }

  const { trial, album, tracks } = albumData;
  const trackCount = tracks.length;
  const currentTrack =
    playingTrackIndex !== null ? tracks[playingTrackIndex] : null;

  return (
    <div
      style={{
        background: "#FDF4DC",
        minHeight: "100dvh",
        paddingBottom: isPlaying ? "80px" : "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#FDF4DC",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setLocation("/")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} color="#000" />
        </button>
        <button
          onClick={async () => {
            if (!albumData) return;
            const url = window.location.href;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: albumData.trial.selectedAlbum,
                  text: `Check out this Kahani album: ${albumData.trial.selectedAlbum}`,
                  url: url,
                });
              } catch (error) {
                // User cancelled or error occurred
                if (error instanceof Error && error.name !== "AbortError") {
                  console.error("Error sharing:", error);
                }
              }
            } else {
              // Fallback: copy to clipboard
              try {
                await navigator.clipboard.writeText(url);
                // You could show a toast notification here
                alert("Link copied to clipboard!");
              } catch (error) {
                console.error("Failed to copy link:", error);
                alert("Failed to copy link. Please copy manually: " + url);
              }
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          aria-label="Share album"
        >
          <Share2 size={24} color="#000" />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "0 1rem 1rem" }}>
        {/* Album Cover */}
        <img
          src={album.coverImage}
          alt={trial.selectedAlbum}
          style={{
            width: "100%",
            maxWidth: "280px",
            height: "auto",
            borderRadius: "12px",
            margin: "0.75rem auto 0.5rem",
            display: "block",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          }}
        />

        {/* Album Title */}
        <h1
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#000",
            margin: "1rem 0 0.75rem",
            textAlign: "left",
          }}
        >
          {trial.selectedAlbum}
        </h1>

        {/* Storyteller Tag and Description */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.75rem",
              fontWeight: "500",
              color: "#A35139",
              background: "rgba(163, 81, 57, 0.1)",
              padding: "0.25rem 0.75rem",
              borderRadius: "12px",
            }}
          >
            {trial.storytellerName}
          </span>
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.8125rem",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            Recorded with love for {trial.buyerName} by {trial.storytellerName}.
          </span>
        </div>

        {/* Duration and Count */}
        <p
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
            margin: "0 0 1.5rem",
            textAlign: "left",
          }}
        >
          {totalDuration > 0
            ? `${formatTotalDuration(totalDuration)} • ${trackCount} stories`
            : `${trackCount} stories`}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={handlePlay}
            style={{
              flex: 1,
              padding: "0.875rem 1.5rem",
              background: "#A35139",
              color: "#FFF",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: "600",
              fontFamily: "Outfit, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
              minHeight: "48px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B4229";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#A35139";
            }}
          >
            <Play size={20} fill="currentColor" />
            Play
          </button>
          <button
            onClick={handleShuffle}
            style={{
              padding: "0.875rem 1.5rem",
              background: "#FFF",
              color: "#000",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: "600",
              fontFamily: "Outfit, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
              minHeight: "48px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F5F5F5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFF";
            }}
          >
            <Shuffle size={20} />
            Shuffle
          </button>
        </div>

        {/* Album Description Box */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "0.875rem",
              color: "rgba(0, 0, 0, 0.7)",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {album.description}
          </p>
        </div>

        {/* Track List */}
        <div>
          {tracks.map((track: any, index: number) => {
            const duration = durations.get(index) || 0;
            const isCurrentTrack = playingTrackIndex === index;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                }}
                onClick={() => handlePlayPause(index)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: isCurrentTrack ? "600" : "400",
                      color: "#000",
                      margin: 0,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {track.questionText}
                  </p>
                  {duration > 0 && (
                    <p
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "0.8125rem",
                        color: "rgba(0, 0, 0, 0.6)",
                        margin: 0,
                      }}
                    >
                      {formatDuration(duration)}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(index);
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: isCurrentTrack
                      ? "#A35139"
                      : "rgba(0, 0, 0, 0.1)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: isCurrentTrack ? "#FFF" : "#000",
                    transition: "all 0.2s ease",
                    marginLeft: "1rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentTrack) {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentTrack) {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  aria-label={`Play ${track.questionText}`}
                >
                  {isCurrentTrack && isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Player */}
      {currentTrack && (
        <MiniPlayer
          isVisible={isPlaying || playingTrackIndex !== null}
          isPlaying={isPlaying}
          trackTitle={currentTrack.questionText}
          albumTitle={trial.selectedAlbum}
          coverImage={album.coverImage}
          onPlayPause={() => {
            if (playingTrackIndex !== null) {
              handlePlayPause(playingTrackIndex);
            }
          }}
        />
      )}
    </div>
  );
}

