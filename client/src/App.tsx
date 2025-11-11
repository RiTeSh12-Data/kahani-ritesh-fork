import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimpleHeader from "@/components/SimpleHeader";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import HowItWorksSection from "@/components/HowItWorksSection";
import SectionThreeTestimonials from "@/components/SectionThreeTestimonials";
import SectionFourAlbums from "@/components/SectionFourAlbums";
import SectionFiveFAQs from "@/components/SectionFiveFAQs";
import SectionSixCTA from "@/components/SectionSixCTA";
import { Footer } from "@/components/Footer";
import Checkout from "@/pages/Checkout";
import FreeTrialCheckout from "@/pages/FreeTrialCheckout";
import FreeTrial from "@/pages/FreeTrial";
import HowToUse from "@/pages/HowToUse";
import ThankYou from "@/pages/ThankYou";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Affiliate from "@/pages/Affiliate";
import ContactUs from "@/pages/ContactUs";
import Blogs from "@/pages/Blogs";
import AlbumsGallery from "@/pages/AlbumsGallery";
import VinylGallery from "@/pages/VinylGallery";
import NotFound from "@/pages/not-found";

function HomePage() {
  const [, setLocation] = useLocation();

  const handleRecordClick = () => {
    setLocation("/free-trial-checkout");
  };

  const handleStartTrialClick = () => {
    setLocation("/free-trial-checkout");
  };

  const handleLearnMore = () => {
    setLocation("/how-to-use");
  };

  const handleTryDemo = () => {
    setLocation("/vinyl-gallery");
  };

  return (
    <div className="w-full min-h-screen bg-[#EEE9DF]">
      {/* Simple Header - Sticky at top */}
      <SimpleHeader onRecordClick={handleRecordClick} />

      {/* Hero Section - Full Screen with Button */}
      <HeroSection onStartTrialClick={handleStartTrialClick} />

      {/* Value Proposition with Logo */}
      <ValueProposition />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Section 3 - Testimonials */}
      <SectionThreeTestimonials onLearnMore={handleLearnMore} />

      {/* Section 4 - Albums */}
      <SectionFourAlbums onTryDemo={handleTryDemo} />

      {/* Section 5 - FAQs */}
      <SectionFiveFAQs />

      {/* Section 6 - Final CTA */}
      <SectionSixCTA onStartTrial={handleStartTrialClick} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/free-trial-checkout" component={FreeTrialCheckout} />
          <Route path="/free-trial" component={FreeTrial} />
          <Route path="/how-to-use" component={HowToUse} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/affiliate" component={Affiliate} />
          <Route path="/contact-us" component={ContactUs} />
          <Route path="/blogs" component={Blogs} />
          <Route path="/albums/:trialId" component={AlbumsGallery} />
          <Route path="/vinyl-gallery" component={VinylGallery} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
