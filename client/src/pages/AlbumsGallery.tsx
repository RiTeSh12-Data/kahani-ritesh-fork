import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { SwipePager } from "@/components/vinyl/SwipePager";
import { IntroSlide } from "@/components/vinyl/IntroSlide";
import { TrackSlide } from "@/components/vinyl/TrackSlide";
import type { Track } from "@/tracks";

const FALLBACK_AUDIO_URL = "/audio/fallback-voice-note.mp3";

export default function AlbumsGallery() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/albums/:trialId");
  const trialId = params?.trialId || "";

  const {
    data: albumData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/albums/${trialId}`],
    enabled: !!trialId,
  });

  const [index, setIndex] = useState(0);
  const [playingTrackId, setPlayingTrackId] = useState<string | undefined>();
  const [durations, setDurations] = useState<Map<string, number>>(new Map());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Register audio element refs from child components
  const handleAudioRef = useCallback(
    (trackId: string, audio: HTMLAudioElement | null) => {
      if (audio) {
        audioRefs.current.set(trackId, audio);
      } else {
        audioRefs.current.delete(trackId);
      }
    },
    [],
  );

  // Close button handler
  const handleClose = () => {
    setLocation("/");
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Pause all audio when navigating to intro or swiping between tracks
  useEffect(() => {
    // Pause any currently playing audio
    if (playingTrackId) {
      const audio = audioRefs.current.get(playingTrackId);
      if (audio && !audio.paused) {
        audio.pause();
      }
      setPlayingTrackId(undefined);
    }
  }, [index]);

  // Persist index in history state (optional enhancement)
  useEffect(() => {
    if (window.history.state?.vinylIndex !== index) {
      window.history.replaceState({ vinylIndex: index }, "");
    }
  }, [index]);

  // Restore index from history on mount
  useEffect(() => {
    const savedIndex = window.history.state?.vinylIndex;
    const maxIndex = albumData?.tracks?.length || 0;
    if (
      typeof savedIndex === "number" &&
      savedIndex >= 0 &&
      savedIndex <= maxIndex
    ) {
      setIndex(savedIndex);
    }
  }, [albumData]);

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

  const { trial, tracks: apiTracks } = albumData;

  const tracks: Track[] = apiTracks.map((apiTrack: any) => ({
    id: `track-${apiTrack.questionIndex}`,
    title: apiTrack.questionText,
    audioSrc: apiTrack.mediaUrl || FALLBACK_AUDIO_URL,
    coverSrc: "/attached_assets/vinyl-cover.png",
  }));

  const slides = [
    <IntroSlide
      key="intro"
      coverSrc="/attached_assets/vinyl-cover.png"
      title={trial.selectedAlbum}
      artist={trial.storytellerName}
      logoSrc="/attached_assets/kahani-logo.png"
    />,
    ...tracks.map((track, trackIndex) => (
      <TrackSlide
        key={track.id}
        track={track}
        isActive={index === trackIndex + 1}
        isPlaying={playingTrackId === track.id}
        onPlay={() => {
          // Deterministic audio control: pause any currently playing audio first
          if (playingTrackId && playingTrackId !== track.id) {
            const currentAudio = audioRefs.current.get(playingTrackId);
            if (currentAudio && !currentAudio.paused) {
              currentAudio.pause();
            }
          }
          // Then set the new track as playing
          setPlayingTrackId(track.id);
        }}
        onPause={() => {
          // Only clear if this track is currently playing
          if (playingTrackId === track.id) {
            setPlayingTrackId(undefined);
          }
        }}
        onDurationLoad={(duration) => {
          setDurations((prev) => new Map(prev).set(track.id, duration));
        }}
        onAudioRef={handleAudioRef}
      />
    )),
  ];

  return (
    <div
      data-testid="albums-gallery-page"
      style={{
        background: "#FDF4DC",
        color: "#000000",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Close button - fixed top-left */}
      <button
        onClick={handleClose}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
          background: "rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
        }}
        aria-label="Close vinyl gallery and return to homepage"
        data-testid="button-close-demo"
      >
        <X color="#000" size={24} />
      </button>

      <SwipePager index={index} onIndexChange={setIndex}>
        {slides}
      </SwipePager>
    </div>
  );
}
