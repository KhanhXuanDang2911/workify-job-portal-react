import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "Minimum characters (8)", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase character", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase character", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  { label: "One number", test: (pwd) => /\d/.test(pwd) },
];

interface ChangePasswordFormProps {
  onPasswordChange?: (oldPassword: string, newPassword: string) => Promise<void> | void;
  onValidateOldPassword: (password: string) => Promise<boolean> | boolean;
  userType?: "employer" | "candidate";
  showForgotPassword?: boolean;
  onForgotPassword?: () => void;
  className?: string;
  passwordRequirements?: PasswordRequirement[];
}

export default function ChangePasswordForm({
  onPasswordChange,
  onValidateOldPassword,
  userType = "employer",
  showForgotPassword = true,
  onForgotPassword,
  className,
  passwordRequirements: customPasswordRequirements = passwordRequirements,
}: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkRequirement = (requirement: PasswordRequirement) => {
    return requirement.test(newPassword);
  };

  const allRequirementsMet = customPasswordRequirements.every((req) => checkRequirement(req));
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = allRequirementsMet && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onValidateOldPassword(oldPassword)) if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      if (onPasswordChange) {
        await onPasswordChange(oldPassword, newPassword);
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(" space-y-6", className)}>
      {/* Old Password */}
      <div className="space-y-2">
        <Label htmlFor="oldPassword" className="flex items-center gap-2 text-gray-700 font-semibold">
          Old Password
        </Label>
        <div className="relative">
          <Input
            id="oldPassword"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={cn("pr-10 focus-visible:ring-1 focus-visible:border-none  focus-visible:ring-[#1967d2] ")}
          />
          <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-700 font-semibold">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={cn(
              "pr-10 focus-visible:ring-1",
              newPassword.length > 0 && !allRequirementsMet ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:border-none  focus-visible:ring-[#1967d2]"
            )}
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Requirements */}
        {
          <div className="mt-3 space-y-1">
            <p className="text-sm text-green-700 font-medium">Please add all necessary characters to create safe password.</p>
            <ul className="space-y-1">
              {customPasswordRequirements.map((requirement, index) => (
                <>
                  <li key={index} className={cn("text-sm flex items-center gap-2 text-gray-500")}>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {requirement.label}
                      {checkRequirement(requirement) && <Check color="#1967d2" className="w-5 h-5" />}
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
        <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="enter your confirm new password"
            className={cn(
              "pr-10 placeholder:text-gray-300 focus-visible:ring-1",
              confirmPassword.length > 0 && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:border-none  focus-visible:ring-[#1967d2]"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && <p className="text-sm text-red-500">Passwords do not match</p>}
      </div>

      {/* Change Password Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full bg-[#1967d2] hover:bg-[#1557b0] text-white py-6 text-base" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </Button>
      </div>

      {/* Forgot Password Link */}
      {showForgotPassword && (
        <div className="text-center">
          <a href="#" onClick={handleForgotPasswordClick} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Forgot Password?
          </a>
        </div>
      )}
    </form>
  );
}
