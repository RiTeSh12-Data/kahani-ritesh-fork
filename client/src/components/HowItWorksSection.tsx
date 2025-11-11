interface Step {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface HowItWorksSectionProps {
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    number: "1",
    title: "Pick your album",
    description: "Choose the story album you want to create — the one that will capture your family's heart.",
    imageSrc: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80"
  },
  {
    number: "2",
    title: "Record your stories",
    description: "Share your memories, moments, and wisdom — just speak naturally, and let your stories come alive.",
    imageSrc: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"
  },
  {
    number: "3",
    title: "Make your Kahani eternal",
    description: "Your stories are now safely preserved, ready to be cherished for generations.",
    imageSrc: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&q=80"
  },
  {
    number: "4",
    title: "Relish with your loved ones",
    description: "Play back your Kahani and experience laughter, nostalgia, and warmth with family and friends.",
    imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80"
  }
];

export default function HowItWorksSection({
  steps = defaultSteps
}: HowItWorksSectionProps) {
  return (
    <section className="w-full bg-white px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B2632] text-center mb-10 sm:mb-12 font-['Outfit']">
          How It Works
        </h2>

        {/* Horizontal Scrollable Cards */}
        <div 
          className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-8"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] sm:w-[340px] space-y-4"
                style={{ scrollSnapAlign: 'start' }}
                data-testid={`step-${index + 1}`}
              >
                {/* Video/Image Card */}
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#1B2632] shadow-xl">
                  <img
                    src={step.imageSrc}
                    alt={step.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  
                  {/* Step Number Overlay */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-[#A35139] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                </div>

                {/* Step Content */}
                <div className="px-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1B2632] mb-2 font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-[#1B2632]/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-3 pt-4">
          {steps.map((_, index) => (
            <div 
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-[#A35139]/40 hover:bg-[#A35139] transition-colors duration-300"
            />
          ))}
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
