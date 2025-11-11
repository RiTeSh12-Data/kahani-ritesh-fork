import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={kahaniLogo} 
              alt="Kahani Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Thank You Message */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
              THANK YOU!
            </h1>
            
            <div className="space-y-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              <p>
                We're excited to have you on board! One of our team members will reach out to you shortly to help you get started and make the most of your storytelling journey.
              </p>
              
              <p className="font-medium text-foreground">
                Happy sharing!
              </p>
              
              <p className="text-primary font-semibold">
                Team Kahani
              </p>
            </div>
          </div>

          {/* Return Home Button */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={() => setLocation("/")}
              className="px-8 py-6 text-lg font-semibold min-h-[56px]"
              data-testid="button-home"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
