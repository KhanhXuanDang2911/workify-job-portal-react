import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
function ErrorFallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    // Nếu đang ở employer thì về employer/home, ngược lại về /
    if (location.pathname.startsWith("/employer")) {
      navigate("/employer/home");
    } else {
      navigate("/");
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/15 via-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Main content card */}
      <div className="relative flex flex-col items-center gap-8 p-8 sm:p-12 bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl max-w-lg w-full text-center animate-in fade-in-0 zoom-in-95 duration-700">
        {/* Icon with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-6 rounded-full shadow-xl">
            <AlertTriangle className="w-12 h-12 text-white animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -left-1">
            <Zap
              className="w-4 h-4 text-orange-400 animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Oops! Có lỗi xảy ra
          </h1>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            Đừng lo lắng, đây chỉ là lỗi tạm thời. Chúng tôi đang khắc phục vấn
            đề này.
          </p>
          <p className="text-sm text-gray-500">
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleReload}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
            <span className="relative z-10">Tải lại trang</span>
          </button>

          <button
            onClick={handleGoHome}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Về trang chủ</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </div>

        {/* Error code badge */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-full border border-gray-200/50 backdrop-blur-sm">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <span className="font-mono text-gray-600">
            Mã lỗi: ERR_{Date.now().toString().slice(-6)}
          </span>
          <div
            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback />;
    }
    return this.props.children;
  }
}
