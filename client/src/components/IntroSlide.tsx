interface IntroSlideProps {
  albumTitle: string;
  artist: string;
  coverSrc: string;
  logoSrc: string;
}

export default function IntroSlide({
  albumTitle,
  artist,
  coverSrc,
  logoSrc,
}: IntroSlideProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Album Cover */}
      <img
        src={coverSrc}
        alt={`${albumTitle} album cover`}
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "auto",
          borderRadius: "8px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          marginBottom: "2rem",
        }}
        data-testid="img-album-cover"
      />

      {/* Album Info */}
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}
        data-testid="text-album-title"
      >
        {albumTitle}
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "rgba(0, 0, 0, 0.6)",
          textAlign: "center",
          marginBottom: "3rem",
        }}
        data-testid="text-artist"
      >
        {artist}
      </p>

      {/* Swipe Hint */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
        data-testid="text-swipe-hint"
      >
        Swipe → to start
      </p>

      {/* Kahani Logo - Fixed at bottom center */}
      <img
        src={logoSrc}
        alt="Kahani logo"
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "16px",
          width: "120px",
          height: "auto",
        }}
        data-testid="img-kahani-logo"
      />
    </div>
  );
}
