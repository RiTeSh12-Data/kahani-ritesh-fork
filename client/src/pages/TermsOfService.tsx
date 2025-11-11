import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Kahani – Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Effective Date: December 01, 2025</p>
          
          <p className="text-lg mb-8 text-foreground">
            Welcome to Kahani. By accessing or using our services ("Service"), you agree to comply with and be bound by these Terms of Service ("Terms"). Please read them carefully.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="mb-2 text-muted-foreground">1.1 By using Kahani, you agree to these Terms and any updates or modifications we may make from time to time.</p>
            <p className="mb-4 text-muted-foreground">1.2 If you do not agree with any part of these Terms, you must not use the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Eligibility</h2>
            <p className="mb-2 text-muted-foreground">2.1 You must be at least 13 years old to use Kahani.</p>
            <p className="mb-4 text-muted-foreground">2.2 By using the Service, you represent that you have the legal capacity to enter into these Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Using the Service</h2>
            <p className="mb-2 text-muted-foreground">3.1 Kahani allows users to record, store, and share personal stories via WhatsApp.</p>
            <p className="mb-2 text-muted-foreground">3.2 You are responsible for the content you share. Ensure your stories do not violate any laws, infringe intellectual property rights, or contain harmful material.</p>
            <p className="mb-4 text-muted-foreground">3.3 We reserve the right to remove content that we deem inappropriate or in violation of these Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Accounts</h2>
            <p className="mb-2 text-muted-foreground">4.1 You may be required to provide certain information to access the Service. You agree to provide accurate and up-to-date information.</p>
            <p className="mb-4 text-muted-foreground">4.2 You are responsible for maintaining the confidentiality of your account and any activity that occurs through it.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Privacy</h2>
            <p className="mb-2 text-muted-foreground">5.1 Our Privacy Policy governs how we collect, use, and protect your personal data. By using the Service, you consent to our Privacy Policy.</p>
            <p className="mb-4 text-muted-foreground">5.2 Kahani will not share your stories publicly without your explicit permission.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Intellectual Property</h2>
            <p className="mb-2 text-muted-foreground">6.1 All content, trademarks, and materials provided by Kahani are our property or used with permission.</p>
            <p className="mb-4 text-muted-foreground">6.2 You retain ownership of the stories you submit but grant Kahani a worldwide, royalty-free license to use, display, and store your content for the purpose of providing the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Prohibited Conduct</h2>
            <p className="mb-3 text-foreground">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, threaten, or harm others</li>
              <li>Upload viruses or harmful code</li>
              <li>Attempt to access other users' content without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Limitation of Liability</h2>
            <p className="mb-2 text-muted-foreground">8.1 Kahani is provided "as is." We do not guarantee uninterrupted or error-free service.</p>
            <p className="mb-4 text-muted-foreground">8.2 To the maximum extent permitted by law, Kahani is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Termination</h2>
            <p className="mb-2 text-muted-foreground">9.1 We may suspend or terminate your access if you violate these Terms.</p>
            <p className="mb-4 text-muted-foreground">9.2 You may stop using the Service at any time by deleting your account or discontinuing use.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Changes to Terms</h2>
            <p className="mb-2 text-muted-foreground">10.1 We may modify these Terms at any time. Changes will be effective immediately upon posting on the Service.</p>
            <p className="mb-4 text-muted-foreground">10.2 Continued use of the Service constitutes acceptance of the updated Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Governing Law</h2>
            <p className="mb-2 text-muted-foreground">11.1 These Terms are governed by the laws of the Republic of India.</p>
            <p className="mb-4 text-muted-foreground">11.2 Any disputes arising from these Terms will be resolved exclusively in the courts of Gurugram, Haryana.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Contact</h2>
            <p className="mb-4 text-muted-foreground">
              For questions or concerns about these Terms, please contact us at{" "}
              <a href="mailto:info.kahani.xyz@gmail.com" className="text-primary hover:underline">
                info.kahani.xyz@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
