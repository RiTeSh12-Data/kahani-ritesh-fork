import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

export default function Affiliate() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full bg-[#EEE9DF] border-b border-[#C9C1B1]/30">
          <div className="flex items-center justify-between px-6 py-4 md:px-12">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="min-h-[44px] min-w-[44px]"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <img 
              src={kahaniLogo} 
              alt="Kahani Logo" 
              className="h-12 w-auto object-contain"
            />
            
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={kahaniLogo} 
                alt="Kahani Logo" 
                className="h-24 w-auto object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              AFFILIATE PROGRAM
            </h1>

            {/* Content */}
            <div className="space-y-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">
                Hello! We'd be thrilled to work with you.
              </p>
              
              <p>
                Thank you for considering Kahani's affiliate program. At Kahani, we're passionate about helping people preserve their stories and share the joy of memories, and we'd love for you to join us.
              </p>
              
              <p>
                As an approved partner, you'll earn rewards simply by referring new members to Kahani. If selected to collaborate, a member of our team will reach out to get you started right away.
              </p>
              
              <p className="font-medium text-foreground">
                We're excited to team up with you!
              </p>
              
              <div className="pt-4">
                <p className="text-foreground">
                  Best regards,
                </p>
                <p className="font-semibold text-primary">
                  Vani
                </p>
                <p className="text-primary">
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
