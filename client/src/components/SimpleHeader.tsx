import { Link, useLocation } from "wouter";
import { BookOpen, Home } from "lucide-react";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";

interface SimpleHeaderProps {
  logoSrc?: string;
  onRecordClick?: () => void;
}

export default function SimpleHeader({
  logoSrc = kahaniLogo,
  onRecordClick,
}: SimpleHeaderProps) {
  const [, setLocation] = useLocation();

  const handleRecordClick = () => {
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EEE9DF] border-b border-[#C9C1B1]/30">
      <div className="flex items-center justify-between px-6 py-4 md:px-12 gap-4">
        {/* Logo */}
        <img
          src={logoSrc}
          alt="Kahani Logo"
          className="h-12 w-auto object-contain"
        />

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          {/* View Demo Button */}

          {/* <Link href="/book-demo" data-testid="link-header-demo">
            <button
              className="flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 rounded-md transition-colors min-h-[44px]"
              data-testid="button-header-demo"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">View Demo</span>
            </button>
          </Link> */}

          {/* Home Button */}
          <button
            onClick={handleRecordClick}
            className="btn-gradient-soft px-5 py-2.5 font-medium text-sm shadow-md min-h-[44px] min-w-[44px] flex items-center gap-2"
            data-testid="button-record"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>
    </header>
  );
}
