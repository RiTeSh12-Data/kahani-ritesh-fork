import { Button } from "@/components/ui/button";

interface SectionSixCTAProps {
  onStartTrial?: () => void;
}

export default function SectionSixCTA({
  onStartTrial
}: SectionSixCTAProps) {
  return (
    <section className="w-full bg-[#EEE9DF] px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={onStartTrial}
          className="w-full bg-[#1B2632] text-[#EEE9DF] border-[#1B2632] rounded-2xl font-semibold text-lg shadow-2xl"
          size="lg"
          data-testid="button-start-trial-final"
        >
          Start your free trial now
        </Button>
      </div>
    </section>
  );
}
