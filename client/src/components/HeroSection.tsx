import heroImage from "@assets/Generated Image November 08, 2025 - 8_27PM_1762623023120.png";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  imageSrc?: string;
  onStartTrialClick?: () => void;
}

export default function HeroSection({
  imageSrc = heroImage,
  onStartTrialClick
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt="Kahani storytelling experience"
          className="w-full h-full object-cover"
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2632]/70 via-[#1B2632]/30 to-transparent" />
      </div>

      {/* Content - Centered with More Space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-16 sm:pb-20 pt-24 sm:pt-32">
        {/* Text Overlay - Three Lines */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight tracking-tight mb-16 sm:mb-24 font-['Outfit'] max-w-4xl"
          data-testid="text-hero-headline"
        >
          DADI'S<br />
          STORIES AND VOICES<br />
          IN A BOOK
        </h1>

        {/* Start Trial Button - Positioned Lower */}
        <div className="w-full max-w-md mt-8 sm:mt-12">
          <Button
            onClick={onStartTrialClick}
            className="w-full bg-[#1B2632] text-[#EEE9DF] border-[#1B2632] rounded-2xl font-semibold text-lg shadow-2xl"
            size="lg"
            data-testid="button-start-trial"
          >
            start your free trial
          </Button>
        </div>
      </div>
    </section>
  );
}
