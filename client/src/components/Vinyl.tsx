import styles from '@/styles/vinyl.module.css';

interface VinylProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: number;
  albumCoverSrc: string;
}

export default function Vinyl({ isPlaying, onToggle, size = 320, albumCoverSrc }: VinylProps) {
  const handleClick = () => {
    onToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`${styles.record} ${styles.spinning} ${!isPlaying ? styles.paused : ''}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={isPlaying ? 'Pause track' : 'Play track'}
      data-testid="vinyl-record"
    >
      {/* Center label with album cover - rotates with the record */}
      <img 
        src={albumCoverSrc} 
        alt="Album cover" 
        className={styles.labelImg}
        draggable={false}
      />

      {/* Play/Pause button overlay */}
      <button
        className={styles.playBtn}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        data-testid="button-play-pause"
      >
        {isPlaying ? (
          <div className={styles.pauseIcon}>
            <div className={styles.pauseBar} />
            <div className={styles.pauseBar} />
          </div>
        ) : (
          <div className={styles.playIcon} />
        )}
      </button>
    </div>
  );
}
