import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Zap, Target } from "lucide-react";
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

export default function SignUp() {
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
    <div className="main-layout">
      <div className="flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-gradient-to-br from-primary-color to-primary-color/80">
          <div className="absolute top-8 right-16 w-24 h-24 bg-second-color/30 rounded-full blur-xl animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
          <div className="absolute bottom-20 left-16 w-32 h-32 bg-second-color/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: "2s", animationDuration: "5s" }} />

          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-16 left-8 w-12 h-12 border-2 border-white rotate-45 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute bottom-32 left-12 w-16 h-16 border-2 border-white rotate-45 animate-spin" style={{ animationDuration: "15s" }} />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-8 py-8 text-white">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold leading-tight">
                  Start Your
                  <br />
                  <span className="text-second-color">Journey</span>
                  <br />
                  <span className="text-white">Today</span>
                </h1>
                <p className="text-lg text-blue-100 font-medium">Join Workify.vn Community</p>
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
                    <h3 className="font-semibold text-sm">Fast Application Process</h3>
                    <p className="text-blue-200 text-xs">Apply with one click</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-2/3 flex items-start justify-center p-4 min-h-0 overflow-auto">
          <div className="w-full max-w-xl space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Job Seeker Registration</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md bg-transparent hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md bg-transparent hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500">or</span>
                <span className="px-2 bg-transparent text-gray-500">or</span>
              </div>
            </div>

            {/* Registration Form */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        {...register("fullName")}
                        className="pl-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    <p className="text-xs text-gray-500">Use your real name. Employers may see your name when viewing your profile.</p>
                  </div>

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
                        className="pl-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...register("password")}
                          className="pl-10 pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...register("confirmPassword")}
                          className="pl-10 pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)} className="mt-1" />
                      <Label htmlFor="terms" className="text-sm text-gray-600 block leading-relaxed">
                        I agree to the processing and provision of personal data that I have read and agree to the{" "}
                        <Link to="/terms" className="text-primary-color hover:text-primary-color/80 hover:underline font-medium">
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary-color hover:text-primary-color/80 hover:underline font-medium">
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
                    className="w-full h-12 bg-primary-color hover:bg-primary-color/90 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                  >
                    Create Job Seeker Account
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="text-center">
              <p className="text-gray-600 mt-2">
                Already have an account?
                <Link to={`/${routes.SIGN_IN}`} className="text-primary-color hover:text-primary-color/80 font-medium transition-colors hover:underline">
                  {" "}
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
