import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createPasswordSchema,
  type CreatePasswordFormData,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { userTokenUtils } from "@/lib/token";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/context/UserAuth";
import { useTranslation } from "@/hooks/useTranslation";
import PageTitle from "@/components/PageTitle/PageTitle";

interface PasswordRequirement {
  labelKey: string;
  test: (password: string) => boolean;
}

const pwdRequirements: PasswordRequirement[] = [
  {
    labelKey: "auth.createPassword.requirements.length",
    test: (pwd) => pwd.length >= 8 && pwd.length <= 160,
  },
  {
    labelKey: "auth.createPassword.requirements.uppercase",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    labelKey: "auth.createPassword.requirements.lowercase",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    labelKey: "auth.createPassword.requirements.special",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

export default function CreatePassword() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { dispatch } = useUserAuth();

  useEffect(() => {
    if (!token) {
      toast.error(t("auth.createPassword.tokenErrorToast"));
      navigate("/sign-in", { replace: true });
    }
  }, [token, navigate, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
  });

  const createPasswordMutation = useMutation({
    mutationFn: (password: string) =>
      authService.createPassword(token!, password),
    onSuccess: (response) => {
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

      toast.success(
        t("auth.createPassword.welcomeToast", {
          name: response.data.data.fullName,
        })
      );
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error(t("auth.createPassword.errorToast"));
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const checkRequirement = (requirement: PasswordRequirement) => {
    return requirement.test(password || "");
  };

  const allRequirementsMet = pwdRequirements.every((req) =>
    checkRequirement(req)
  );

  const onSubmit = (data: CreatePasswordFormData) => {
    createPasswordMutation.mutate(data.password);
  };

  return (
    <div className="main-layout">
      <PageTitle title={t("pageTitles.createPassword")} />
      <div className="flex min-h-screen">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center ">
          <img
            src="/create-password-Illustration.png"
            alt=""
            className="w-full"
          />
        </div>

        {/* Right Side - Create Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 -mt-6">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-[#1967d2]">
                {t("auth.createPassword.title")}
              </h2>
              <p className="text-gray-600">
                {t("auth.createPassword.subtitle")}
              </p>
            </div>

            <Card className="border border-gray-300">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("auth.createPassword.passwordLabel")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t(
                          "auth.createPassword.passwordPlaceholder"
                        )}
                        {...register("password")}
                        className="pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {t(errors.password.message || "")}
                      </p>
                    )}

                    <div className="mt-3 space-y-2">
                      {pwdRequirements.map((requirement, index) => (
                        <div
                          key={index}
                          className={cn(
                            "text-sm flex items-center gap-2",
                            checkRequirement(requirement)
                              ? "text-green-600"
                              : "text-gray-500"
                          )}
                        >
                          {checkRequirement(requirement) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current ml-1" />
                          )}
                          <span>{t(requirement.labelKey)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      {t("auth.createPassword.confirmPasswordLabel")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t(
                          "auth.createPassword.confirmPasswordPlaceholder"
                        )}
                        {...register("confirmPassword")}
                        className="pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {t(errors.confirmPassword.message || "")}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      createPasswordMutation.isPending ||
                      !allRequirementsMet ||
                      !password ||
                      !confirmPassword
                    }
                    className="w-full h-12 bg-[#1967d2] hover:bg-[#1251a3] text-white font-medium"
                  >
                    {createPasswordMutation.isPending
                      ? t("auth.createPassword.submitting")
                      : t("auth.createPassword.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
