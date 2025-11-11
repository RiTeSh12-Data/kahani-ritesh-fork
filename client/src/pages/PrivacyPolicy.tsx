import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Effective Date: December 01, 2025</p>
          
          <p className="text-lg mb-8 text-foreground">
            At Kahani, we value the trust you place in us when sharing your personal information and family stories. This Privacy Policy explains what information we collect, how we use it, and the steps we take to protect your privacy.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">1.1 Personal Information</h3>
            <p className="mb-4 text-muted-foreground">Name, phone number, email address (if provided).</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">1.2 Story Recordings</h3>
            <p className="mb-4 text-muted-foreground">Audio recordings, transcriptions, and any text responses shared via WhatsApp.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">1.3 Interaction Data</h3>
            <p className="mb-4 text-muted-foreground">WhatsApp responses, timestamps, and usage patterns.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">1.4 Sensitive Information</h3>
            <p className="mb-4 text-muted-foreground">We do not collect sensitive information beyond what is required for service delivery.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">2.1 Communication</h3>
            <p className="mb-4 text-muted-foreground">Facilitate communication and send instructions via WhatsApp.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">2.2 Service Delivery</h3>
            <p className="mb-4 text-muted-foreground">Deliver your personalized Kahani Album.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">2.3 Service Improvement</h3>
            <p className="mb-4 text-muted-foreground">Improve our services and provide customer support.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">2.4 Updates</h3>
            <p className="mb-4 text-muted-foreground">Send occasional updates about Kahani or related services (if opted in).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Sharing of Information</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">3.1 Authorized Service Providers</h3>
            <p className="mb-4 text-muted-foreground">Information may be shared with trusted third parties who help store or process your recordings securely.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">3.2 Legal Requirements</h3>
            <p className="mb-4 text-muted-foreground">Information may be shared as required by law or legal process.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">3.3 Confidentiality</h3>
            <p className="mb-4 text-muted-foreground">All third parties are contractually bound to maintain confidentiality and use your data only for the purposes specified by Kahani.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">4.1 Protection Measures</h3>
            <p className="mb-4 text-muted-foreground">We use industry-standard security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">4.2 Access Control</h3>
            <p className="mb-4 text-muted-foreground">Story recordings are stored securely and accessible only to authorized Kahani personnel.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Retention</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">5.1 Retention Period</h3>
            <p className="mb-4 text-muted-foreground">Personal information and story recordings are retained only as long as necessary to provide the service and for legal compliance.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">5.2 Post-Delivery</h3>
            <p className="mb-4 text-muted-foreground">Once your Kahani Album is delivered, recordings may be retained for a reasonable period to allow playback or re-generation of the album, unless you request deletion.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Rights</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">6.1 Access</h3>
            <p className="mb-4 text-muted-foreground">You have the right to access your data and recordings.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">6.2 Correction</h3>
            <p className="mb-4 text-muted-foreground">You can correct any inaccuracies in your personal information.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">6.3 Deletion</h3>
            <p className="mb-4 text-muted-foreground">You can request deletion of your data and story recordings.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">6.4 Opt-Out</h3>
            <p className="mb-4 text-muted-foreground">You can opt-out of promotional communications.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">6.5 Contact</h3>
            <p className="mb-4 text-muted-foreground">To exercise these rights, contact us at info.kahani.xyz@gmail.com.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Children's Privacy</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">7.1 Age Restriction</h3>
            <p className="mb-4 text-muted-foreground">Kahani is not intended for children under 13.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">7.2 Action</h3>
            <p className="mb-4 text-muted-foreground">If you believe we have collected information from a child, please contact us to have it deleted.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Changes to This Policy</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">8.1 Updates</h3>
            <p className="mb-4 text-muted-foreground">This Privacy Policy may be updated occasionally.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">8.2 Notification</h3>
            <p className="mb-4 text-muted-foreground">All changes will be communicated on our website with an updated effective date.</p>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">8.3 Review</h3>
            <p className="mb-4 text-muted-foreground">We encourage you to review the policy periodically.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Contact Us</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">9.1 Queries</h3>
            <p className="mb-4 text-muted-foreground">
              For questions, concerns, or requests related to this Privacy Policy, contact us at:{" "}
              <a href="mailto:info.kahani.xyz@gmail.com" className="text-primary hover:underline">
                info.kahani.xyz@gmail.com
              </a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <p className="text-center text-muted-foreground italic">
              Kahani is committed to respecting your privacy and ensuring your family stories remain safe, secure, and cherished for generations.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
