import { useState, useEffect, useRef } from 'react';
import SwipePager from '@/components/SwipePager';
import IntroSlide from '@/components/IntroSlide';
import TrackSlide, { TrackSlideRef } from '@/components/TrackSlide';
import { ALBUM, TRACKS } from '@/tracks';
import styles from '@/styles/vinyl-gallery.module.css';

export default function VinylGallery() {
  const [index, setIndex] = useState(0);
  const trackRefs = useRef<(TrackSlideRef | null)[]>([]);

  // Auto-pause when tab loses visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackRefs.current.forEach(ref => ref?.pause());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Pause audio when navigating away from a track
  useEffect(() => {
    trackRefs.current.forEach((ref, i) => {
      if (i !== index - 1) {
        ref?.pause();
      }
    });
  }, [index]);

  // Keyboard handler for Space key (play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && index > 0) {
        e.preventDefault();
        const trackRef = trackRefs.current[index - 1];
        if (trackRef && trackRef.togglePlayPause) {
          trackRef.togglePlayPause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  const handleIndexChange = (newIndex: number) => {
    // Prevent swiping left from intro slide
    if (index === 0 && newIndex < 0) {
      return;
    }
    setIndex(newIndex);
  };

  return (
    <div className={styles.vinylGalleryPage}>
      <SwipePager index={index} onIndexChange={handleIndexChange}>
      {/* Intro Slide */}
      <IntroSlide
        albumTitle={ALBUM.title}
        artist={ALBUM.artist}
        coverSrc={ALBUM.coverSrc}
        logoSrc={ALBUM.logoSrc}
      />

      {/* Track Slides */}
      {TRACKS.map((track, i) => (
        <TrackSlide
          key={track.id}
          ref={(el) => {
            trackRefs.current[i] = el;
          }}
          trackTitle={track.title}
          audioSrc={track.audioSrc}
          albumCoverSrc={ALBUM.coverSrc}
        />
      ))}
      </SwipePager>
    </div>
  );
}
