interface CTASectionProps {
  onStartTrialClick?: () => void;
}

export default function CTASection({
  onStartTrialClick
}: CTASectionProps) {
  return (
    <section className="w-full bg-[#EEE9DF] px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Primary CTA - Start Trial Button */}
        <button
          onClick={onStartTrialClick}
          className="w-full bg-[#1B2632] text-[#EEE9DF] py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
          data-testid="button-start-trial"
        >
          start your free trial
        </button>
      </div>
    </section>
  );
}
