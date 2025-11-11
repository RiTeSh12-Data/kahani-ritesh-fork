import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface ValuePropositionProps {
  headlineText?: string;
  bodyText?: string;
  logoSrc?: string;
}

export default function ValueProposition({
  headlineText = "WE REMEMBER THEIR VOICE, BUT FORGET THEIR STORIES. WITH KAHANI, PRESERVE BOTH.",
  bodyText = "We turn your loved ones' stories, wisdom, and voice into a beautiful book of memories: easy to create, impossible to forget.",
  logoSrc = kahaniLogo
}: ValuePropositionProps) {
  return (
    <section className="w-full bg-[#EEE9DF] px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Headline Text - Before Logo */}
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2632] leading-tight font-['Outfit']"
          data-testid="text-headline"
        >
          {headlineText}
        </h2>

        {/* Logo Space */}
        <div className="flex justify-center py-4">
          <img 
            src={logoSrc} 
            alt="Kahani Logo" 
            className="h-24 w-auto object-contain opacity-80"
            data-testid="img-logo"
          />
        </div>

        {/* Value Proposition Text - After Logo */}
        <p 
          className="text-lg sm:text-xl md:text-2xl text-[#1B2632]/70 leading-relaxed"
          data-testid="text-value-proposition"
        >
          {bodyText}
        </p>
      </div>
    </section>
  );
}
