interface PromoBannerProps {
  message?: string;
}

export default function PromoBanner({
  message = "Early Black Friday Sale: Save $15 OFF with code EARLYBF15"
}: PromoBannerProps) {
  return (
    <div className="sticky top-0 z-50 w-full bg-[#A8D5BA] text-[#1B2632] text-center py-3 px-4 safe-area-top">
      <p className="text-sm sm:text-base font-medium">
        {message}
      </p>
    </div>
  );
}
