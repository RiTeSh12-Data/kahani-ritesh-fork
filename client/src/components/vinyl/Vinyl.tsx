import { type CSSProperties } from "react";
import styles from "@/styles/vinyl.module.css";

interface VinylProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: number;
  labelImageSrc: string;
}

export function Vinyl({ isPlaying, onToggle, size = 300, labelImageSrc }: VinylProps) {
  const style = {
    "--size": `${size}px`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.record} ${isPlaying ? styles.spinning : styles.paused}`}
      style={style}
      onClick={onToggle}
      role="button"
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Pause" : "Play"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      data-testid="vinyl-record"
    >
      {/* Center label image */}
      <img
        className={styles.labelImg}
        src={labelImageSrc}
        alt="Record label"
        loading="lazy"
        draggable={false}
      />

      {/* Play/Pause button overlay */}
      <button
        className={styles.playBtn}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
        data-testid="vinyl-play-button"
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
