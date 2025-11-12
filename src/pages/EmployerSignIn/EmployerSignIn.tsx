import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { signInSchema, type SignInFormData } from "@/schemas/employer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { employerTokenUtils } from "@/lib/token";
import type { ApiError } from "@/types";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useEmployerAuth } from "@/context/employer-auth";
import { useTranslation } from "@/hooks/useTranslation";

export default function EmployerSignIn() {
  const { t } = useTranslation();
  const { dispatch } = useEmployerAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) => authService.signInEmployer(data),
    onSuccess: (response) => {
      console.log("[Employer Sign In] Login successful, saving tokens...");
      console.log(
        "[Employer Sign In] Access token:",
        response.data.accessToken.substring(0, 20) + "..."
      );

      employerTokenUtils.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      // Verify tokens were saved
      const savedToken = employerTokenUtils.getAccessToken();
      console.log(
        "[Employer Sign In] Token verification after save:",
        savedToken ? "SUCCESS" : "FAILED"
      );

      dispatch({
        type: "SET_EMPLOYER",
        payload: {
          employer: response.data.data,
          isAuthenticated: true,
          isLoading: false,
        },
      });

      toast.success(
        t("auth.welcomeMessage", { name: response.data.data.companyName })
      );

      navigate("/employer/organization", { replace: true });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || t("toast.error.unknownError")
      );
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data);
    reset();
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex">
        {/* Main Content - Centered */}
        <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen overflow-auto">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-[#0A2E5C] font-medium">
                Welcome back!
              </p>
              <h1 className="text-4xl font-bold text-[#0A2E5C]">
                Employer Login
              </h1>
              <p className="text-sm text-gray-500">
                Access to all features. No credit card required.
              </p>
            </div>

            {/* Back to Job Seeker Link */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-[#0A2E5C] transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Job Seeker Portal
              </Link>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Username or Email address{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="work@company.com"
                  {...register("email")}
                  className="h-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="************"
                    {...register("password")}
                    className="h-12 pr-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-[#0A2E5C] border-gray-300 rounded focus:ring-[#0A2E5C]/20"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link
                  to="/employer/forgot-password"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Forgot Password
                </Link>
              </div>

              <Button
                type="submit"
                disabled={signInMutation.isPending}
                className="w-full h-12 bg-[#0A2E5C] hover:bg-[#082040] text-white font-medium transition-all duration-200 rounded-none text-base"
              >
                {signInMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="text-center space-y-2">
              <p className="text-gray-700">
                Don't have an Account?{" "}
                <Link
                  to="/employer/sign-up"
                  className="text-[#0A2E5C] hover:text-[#082040] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-gray-500 text-xs">
                Looking for a job?{" "}
                <Link
                  to="/sign-in"
                  className="text-[#0A2E5C] hover:text-[#082040] font-medium transition-colors"
                >
                  Job Seeker Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative Elements (Hot Air Balloons) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none">
          <div className="relative h-full">
            {/* Large hot air balloon */}
            <div className="absolute top-1/4 right-1/4 w-64 h-80 opacity-20">
              <svg viewBox="0 0 200 240" className="w-full h-full">
                <ellipse cx="100" cy="180" rx="80" ry="40" fill="#1967d2" />
                <path
                  d="M 100 180 L 100 220 L 90 220 L 90 200 L 110 200 L 110 220 L 100 220"
                  fill="#1967d2"
                />
                <ellipse cx="100" cy="100" rx="70" ry="90" fill="#5b8fd7" />
              </svg>
            </div>
            {/* Smaller balloons */}
            <div className="absolute top-1/3 right-1/6 w-32 h-40 opacity-15">
              <svg viewBox="0 0 160 200" className="w-full h-full">
                <ellipse cx="80" cy="150" rx="60" ry="30" fill="#1967d2" />
                <path
                  d="M 80 150 L 80 180 L 75 180 L 75 165 L 85 165 L 85 180 L 80 180"
                  fill="#1967d2"
                />
                <ellipse cx="80" cy="80" rx="50" ry="70" fill="#5b8fd7" />
              </svg>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-40 h-48 opacity-15">
              <svg viewBox="0 0 180 220" className="w-full h-full">
                <ellipse cx="90" cy="170" rx="70" ry="35" fill="#1967d2" />
                <path
                  d="M 90 170 L 90 200 L 85 200 L 85 180 L 95 180 L 95 200 L 90 200"
                  fill="#1967d2"
                />
                <ellipse cx="90" cy="90" rx="60" ry="80" fill="#5b8fd7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
