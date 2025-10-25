import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSignInSchema, type AdminSignInFormData } from "@/schemas/admin/admin.signin.schema";

export default function AdminSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AdminSignInFormData>({
    resolver: zodResolver(adminSignInSchema),
  });

  const onSubmit = (data: AdminSignInFormData) => {
    console.log("Admin sign in:", data);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <img src="/logo.png" alt="" className="w-16 h-16" />
          </div>

          {/* Sign In Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  className="pl-12 h-12 border-b border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-gray-900 bg-transparent placeholder:text-gray-400"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...register("password")}
                  className="pl-12 pr-12 h-12 border-b border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-gray-900 bg-transparent placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/admin/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Forgot Password ?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full mt-8 transition-all duration-300">
              Login
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex-col justify-between items-center p-12 relative overflow-hidden">
        {/* Illustration Area */}
        <div className="flex-1 flex items-center justify-center -mt-40">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Placeholder for 3D illustration */}
            <div className="text-center">
              <img src="/admin-illustration-signin.png" alt="" />
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-white mb-5">
          <h2 className="text-4xl font-bold mb-4">
            Sign in to Admin's <span className="text-4xl uppercase text-purple-600">Workify</span> Panel
          </h2>
          <p className="text-lg text-blue-100">Management work is simply</p>
        </div>
      </div>
    </div>
  );
}
