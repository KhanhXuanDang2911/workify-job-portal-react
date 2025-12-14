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
import { useTranslation } from "@/hooks/useTranslation";

type ResetMethod = "email" | "sms" | null;

export default function ForgotPassword() {
  const { t } = useTranslation();
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
      return isEmployer
        ? authService.forgotPassword(email, "employers")
        : authService.forgotPassword(email, "users");
    },
    onSuccess: () => {
      setStep("success");
      setShowResendSuccess(false);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;

      if (apiError?.status === 404) {
        setError("email", {
          type: "manual",
          message: t("auth.invalidEmail"),
        });
      } else if (apiError?.status === 411) {
        toast.error(t("auth.accountLocked"));
      } else if (apiError?.status === 429) {
        toast.error(t("auth.resendLimitReached"));
      } else {
        toast.error(apiError?.message || t("toast.error.unknownError"));
      }
    },
  });

  const onSubmit = (data: { email: string }) => {
    setEmail(data.email);
    forgotPasswordMutation.mutate(data.email);
  };

  const handleResend = () => {
    if (resendCount >= 3) {
      toast.error(t("auth.resendLimitReached"));
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
      toast.info(t("auth.smsNotAvailable"));
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
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">
              {t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-gray-600 ">{t("auth.dontWorry")}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod("email")}
              className={cn(
                "w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all hover:border-blue-500 hover:bg-blue-50",
                selectedMethod === "email"
                  ? "border-[#1967d2] bg-blue-50"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {t("auth.resetViaEmail")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("auth.resetViaEmailDesc")}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setSelectedMethod("sms")}
              className={cn(
                "w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all hover:border-[#1967d2] hover:bg-blue-50",
                selectedMethod === "sms"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {t("auth.resetViaSMS")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("auth.resetViaSMSDesc")}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {selectedMethod && (
            <Button
              onClick={handleContinue}
              className="w-full h-12 bg-[#1967d2] hover:bg-[#1557b0] text-white font-medium rounded-full"
            >
              {t("auth.continue")}
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
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">
              {t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-gray-600">{t("auth.provideEmail")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("auth.emailID")}
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="user@gmail.com"
                {...register("email")}
                className={cn(
                  "h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]",
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                )}
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full h-12 bg-indigo-700 hover:bg-indigo-800 text-white font-medium"
            >
              {forgotPasswordMutation.isPending
                ? t("auth.sending")
                : t("auth.requestResetLink")}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setStep("select")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t("auth.tryAnotherWay")}
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
          {resendCount >= 3 ? (
            <img src="/sad-image.png" alt="" className="w-full" />
          ) : (
            <img src="/relax-image.png" alt="" className="w-full" />
          )}
        </div>
        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">
              {t("auth.forgotPasswordTitle")}
            </h1>
            {resendCount >= 3 ? (
              <p className="text-red-600">{t("auth.resendLimitReached")}</p>
            ) : (
              <p className="text-gray-600">
                {showResendSuccess
                  ? t("auth.emailResent")
                  : t("auth.checkInbox")}
              </p>
            )}
          </div>
          {resendCount < 3 && (
            <div className="space-y-3">
              <p className="text-gray-600 font-medium">
                {t("auth.cantGetEmail")}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("email")}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] bg-transparent "
                >
                  {t("auth.changeEmailID")}
                </Button>
                <Button
                  onClick={handleResend}
                  disabled={resendCount >= 3}
                  className="flex-1 h-12 bg-[#1967d2] w-28 hover:bg-[#1251a3]"
                >
                  {t("auth.resend")}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setStep("select")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t("auth.tryAnotherWay")}
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
