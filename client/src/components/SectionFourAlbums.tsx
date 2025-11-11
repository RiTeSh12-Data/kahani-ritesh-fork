import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export interface AlbumCard {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  questions: string[];
}

export interface SectionFourAlbumsProps {
  albums?: AlbumCard[];
  onTryDemo?: () => void;
}

const defaultAlbums: AlbumCard[] = [
  {
    id: 1,
    title: "Our Family History",
    description: "These questions help you revisit the people, places, and small moments that shaped your earliest memories — the roots of who you are today.",
    imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    imageAlt: "Our Family History",
    questions: [
      "When you think of your childhood home, what picture or feeling comes to mind first?",
      "Did your family have any small traditions or habits that made your days special?",
      "Which dishes instantly take you back to your childhood, and who used to make them?",
      "What was your neighborhood like when you were growing up?",
      "Who were your childhood friends, and what games did you play together?",
      "What was school like for you as a child?",
      "Did you have a favorite teacher or mentor who influenced you?",
      "What festivals or celebrations did your family observe?",
      "What stories did your parents or grandparents tell you about their own childhoods?",
      "What was your relationship like with your siblings or cousins?",
      "Were there any family heirlooms or treasures that were important to your family?",
      "What kind of music or entertainment did your family enjoy together?",
      "Did your family face any hardships when you were young, and how did you overcome them?",
      "What values did your parents emphasize most when raising you?",
      "Is there a family story that has been passed down through generations?"
    ]
  },
  {
    id: 2,
    title: "Their Life Paths",
    description: "These questions invite you to reflect on your life's journey — the moments, choices, and people that taught you who you are.",
    imageSrc: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80",
    imageAlt: "Their Life Paths",
    questions: [
      "What was your first job, and how did you feel earning your first income?",
      "What were your dreams when you were young, and how did they change with time?",
      "Was there a mistake that ended up teaching you something important?",
      "How did you meet your life partner, and what drew you to them?",
      "What was the proudest moment of your career or work life?",
      "Have you ever taken a risk that completely changed your life's direction?",
      "What was the most difficult decision you ever had to make?",
      "Who has been your greatest source of support throughout your life?",
      "What accomplishment are you most proud of?",
      "If you could go back and give your younger self advice, what would it be?",
      "What was a turning point in your life that shaped who you became?",
      "How did you handle setbacks or failures along the way?",
      "What traditions or practices have you carried forward from your own upbringing?",
      "What unexpected joy or surprise has life brought you?",
      "How has your definition of success changed over the years?"
    ]
  },
  {
    id: 3,
    title: "Words of Wisdom",
    description: "These questions encourage you to share the wisdom, values, and reflections that your life's journey has taught you — the thoughts you'd like to pass on.",
    imageSrc: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&q=80",
    imageAlt: "Words of Wisdom",
    questions: [
      "What lesson from your parents has stayed with you through life?",
      "Have you ever experienced a complete change in your beliefs or outlook?",
      "How have your personal or spiritual beliefs guided your path?",
      "What do you think is the secret to a happy life?",
      "What would you like future generations to know about living a meaningful life?",
      "What does love mean to you, and how has that understanding evolved?",
      "What do you consider your greatest strength, and how did you develop it?",
      "If you could share one piece of wisdom with the world, what would it be?",
      "What brings you the most peace and contentment in life?",
      "How do you want to be remembered by those you love?",
      "What role has forgiveness played in your life?",
      "What do you think is most important when raising a family?",
      "What advice would you give about handling difficult times?",
      "What do you believe makes a relationship strong and lasting?",
      "Looking back on your life, what matters most to you now?"
    ]
  }
];

export default function SectionFourAlbums({
  albums = defaultAlbums,
  onTryDemo
}: SectionFourAlbumsProps) {
  return (
    <section className="w-full bg-[#EEE9DF] px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B2632] text-center font-['Outfit']">
          Explore albums
        </h2>

        {/* Albums Slider */}
        <div
          className="overflow-x-auto scrollbar-hide -mx-6 px-6 pb-8"
          role="region"
          aria-label="Albums carousel"
          aria-roledescription="carousel"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex-shrink-0 w-[85vw] max-w-[500px] bg-white rounded-2xl shadow-lg overflow-hidden"
                style={{ scrollSnapAlign: 'start' }}
                aria-roledescription="carousel item"
                data-testid={`album-${album.id}`}
              >
                {/* Content - Title and Description First */}
                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1B2632] font-['Outfit']">
                    {album.title}
                  </h3>
                  <p className="text-[#1B2632]/70 leading-relaxed text-sm sm:text-base">
                    {album.description}
                  </p>
                </div>

                {/* Cover Image */}
                <div className="w-full aspect-video bg-[#C9C1B1]/30 overflow-hidden">
                  <img
                    src={album.imageSrc}
                    alt={album.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Questions */}
                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <h4 className="text-sm font-semibold text-[#1B2632]/80 uppercase tracking-wide">
                    Questions
                  </h4>
                  <ul className="space-y-3">
                    {album.questions.slice(0, 3).map((question, index) => (
                      <li
                        key={index}
                        className="text-[#1B2632]/70 text-sm sm:text-base leading-relaxed pl-4 border-l-2 border-[#A35139]/30"
                      >
                        {question}
                      </li>
                    ))}
                  </ul>
                  {album.questions.length > 3 && (
                    <p className="text-[#A35139] text-sm sm:text-base font-semibold pl-4">
                      +{album.questions.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-3 pt-4">
          {albums.map((_, index) => (
            <div
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-[#A35139]/40 hover:bg-[#A35139] transition-colors duration-300"
            />
          ))}
        </div>

        {/* Try Interactive Demo Button */}
        {onTryDemo && (
          <div className="text-center pt-8">
            <Button
              onClick={onTryDemo}
              className="px-8 py-4 bg-[#A35139] text-white border-[#A35139] rounded-xl font-semibold text-lg shadow-lg"
              size="lg"
              data-testid="button-try-demo"
            >
              <Music className="h-5 w-5 mr-2" />
              Try Interactive Demo
            </Button>
            <p className="text-[#1B2632]/60 text-sm mt-3">
              Experience a sample Kahani album
            </p>
          </div>
        )}
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
