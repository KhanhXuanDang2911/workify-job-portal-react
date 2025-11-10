import { Link } from "react-router-dom";
import { routes, employer_routes } from "@/routes/routes.const";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="main-layout py-12">
        {/* Main Content - 6 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Column 1: Company Info & Social Media */}
          <div className="space-y-4">
            <Link to={routes.BASE} className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold text-[#0A2E5C]">
                Workify
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Workify is the heart of the design community and the best resource to discover and connect with designers and jobs worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[#0A2E5C] flex items-center justify-center text-white hover:bg-[#082040] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0A2E5C] flex items-center justify-center text-white hover:bg-[#082040] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0A2E5C] flex items-center justify-center text-white hover:bg-[#082040] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-bold text-[#0A2E5C] mb-4 text-sm">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h4 className="font-bold text-[#0A2E5C] mb-4 text-sm">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Feature
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Credit
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick links */}
          <div>
            <h4 className="font-bold text-[#0A2E5C] mb-4 text-sm">Quick links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  iOS
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Android
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Microsoft
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Desktop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: More */}
          <div>
            <h4 className="font-bold text-[#0A2E5C] mb-4 text-sm">More</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Download App */}
          <div>
            <h4 className="font-bold text-[#0A2E5C] mb-4 text-sm">Download App</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Download our Apps and get extra 15% Discount on your first Order...!
            </p>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 bg-[#0A2E5C] text-white px-4 py-2 rounded-lg hover:bg-[#082040] transition-colors text-xs font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.21-.5-3.3 0-1.44.66-2.2.61-3.08-.4C4.79 15.25 3.8 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Download on the App Store
              </a>
              <a href="#" className="flex items-center justify-center gap-2 bg-[#0A2E5C] text-white px-4 py-2 rounded-lg hover:bg-[#082040] transition-colors text-xs font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                GET IT ON Google Play
              </a>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()}. Workify all right reserved
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-[#0A2E5C] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#0A2E5C] transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-500 hover:text-[#0A2E5C] transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
