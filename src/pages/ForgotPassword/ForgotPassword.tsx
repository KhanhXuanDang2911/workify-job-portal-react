import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, ArrowRight, AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { toast } from "react-toastify";
import type { ApiError } from "@/types";
import { cn } from "@/lib/utils";

type ResetMethod = "email" | "sms" | null;

export default function ForgotPassword() {
  const [step, setStep] = useState<"select" | "email" | "success">("select");
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod>(null);
  const [email, setEmail] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const location = useLocation();
  const isEmployer = location.pathname.includes("/employer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => {
      return isEmployer ? authService.forgotPassword(email, "employers") : authService.forgotPassword(email, "users");
    },
    onSuccess: (response) => {
      setStep("success");
      setShowResendSuccess(false);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      console.log(apiError);
      if (apiError?.status === 404) {
        setError("email", {
          type: "manual",
          message: "Invalid email. Please enter your registered email",
        });
      } else if (apiError?.status === 411) {
        toast.error("Tài khoản của bạn đã bị khóa");
      } else if (apiError?.status === 429) {
        toast.error("You've reached the resend limit. Please try again later or use another recovery method.");
      } else {
        toast.error(apiError?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    },
  });

  const onSubmit = (data: { email: string }) => {
    setEmail(data.email);
    forgotPasswordMutation.mutate(data.email);
  };

  const handleResend = () => {
    if (resendCount >= 3) {
      toast.error("You've reached the resend limit. Please try again later or use another recovery method.");
      return;
    }

    setResendCount(resendCount + 1);
    setShowResendSuccess(true);
    forgotPasswordMutation.mutate(email);

    setTimeout(() => {
      setShowResendSuccess(false);
    }, 3000);
  };

  const handleContinue = () => {
    if (selectedMethod === "email") {
      setStep("email");
    } else {
      toast.info("SMS reset is not available yet");
    }
  };

  const renderSelectMethod = () => (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <img src="/sad-image.png" alt="" className="w-full" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Forgot Your Password?</h1>
            <p className="text-gray-600 ">Don't worry! Choose how you'd like to reset your password.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod("email")}
              className={cn(
                "w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all hover:border-blue-500 hover:bg-blue-50",
                selectedMethod === "email" ? "border-[#1967d2] bg-blue-50" : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Reset via Email</h3>
                  <p className="text-sm text-gray-500">We'll send a password reset link to your registered email address.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setSelectedMethod("sms")}
              className={cn(
                "w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all hover:border-[#1967d2] hover:bg-blue-50",
                selectedMethod === "sms" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Reset via SMS</h3>
                  <p className="text-sm text-gray-500">We'll send a verification code to your phone number.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {selectedMethod && (
            <Button onClick={handleContinue} className="w-full h-12 bg-[#1967d2] hover:bg-[#1557b0] text-white font-medium rounded-full">
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmailForm = () => (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <img src="/sad-image.png" alt="" className="w-full" />
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Forgot Your Password?</h1>
            <p className="text-gray-600">Provide your account's email for which you want to reset your password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email ID
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="user@gmail.com"
                {...register("email")}
                className={cn("h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]", errors.email ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full h-12 bg-indigo-700 hover:bg-indigo-800 text-white font-medium">
              {forgotPasswordMutation.isPending ? "Sending..." : "Request reset password link"}
            </Button>
          </form>

          <div className="text-center">
            <button onClick={() => setStep("select")} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Try another way
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          {resendCount >= 3 ? <img src="/sad-image.png" alt="" className="w-full" /> : <img src="/relax-image.png" alt="" className="w-full" />}
        </div>
        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Forgot Your Password?</h1>
            {resendCount >= 3 ? (
              <p className="text-red-600"> You’ve reached the resend limit. Please try again later or use another recovery method.</p>
            ) : (
              <p className="text-gray-600">
                {showResendSuccess
                  ? "The email has been resent. You will receive an email with a link to reset your password."
                  : "You will receive an email with a link to reset your password. Please check your inbox."}
              </p>
            )}
          </div>
          {resendCount < 3 && (
            <div className="space-y-3">
              <p className="text-gray-600 font-medium">Can't get email?</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("email")}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] bg-transparent "
                >
                  Change email ID
                </Button>
                <Button onClick={handleResend} disabled={resendCount >= 3} className="flex-1 h-12 bg-[#1967d2] w-28 hover:bg-[#1251a3]">
                  Resend
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button onClick={() => setStep("select")} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Try another way
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {step === "select" && renderSelectMethod()}
      {step === "email" && renderEmailForm()}
      {step === "success" && renderSuccess()}
    </div>
  );
}
