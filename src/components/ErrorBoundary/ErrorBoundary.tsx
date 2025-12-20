import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

function ErrorFallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleGoHome = () => {
    if (location.pathname.startsWith("/employer")) {
      navigate("/employer/home");
    } else {
      navigate("/");
    }
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="https://thewebmax.org/react/jobzilla/assets/images/error-404.png"
                alt="Error Illustration"
                className="w-full max-w-md h-auto filter hue-rotate-90"
              />
            </div>
          </div>

          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-none">
                Oops!
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#1967d2] text-balance">
                {t("errorBoundary.title")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0 text-pretty">
                {t("errorBoundary.description")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleReload}
                className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t("errorBoundary.reload")}
              </Button>

              <Button
                variant="outline"
                onClick={handleGoHome}
                className="px-8 py-6 text-lg rounded-lg border-2 border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Home className="w-5 h-5" />
                {t("errorBoundary.goToHome")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback />;
    }
    return this.props.children;
  }
}
