import { Link } from "wouter";
import { SiFacebook, SiInstagram } from "react-icons/si";

export function Footer() {
  return (
    <footer className="w-full bg-[#1B2632] text-[#EEE9DF] py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Social Media Icons - Top Right */}
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#EEE9DF]/10 hover:bg-[#FFB162]/20 flex items-center justify-center transition-colors"
              data-testid="link-facebook"
              aria-label="Facebook"
            >
              <SiFacebook className="w-5 h-5 text-[#EEE9DF]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#EEE9DF]/10 hover:bg-[#FFB162]/20 flex items-center justify-center transition-colors"
              data-testid="link-instagram"
              aria-label="Instagram"
            >
              <SiInstagram className="w-5 h-5 text-[#EEE9DF]" />
            </a>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="heading-legal">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy">
                  <span className="text-[#EEE9DF]/80 hover:text-[#FFB162] transition-colors cursor-pointer" data-testid="link-privacy-policy">
                    Privacy policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <span className="text-[#EEE9DF]/80 hover:text-[#FFB162] transition-colors cursor-pointer" data-testid="link-terms-of-service">
                    Terms of Service
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="heading-company">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/affiliate">
                  <span className="text-[#EEE9DF]/80 hover:text-[#FFB162] transition-colors cursor-pointer" data-testid="link-affiliate">
                    Affiliate
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <span className="text-[#EEE9DF]/80 hover:text-[#FFB162] transition-colors cursor-pointer" data-testid="link-contact-us">
                    Contact us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <span className="text-[#EEE9DF]/80 hover:text-[#FFB162] transition-colors cursor-pointer" data-testid="link-blogs">
                    Blogs
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#EEE9DF]/20 text-center">
          <p className="text-[#EEE9DF]/60 text-sm">
            © {new Date().getFullYear()} Kahani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
