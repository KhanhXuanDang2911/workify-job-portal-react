import React from "react";
import { AlertTriangle, RefreshCw, Home, Sparkles } from "lucide-react";
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex flex-col items-center gap-8 p-10 bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl max-w-md text-center animate-in fade-in-0 zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-red-400 rounded-full blur-lg opacity-30 animate-pulse delay-300"></div>
          <div className="relative bg-gradient-to-r from-orange-400 to-red-500 p-5 rounded-full shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
            Oops! Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Đừng lo lắng, đây chỉ là lỗi tạm thời. Chúng tôi đang khắc phục vấn
            đề này.
          </p>
          <p className="text-sm text-gray-500">
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleReload}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl transform active:scale-95"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Tải lại trang
          </button>

          <button
            onClick={handleGoHome}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border-2 border-gray-200 hover:border-gray-300 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Về trang chủ
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-4 px-4 py-2 bg-gray-50/50 rounded-full border border-gray-200/50">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <span className="font-mono">
            Mã lỗi: ERR_BOUNDARY_{Date.now().toString().slice(-4)}
          </span>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500"></div>
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
