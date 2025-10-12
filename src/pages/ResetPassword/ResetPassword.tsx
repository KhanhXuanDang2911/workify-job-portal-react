import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check } from "lucide-react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { resetPasswordSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services"
import { toast } from "react-toastify"
import type { ApiError } from "@/types"
import { routes, employer_routes } from "@/routes/routes.const"
import { cn } from "@/lib/utils"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const pwdRequirements: PasswordRequirement[] = [
  { label: "Password must be at least 8 characters long.", test: (pwd) => pwd.length >= 8 },
  { label: "Password must contain at least one upper case.", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lower case letter.", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "Password must contain at least one number", test: (pwd) => /\d/.test(pwd) },
  { label: "Password must contain at one special character", test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
]

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const token = searchParams.get("token")
  const isEmployer = location.pathname.includes("/employer")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
    }
  }, [token])

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) => {
      if (!token) throw new Error("Token is missing")
      return isEmployer ? authService.resetPassword(token, data.newPassword,"employers") : authService.resetPassword(token, data.newPassword,"users");
    },
    onSuccess: (response) => {
      setIsSuccess(true)
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError

      if (apiError?.status === 401) {
        setIsTokenValid(false)
      } else {
        toast.error(apiError?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.")
      }
    },
  })

  const newPassword = watch("newPassword")

  const checkRequirement = (requirement: PasswordRequirement) => {
    return requirement.test(newPassword || "")
  }

  const allRequirementsMet = pwdRequirements.every((req) => checkRequirement(req))

  const onSubmit = (data: { newPassword: string; confirmPassword: string }) => {
    resetPasswordMutation.mutate({ newPassword: data.newPassword })
  }

  const handleGoToSignIn = () => {
    if (isEmployer) {
      navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`)
    } else {
      navigate(`/${routes.SIGN_IN}`)
    }
  }

  const handleTryAnotherWay = () => {
    if (isEmployer) {
      navigate(`${employer_routes.BASE}/${employer_routes.FORGOT_PASSWORD}`)
    } else {
      navigate(`/${routes.FORGOT_PASSWORD}`)
    }
  }

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-white">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 justify-center">
            <img src="/sad-image.png" alt="" className="w-full" />
          </div>

          {/* Right Side - Error Message */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-5">
              <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Link Expired</h1>
              <p className="text-gray-600">
                Your link has expired, because you haven't used it. Reset password link expires in every 24 hours and can be used only once. You can create one by clicking the
                button below.
              </p>
            </div>

            <Button onClick={handleTryAnotherWay} variant="outline" className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              Try another way
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-white">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 justify-center">
            <img src="/proud-image.png" alt="" className="w-full" />
          </div>
          {/* Right Side - Success Message */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-5">
              <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Your password has been changed successfully!</h1>
              <p className="text-gray-600">You can now sign in with your new password.</p>
            </div>

            <Button onClick={handleGoToSignIn} className="w-full !rounded-3xl h-12 bg-[#1967d2] hover:bg-[#1251a3] text-white font-medium">
              GO TO SIGN IN
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <img src="/proud-image.png" alt="" className="w-full" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-[#1967d2] -mt-10">Change New Password</h1>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            {pwdRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                {checkRequirement(requirement) ? <Check className="w-5 h-5 text-green-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-400 ml-1.5" />}
                <span className={checkRequirement(requirement) ? "text-green-600" : ""}>{requirement.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder=""
                  {...register("newPassword")}
                  className="pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=""
                  {...register("confirmPassword")}
                  className={cn("pr-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]", errors.confirmPassword ? "border-red-500" : "")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending || !allRequirementsMet}
              className="w-full h-12 bg-[#1967d2] hover:bg-[#1251a3] text-white font-medium"
            >
              {resetPasswordMutation.isPending ? "Updating..." : "UPDATE PASSWORD"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate(isEmployer ? `${employer_routes.BASE}/${employer_routes.SIGN_IN}` : `/${routes.SIGN_IN}`)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
