import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Building2,
  Users,
  BarChart3,
} from "lucide-react";

export default function EmployerSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Sign in attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full blur-3xl animate-float-slow-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-200/10 to-teal-300/10 rounded-full blur-2xl animate-float-slow-delayed-2"></div>

        {/* Floating particles */}
        <div
          className="absolute top-[20%] right-[10%] w-4 h-4 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full animate-particle-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-[60%] left-[15%] w-6 h-6 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full animate-particle-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-[30%] left-[80%] w-3 h-3 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-full animate-particle-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-[30%] right-[20%] w-5 h-5 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-full animate-particle-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          <div className="max-w-md text-center animate-fade-in-up">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1967d2] to-[#1557b8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-xl text-gray-600">
                Access your employer dashboard
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1967d2]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Manage Candidates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Review and hire top talent
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Track Performance
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor your job postings
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    Build Your Team
                  </h3>
                  <p className="text-sm text-gray-600">
                    Post jobs and grow your company
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-fade-in-up delay-300">
            {/* Back to Job Seeker Link */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-[#1967d2] transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Job Seeker
              </Link>
            </div>

            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1967d2] to-[#1557b8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Employer Sign In
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Access your employer dashboard to manage jobs and candidates
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2]/20 transition-all duration-300 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1967d2] border-gray-300 rounded focus:ring-[#1967d2]/20"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#1967d2] hover:text-[#1557b8] font-medium transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-[#1967d2] via-[#1557b8] to-[#1445a0] hover:from-[#1557b8] hover:via-[#1445a0] hover:to-[#1334a0] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl animate-gradient-shift"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">
                      or
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an employer account?{" "}
                    <Link
                      to="/employer/sign-up"
                      className="text-[#1967d2] hover:text-[#1557b8] font-semibold transition-colors duration-200"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>

                {/* Job Seeker Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Looking for a job?{" "}
                    <Link
                      to="/sign-in"
                      className="text-[#1967d2] hover:text-[#1557b8] font-medium transition-colors duration-200"
                    >
                      Job Seeker Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
