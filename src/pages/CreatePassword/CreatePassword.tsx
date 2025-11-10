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
import { useUserAuth } from "@/context/user-auth";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const pwdRequirements: PasswordRequirement[] = [
  {
    label: "Password must be at least 8 characters long.",
    test: (pwd) => pwd.length >= 8 && pwd.length <= 160,
  },
  {
    label: "Password must contain at least one upper case letter.",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "Password must contain at least one lower case letter.",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "Password must contain at least one special character.",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

export default function CreatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { dispatch } = useUserAuth();

  useEffect(() => {
    if (!token) {
      toast.error("Đã xãy ra lỗi. Vui lòng thử lại.");
      navigate("/sign-in", { replace: true });
    }
  }, [token, navigate]);

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

      toast.success(`Welcome ${response.data.data.fullName}!`);
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Tạo mật khẩu thất bại. Vui lòng thử lại.");
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
                Create Password
              </h2>
              <p className="text-gray-600">
                Set up a secure password for your account
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
                      Enter new password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                        {errors.password.message}
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
                          <span>{requirement.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
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
                        {errors.confirmPassword.message}
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
                      ? "Creating..."
                      : "Create Password"}
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
