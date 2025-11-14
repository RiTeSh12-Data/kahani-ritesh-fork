import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface IntroSlideProps {
  coverSrc: string;
  title: string;
  artist: string;
  logoSrc?: string;
}

export function IntroSlide({
  coverSrc,
  title,
  artist,
  logoSrc,
}: IntroSlideProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        maxWidth: "640px",
        margin: "0 auto",
        height: "100%",
      }}
      data-testid="intro-slide"
    >
      <img
        src={coverSrc}
        alt={`${title} cover`}
        style={{
          width: "min(80vw, 400px)",
          height: "min(80vw, 400px)",
          objectFit: "cover",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        data-testid="album-cover"
        onError={(e) => {
          console.error("Failed to load cover image:", coverSrc);
          // Hide broken image
          e.currentTarget.style.display = "none";
        }}
      />
      <h1
        style={{
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          fontWeight: "700",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
        data-testid="album-title"
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "clamp(1rem, 3vw, 1.25rem)",
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: "1rem",
          textAlign: "center",
        }}
        data-testid="album-artist"
      >
        {artist}
      </p>
      <p
        style={{
          fontSize: "0.875rem",
          color: "rgba(0, 0, 0, 0.5)",
          animation: "fadeInOut 2s ease-in-out infinite",
          marginBottom: "1rem",
        }}
        data-testid="swipe-hint"
      >
        Swipe → to start
      </p>
      <img
        src={logoSrc || kahaniLogo}
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
        onError={(e) => {
          console.error("Failed to load logo:", logoSrc || "default");
          // Fallback to imported logo if provided path fails
          if (logoSrc && e.currentTarget.src !== kahaniLogo) {
            e.currentTarget.src = kahaniLogo;
          } else {
            e.currentTarget.style.display = "none";
          }
        }}
      />
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
