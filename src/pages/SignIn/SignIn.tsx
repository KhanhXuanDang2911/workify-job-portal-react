import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Target, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { authUtils } from "@/lib/auth";
import { toast } from "react-toastify";
import type { ApiError } from "@/types";
import { routes } from "@/routes/routes.const";
import { useGoogleLogin } from "@react-oauth/google";
import { signInJobSeeker } from "@/context/auth/auth.action";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";

export default function SignIn() {
  const { dispatch } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: (response) => {
      authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
      authUtils.setUser(response.data.data);

      dispatch(signInJobSeeker({ isAuthenticated: true, user: response.data.data, role: ROLE.JOB_SEEKER }));

      toast.success(`Welcome ${response.data.data.fullName}!`);
      navigate("/", { replace: true });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken && response.data.data) {
        authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        authUtils.setUser(response.data.data);

        dispatch(signInJobSeeker({ isAuthenticated: true, user: response.data.data, role: ROLE.JOB_SEEKER }));

        toast.success(`Welcome ${response.data.data.fullName}!`);
        navigate("/", { replace: true });
      } else if (response.data.createPasswordToken) {
        toast.info("Vui lòng tạo mật khẩu để hoàn tất đăng ký");
        navigate(`/${routes.CREATE_PASSWORD}?token=${response.data.createPasswordToken}`);
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.");
    },
  });

  const linkedInLoginMutation = useMutation({
    mutationFn: authService.linkedInLogin,
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken && response.data.data) {
        authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        authUtils.setUser(response.data.data);

        dispatch(signInJobSeeker({ isAuthenticated: true, user: response.data.data, role: ROLE.JOB_SEEKER }));

        toast.success(`Welcome ${response.data.data.fullName}!`);
        navigate("/", { replace: true });
      } else if (response.data.createPasswordToken) {
        toast.info("Vui lòng tạo mật khẩu để hoàn tất đăng ký");
        navigate(`/${routes.CREATE_PASSWORD}?token=${response.data.createPasswordToken}`, { replace: true });
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Đăng nhập LinkedIn thất bại. Vui lòng thử lại.");
      navigate(`/${routes.SIGN_IN}`, { replace: true });
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    //redirect URI là: http://localhost:5173/?code=AQTaD3kcdttkZ2yVZkBb7fCTP2QDQw75O-jNnaItA6zDgFTb2kSuxTOTOu1TttbUFn_IeKJyDtIuvj54wsgT33JQMBi6oh2v53Nc1oTe0_PUPVJTd1i6ti4k3L_lE85SrjjsV76hBMzXdrV4GgUFt3Ezq3g7JXil4ndHdV6dX5OgJU0VLcVjmSNLiuGjAq5P-8_gxQ7taOFgtCyjcGA&state=0975fad2-b229-4c21-8533-62f55f1225c6
    //không phải http://localhost:5173/sign-in nên ở đây .....
    if (code) {
      console.log("authorization code:", code);
      console.log("state:", state);

      linkedInLoginMutation.mutate(code);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [linkedInLoginMutation]);

  const handleLinkedInLogin = useCallback(() => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI); //VITE_REDIRECT_URI=http://localhost:5173
    const scope = encodeURIComponent("openid profile email");
    const state = crypto.randomUUID();

    sessionStorage.setItem("linkedin_oauth_state", state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = authUrl;
  }, []);

  const onSubmit = (data: { email: string; password: string }) => {
    signInMutation.mutate(data);
  };

  return (
    // remove full-screen forcing here so MainLayout controls page height
    <div className="main-layout">
      <div className="flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-gradient-to-br from-primary-color to-primary-color/80">
          c{/* Animated floating elements */}
          <div className="absolute top-8 right-16 w-20 h-20 bg-second-color/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
          <div className="absolute top-32 right-32 w-16 h-16 bg-white/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }} />
          <div className="absolute bottom-20 left-16 w-24 h-24 bg-second-color/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "2s", animationDuration: "5s" }} />
          {/* Geometric patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-16 left-8 w-12 h-12 border-2 border-white rotate-45 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute top-48 left-24 w-8 h-8 border-2 border-second-color rotate-12 animate-pulse" />
            <div className="absolute bottom-32 left-12 w-16 h-16 border-2 border-white rotate-45 animate-spin" style={{ animationDuration: "15s" }} />
          </div>
          <div className="relative z-10 flex flex-col justify-center px-8 py-12 text-white">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold leading-tight">
                  Build Your
                  <br />
                  <span className="text-second-color">Career</span>
                  <br />
                  <span className="text-white">Success</span>
                </h1>
                <p className="text-lg text-blue-100 font-medium">with JobPortal.vn</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Find Your Dream Job</h3>
                    <p className="text-blue-200 text-xs">Personalized recommendations</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Fast Application</h3>
                    <p className="text-blue-200 text-xs">Apply with one click</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/3 flex items-center justify-center p-4 min-h-0 overflow-auto">
          <div className="w-full max-w-lg space-y-6 animate-fade-in-up delay-300">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-600">Welcome back!</p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={googleLoginMutation.isPending}
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md bg-transparent hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {googleLoginMutation.isPending ? "Signing in..." : "Sign in with Google"}
              </Button>

              <Button
                variant="outline"
                onClick={handleLinkedInLogin}
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md bg-transparent hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Sign in with LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">or</span>
              </div>
            </div>

            {/* Login Form */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="pl-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 "
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        className="pl-10 pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 "
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={signInMutation.isPending}
                    className="w-full h-12 bg-primary-color hover:bg-primary-color/90 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to={`/${routes.SIGN_UP}`} className="text-primary-color hover:text-primary-color/80 font-medium transition-colors hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
