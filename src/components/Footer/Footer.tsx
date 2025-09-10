import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-8">
        <div className="main-layout">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Join our email subscription now to get updates on new jobs and
                notifications.
              </h3>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <Input
                placeholder="Enter Your Email"
                className="bg-white text-gray-900 md:w-80"
              />
              <Button>Subscribe Now</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="main-layout">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="text-xl font-bold">Jobzilla</span>
              </div>
              <p className="text-gray-400 mb-4">
                Many desktop publishing packages and web page editors now.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Address :</span> 65 Sunset CA
                  90026, USA
                </p>
                <p>
                  <span className="font-semibold">Email :</span> example@max.com
                </p>
                <p>
                  <span className="font-semibold">Call :</span> 555-555-1234
                </p>
              </div>
            </div>

            {/* For Candidate */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-400">
                For Candidate
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    User Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Candidates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog List
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog single
                  </a>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-400">
                For Employers
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog Grid
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Jobs Listing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Jobs details
                  </a>
                </li>
              </ul>
            </div>

            {/* Helpful Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-400">
                Helpful Resources
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    404 Page
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-blue-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Employer
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6">
        <div className="main-layout">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              Copyright © 2023 by thewebmax All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
