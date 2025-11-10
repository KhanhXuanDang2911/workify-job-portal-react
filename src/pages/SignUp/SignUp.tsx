import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/schemas/auth.schema";
import { toast } from "react-toastify";
import { routes } from "@/routes/routes.const";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserAuth } from "@/context/user-auth";
import { userTokenUtils } from "@/lib/token";

export default function SignUp() {
  const { dispatch } = useUserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string; password: string }) => authService.signUp(data),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.log(error);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (response) => {
      if (
        response.data.accessToken &&
        response.data.refreshToken &&
        response.data.data
      ) {
        userTokenUtils.setTokens(
          response.data.accessToken,
          response.data.refreshToken
        );

        dispatch({
          type: "SET_USER",
          payload: {
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          },
        });

        toast.success(`Welcome ${response.data.data.fullName}!`);
        navigate("/", { replace: true });
      } else if (response.data.createPasswordToken) {
        toast.info("Vui lòng tạo mật khẩu để hoàn tất đăng ký");
        navigate(
          `/${routes.CREATE_PASSWORD}?token=${response.data.createPasswordToken}`
        );
      }
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse.code);
      googleLoginMutation.mutate(codeResponse.code);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Đăng nhập Google thất bại");
    },
    flow: "auth-code",
  });

  const handleLinkedInLogin = useCallback(() => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_LINKEDIN_REDIRECT_URI || "http://localhost:5173/linkedin/authenticate");
    const scope = encodeURIComponent("openid profile email");
    const state = crypto.randomUUID();

    sessionStorage.setItem("linkedin_oauth_state", state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = authUrl;
  }, []);

  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signUpMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      toast.success(response.message);

      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message;

      if (axiosError.response?.data?.errors) {
        axiosError.response.data.errors.forEach((err) => {
          toast.error(`${err.fieldName}: ${err.message}`);
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex">
        {/* Main Content - Centered */}
        <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen overflow-auto">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-[#0A2E5C] font-medium">Get started!</p>
              <h1 className="text-4xl font-bold text-[#0A2E5C]">Member Sign Up</h1>
              <p className="text-sm text-gray-500">Access to all features. No credit card required.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={googleLoginMutation.isPending}
                className="w-full h-12 text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-white"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {googleLoginMutation.isPending
                  ? "Signing up..."
                  : "Sign up with Google"}
              </Button>

              <Button
                variant="outline"
                onClick={handleLinkedInLogin}
                className="w-full h-12 text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-white"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#0077B5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Sign up with LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                  className="h-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password")}
                      className="h-12 pr-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      {...register("confirmPassword")}
                      className="h-12 pr-12 bg-white border border-gray-300 focus-visible:border-[#0A2E5C] focus-visible:ring-1 focus-visible:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setValue("agreeToTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#1967d2] border-gray-300 rounded focus:ring-[#1967d2]/20"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 block leading-relaxed cursor-pointer">
                    I agree to the processing and provision of personal data that I have read and agree to the{" "}
                    <Link to="/terms" className="text-[#1967d2] hover:text-[#1557b8] hover:underline font-medium">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-[#1967d2] hover:text-[#1557b8] hover:underline font-medium">
                      Privacy Policy
                    </Link>{" "}
                    of Workify.
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={!agreeToTerms || signUpMutation.isPending}
                className="w-full h-12 bg-[#0A2E5C] hover:bg-[#082040] text-white font-medium transition-all duration-200 rounded-none disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-700">
                Already have an account?{" "}
                <Link to={`/${routes.SIGN_IN}`} className="text-[#0A2E5C] hover:text-[#082040] font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative Elements (Hot Air Balloons) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none">
          <div className="relative h-full">
            {/* Large hot air balloon */}
            <div 
              className="absolute top-1/4 right-1/4 w-64 h-80 opacity-20"
              style={{
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <svg viewBox="0 0 200 240" className="w-full h-full">
                <ellipse cx="100" cy="180" rx="80" ry="40" fill="#8B9CE8" />
                <path d="M 100 180 L 100 220 L 90 220 L 90 200 L 110 200 L 110 220 L 100 220" fill="#8B9CE8" />
                <ellipse cx="100" cy="100" rx="70" ry="90" fill="#8B9CE8" />
              </svg>
            </div>
            {/* Smaller balloons */}
            <div 
              className="absolute top-1/3 right-1/6 w-32 h-40 opacity-15"
              style={{
                animation: 'float 8s ease-in-out infinite 1s'
              }}
            >
              <svg viewBox="0 0 160 200" className="w-full h-full">
                <ellipse cx="80" cy="150" rx="60" ry="30" fill="#8B9CE8" />
                <path d="M 80 150 L 80 180 L 75 180 L 75 165 L 85 165 L 85 180 L 80 180" fill="#8B9CE8" />
                <ellipse cx="80" cy="80" rx="50" ry="70" fill="#8B9CE8" />
              </svg>
            </div>
            <div 
              className="absolute bottom-1/4 right-1/3 w-40 h-48 opacity-15"
              style={{
                animation: 'float 7s ease-in-out infinite 0.5s'
              }}
            >
              <svg viewBox="0 0 180 220" className="w-full h-full">
                <ellipse cx="90" cy="170" rx="70" ry="35" fill="#8B9CE8" />
                <path d="M 90 170 L 90 200 L 85 200 L 85 180 L 95 180 L 95 200 L 90 200" fill="#8B9CE8" />
                <ellipse cx="90" cy="90" rx="60" ry="80" fill="#8B9CE8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
