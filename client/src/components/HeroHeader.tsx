import heroImage from "@assets/Generated Image November 08, 2025 - 8_27PM_1762623023120.png";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface HeroHeaderProps {
  backgroundSrc?: string;
  logoSrc?: string;
  onRecord?: () => void;
  onStartTrial?: () => void;
}

export default function HeroHeader({
  backgroundSrc = heroImage,
  logoSrc = kahaniLogo,
  onRecord,
  onStartTrial
}: HeroHeaderProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#EEE9DF] to-[#C9C1B1]">
      {/* Hero Background with Blur - Late afternoon sunlight feel */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Background Image with Soft Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-md opacity-60"
          style={{ backgroundImage: `url(${backgroundSrc})` }}
        />
        
        {/* Warm Gradient Overlay - Like sunlight on old photos */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#A35139]/20 via-[#FFB162]/10 to-[#1B2632]/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full safe-area-top">
          {/* Top Navigation Bar - Luxury Whitespace */}
          <nav className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={logoSrc} 
                alt="Kahani Logo" 
                className="h-12 w-auto object-contain drop-shadow-lg"
              />
            </div>

            {/* Record Button - Soft Gradient */}
            <button
              onClick={onRecord}
              className="btn-gradient-soft px-5 py-2.5 font-medium text-sm shadow-md min-h-[44px] min-w-[44px]"
              data-testid="button-record"
            >
              Record
            </button>
          </nav>

          {/* Centered Hero Text - Cinematic Typography */}
          <div className="flex-1 flex items-center justify-center px-8 pb-32 md:pb-40">
            <div className="fade-in max-w-4xl w-full">
              <h1 className="text-[#1B2632] font-bold text-center leading-tight tracking-tight">
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 font-['Outfit']">
                  dadi's stories
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 font-['Outfit']">
                  and voices
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Outfit']">
                  in a book
                </span>
              </h1>
              
              {/* Subtle tagline */}
              <p className="text-center text-[#1B2632]/60 mt-8 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                late afternoon sunlight on memories that last forever
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start Trial Button - Gradient with Glow */}
      <div className="relative z-10 -mt-24 pb-12 px-8">
        <button
          onClick={onStartTrial}
          className="btn-gradient-primary w-full max-w-md mx-auto block px-10 py-5 font-semibold text-base sm:text-lg shadow-2xl min-h-[56px]"
          data-testid="button-start-trial"
        >
          start your free trial
        </button>
      </div>
    </section>
  );
}
