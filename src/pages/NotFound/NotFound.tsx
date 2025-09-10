import { Button } from "@/components/ui/button";
import { routes, employer_routes } from "@/routes/routes.const";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const isEmployer = location.pathname.startsWith("/employer");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="https://thewebmax.org/react/jobzilla/assets/images/error-404.png"
                alt="404 Error Illustration"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>

          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-8xl lg:text-9xl font-bold text-gray-900 leading-none">
                404
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#1967d2] text-balance">
                We Are Sorry, Page Not Found
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0 text-pretty">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
            </div>

            <div className="pt-4">
              <Button
                asChild
                className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3 text-lg rounded-lg"
              >
                <Link to={isEmployer ? employer_routes.BASE : routes.BASE}>
                  Go To Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
