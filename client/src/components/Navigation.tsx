import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function Navigation({ cartItemCount = 0 }: { cartItemCount?: number }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/free-trial", label: "Free Trial" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-md px-3 py-2 transition-all">
              <div className="text-2xl font-bold text-primary">LegacyScribe</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === link.path ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center" data-testid="text-cart-count">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/free-trial" className="hidden md:block" data-testid="link-cta-trial">
              <Button variant="secondary" data-testid="button-start-trial">
                Start Free Trial
              </Button>
            </Link>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-mobile-${link.label.toLowerCase().replace(" ", "-")}`}>
                <span
                  className={`block px-4 py-2 text-sm font-medium rounded-md hover-elevate transition-colors cursor-pointer ${
                    location === link.path ? "text-primary bg-primary/10" : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/free-trial" data-testid="link-mobile-cta">
              <Button variant="secondary" className="w-full mt-2" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-trial">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
