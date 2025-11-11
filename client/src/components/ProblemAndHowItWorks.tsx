import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface Step {
  title: string;
  description: string;
  imageSrc: string;
}

interface ProblemAndHowItWorksProps {
  logoSrc?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    title: "pick your album",
    description: "Choose the story album you want to create — the one that will capture your family's heart.",
    imageSrc: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80"
  },
  {
    title: "record your stories",
    description: "Share your memories, moments, and wisdom — just speak naturally, and let your stories come alive.",
    imageSrc: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"
  },
  {
    title: "make your kahaani eternal",
    description: "Your stories are now safely preserved, ready to be cherished for generations.",
    imageSrc: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&q=80"
  },
  {
    title: "relish with your loved ones",
    description: "Play back your kahaani and experience laughter, nostalgia, and warmth with family and friends.",
    imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80"
  }
];

export default function ProblemAndHowItWorks({
  logoSrc = kahaniLogo,
  steps = defaultSteps
}: ProblemAndHowItWorksProps) {
  return (
    <section className="w-full bg-gradient-to-b from-[#C9C1B1] to-[#EEE9DF] py-20 px-6 sm:py-32">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Problem Statement - 60% Air, 40% Content */}
        <div className="text-center space-y-12 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B2632] leading-relaxed px-4 max-w-4xl mx-auto font-['Outfit']">
            we remember their voice,
            <br />
            but forget their stories.
            <br />
            <span className="text-[#A35139]">with kahani, preserve both.</span>
          </h2>

          {/* Logo - Breathing Space */}
          <div className="flex justify-center py-8">
            <img 
              src={logoSrc} 
              alt="Kahani Logo" 
              className="h-20 w-auto object-contain opacity-80"
            />
          </div>

          {/* Value Proposition - Warm & Human */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#1B2632]/70 leading-relaxed max-w-3xl mx-auto px-4 font-light">
            we turn your loved ones' stories, wisdom, and voice into a beautiful book of memories —
            <span className="text-[#A35139] font-medium"> easy to create, impossible to forget.</span>
          </p>
        </div>

        {/* How It Works Section - Cinematic Frames */}
        <div className="space-y-16 fade-in">
          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B2632] text-center font-['Outfit'] tracking-tight">
            how this works
          </h3>

          {/* Horizontal Scrollable Cards - Like Film Frames */}
          <div 
            className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-8"
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-8 pb-4" style={{ width: 'max-content' }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ scrollSnapAlign: 'start' }}
                  data-testid={`card-step-${index + 1}`}
                >
                  {/* Image - Soft, Warm, Like a Memory */}
                  <div className="relative w-full aspect-[4/3] bg-[#C9C1B1]/30 overflow-hidden">
                    <img
                      src={step.imageSrc}
                      alt={step.title}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Warm Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFB162]/10 to-transparent" />
                  </div>

                  {/* Content - Luxury Whitespace */}
                  <div className="p-8 space-y-4">
                    <h4 className="text-xl sm:text-2xl font-bold text-[#A35139] font-['Outfit'] leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[#1B2632]/70 leading-relaxed text-base font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator Dots - Terracotta */}
          <div className="flex justify-center gap-3 pt-4">
            {steps.map((_, index) => (
              <div 
                key={index}
                className="w-2.5 h-2.5 rounded-full bg-[#A35139]/40 hover:bg-[#A35139] transition-colors duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
