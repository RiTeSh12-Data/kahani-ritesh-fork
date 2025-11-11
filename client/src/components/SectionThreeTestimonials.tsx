import { Button } from "@/components/ui/button";

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  photoSrc: string;
  photoAlt: string;
}

export interface SectionThreeTestimonialsProps {
  onLearnMore?: () => void;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote: "We never imagined how easy it would be for Dad to share his stories, no writing, just speaking. And now our children can hear his voice, laugh with him, and feel closer than ever. Kahani has given our family a legacy,",
    author: "— Aarav & Family",
    photoSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    photoAlt: "Aarav & Family"
  },
  {
    id: 2,
    quote: "मैंने कभी नहीं सोचा था कि बचपन की मेरी छोटी-छोटी कहानियाँ या सीखे हुए सबक इतना मायने रखेंगे। Kahani पर अपनी कहानियाँ रिकॉर्ड करना ऐसा था जैसे मेरी ज़िन्दगी फिर से जी रही हूँ, हँसी, चुनौतियाँ, सब कुछ। और अब मेरे पोते-पोतियाँ मुझे सुन सकते हैं, मुझे समझ सकते हैं,",
    author: "— दादी, Meena B.",
    photoSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    photoAlt: "Dadi Meena B."
  },
  {
    id: 3,
    quote: "What Kahani did was unlock stories we had never heard before. My grandmother's childhood in a small village, her friendships, the festivals she celebrated, all captured, preserved, and now part of our family's history. It truly brought the past alive,",
    author: "— Rohan S.",
    photoSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    photoAlt: "Rohan S."
  },
  {
    id: 4,
    quote: "शुरुआत में, मुझे अपनी यादें रिकॉर्ड करने को लेकर थोड़ी घबराहट थी, मुझे लगा कोई इनमे रुचि नहीं लेगा। लेकिन जैसे-जैसे मैंने बोलना शुरू किया, मुझे एहसास हुआ कि ये कहानियाँ कितनी महत्वपूर्ण हैं। मेरे बच्चे अब मेरी आवाज़ में मेरी ज़िन्दगी को जानते हैं,",
    author: "— पिता, Rajiv S.",
    photoSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    photoAlt: "Pita Rajiv S."
  },
  {
    id: 5,
    quote: "The best part is seeing how the album brings us together. My cousins, my niece and nephew, they all want to listen to the recordings now. It's more than a book, it's our story, our voices, our memories. Thank you, Kahani,",
    author: "— Sonal & Amit P",
    photoSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    photoAlt: "Sonal & Amit P"
  }
];

export default function SectionThreeTestimonials({
  onLearnMore,
  testimonials = defaultTestimonials
}: SectionThreeTestimonialsProps) {
  return (
    <section className="w-full bg-white px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Learn More Button */}
        <div className="w-full max-w-2xl mx-auto">
          <Button
            onClick={onLearnMore}
            className="w-full bg-[#1B2632] text-[#EEE9DF] border-[#1B2632] rounded-2xl font-semibold text-lg shadow-lg"
            size="lg"
            data-testid="button-learn-more"
          >
            Learn more
          </Button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B2632] text-center font-['Outfit']">
          What people have to say?
        </h2>

        {/* Testimonials Slider */}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-8"
          role="region"
          aria-label="Testimonials carousel"
          aria-roledescription="carousel"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[85vw] max-w-[500px] bg-white rounded-2xl shadow-lg p-5 sm:p-6 space-y-3 sm:space-y-4"
                style={{ scrollSnapAlign: 'start' }}
                aria-roledescription="slide"
                aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
                data-testid={`testimonial-${testimonial.id}`}
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={testimonial.photoSrc}
                    alt={testimonial.photoAlt}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                </div>

                {/* Quote */}
                <p className="text-[#1B2632] leading-relaxed text-sm sm:text-base">
                  "{testimonial.quote}"
                </p>

                {/* Attribution */}
                <p className="text-[#1B2632]/60 italic text-xs sm:text-sm">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-3 pt-4">
          {testimonials.map((_, index) => (
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
