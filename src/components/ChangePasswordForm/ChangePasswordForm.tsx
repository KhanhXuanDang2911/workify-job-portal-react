import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import type { ApiError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  changePasswordFormSchema,
  type ChangePasswordFormData,
} from "@/schemas/auth.schema";
import { Link, useLocation } from "react-router-dom";
import { employer_routes, routes } from "@/routes/routes.const";
import type { Role } from "@/constants";
import { authService } from "@/services";
import { useTranslation } from "@/hooks/useTranslation";

interface PasswordRequirement {
  labelKey: string;
  test: (password: string) => boolean;
}

interface ChangePasswordFormProps {
  userType: Role;
  className?: string;
}

export default function ChangePasswordForm({
  userType = "JOB_SEEKER",
  className,
}: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const isEmployer = location.pathname.includes("/employer");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const passwordRequirements: PasswordRequirement[] = [
    {
      labelKey: "changePassword.requirements.minChars",
      test: (pwd) => pwd.length >= 8,
    },
    {
      labelKey: "changePassword.requirements.uppercase",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      labelKey: "changePassword.requirements.lowercase",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      labelKey: "changePassword.requirements.special",
      test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
    {
      labelKey: "changePassword.requirements.number",
      test: (pwd) => /\d/.test(pwd),
    },
  ];

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      if (userType === "JOB_SEEKER") {
        return authService.changePassword(data, "users");
      }
      if (userType === "EMPLOYER") {
        return authService.changePassword(data, "employers");
      }
      return authService.changePassword(data, "admins");
    },
    onSuccess: (response) => {
      toast.success(response.message || t("changePassword.success"));
      reset();
    },
    onError: (error: any) => {
      console.log("Change Password errors: ", error);
      const apiError = error.response?.data as ApiError;

      if (apiError?.status === 411) {
        toast.error(t("changePassword.errors.currentPasswordIncorrect"));
      } else if (apiError?.status === 400 && apiError?.errors) {
        apiError.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(apiError?.message || t("changePassword.errors.failed"));
      }
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmNewPassword");

  const checkRequirement = (requirement: PasswordRequirement) => {
    return requirement.test(newPassword || "");
  };

  const allRequirementsMet = passwordRequirements.every((req) =>
    checkRequirement(req)
  );

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(" space-y-6", className)}
    >
      {/* Old Password */}
      <div className="space-y-2">
        <Label
          htmlFor="oldPassword"
          className="flex items-center gap-2 text-gray-700 font-semibold"
        >
          {t("changePassword.currentPassword")}
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            {...register("currentPassword")}
            className={cn(
              "pr-10 focus-visible:ring-1 focus-visible:border-none  focus-visible:ring-[#1967d2] "
            )}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showCurrentPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-700 font-semibold">
          {t("changePassword.newPassword")}
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword")}
            placeholder={t("changePassword.newPasswordPlaceholder")}
            className={cn(
              "pr-10 focus-visible:ring-1 focus-visible:border-none  focus-visible:ring-[#1967d2]"
            )}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showNewPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}

        {/* Password Requirements */}
        {
          <div className="mt-3 space-y-1">
            <p className="text-sm text-green-700 font-medium">
              {t("changePassword.requirementsTitle")}
            </p>
            <ul className="space-y-1">
              {passwordRequirements.map((requirement, index) => (
                <>
                  <li
                    key={index}
                    className={cn(
                      "text-sm flex items-center gap-2 text-gray-500"
                    )}
                  >
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {t(requirement.labelKey)}
                      {checkRequirement(requirement) && (
                        <Check color="#1967d2" className="w-5 h-5" />
                      )}
                    </p>
                  </li>
                </>
              ))}
            </ul>
          </div>
        }
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-gray-700 font-semibold"
        >
          {t("changePassword.confirmPassword")}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmNewPassword")}
            placeholder={t("changePassword.confirmPasswordPlaceholder")}
            className={cn(
              "pr-10 placeholder:text-gray-300 focus-visible:ring-1 focus-visible:border-none ",
              errors.confirmNewPassword
                ? "border-red-500 focus-visible:ring-red-500"
                : " focus-visible:ring-[#1967d2]"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmNewPassword && (
          <p className="text-sm text-red-500">
            {t("changePassword.errors.passwordMismatch")}
          </p>
        )}
      </div>
      {/* Change Password Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-[#1967d2] hover:bg-[#1557b0] text-white py-6 text-base"
          disabled={
            changePasswordMutation.isPending ||
            !allRequirementsMet ||
            !!errors.confirmNewPassword ||
            !newPassword ||
            !confirmPassword
          }
        >
          {t("changePassword.changePasswordButton")}
        </Button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-center">
        <Link
          to={
            isEmployer
              ? `${employer_routes.BASE}/${employer_routes.FORGOT_PASSWORD}`
              : `${routes.BASE}/${routes.FORGOT_PASSWORD}`
          }
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          {t("changePassword.forgotPassword")}
        </Link>
      </div>
    </form>
  );
}
