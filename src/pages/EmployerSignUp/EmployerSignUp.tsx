import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import AddressSelector from "@/components/AddressSelector";
import {
  employerSignUpSchema,
  type EmployerSignUpFormData,
} from "@/schemas/employer";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { employerService } from "@/services";
import { useTranslation } from "@/hooks/useTranslation";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CompanySize, CompanySizeLabel } from "@/constants";
import { employer_routes } from "@/routes/routes.const";

const initialEmployerSignUpFormData: EmployerSignUpFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  companySize: "",
  contactPerson: "",
  phone: "",
  provinceId: 0,
  districtId: 0,
  detailAddress: "",
  acceptTerms: false,
  receiveJobAlerts: false,
};

const lang: "vi" | "en" = "vi";

function EmployerSignUp() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<EmployerSignUpFormData>({
    resolver: zodResolver(employerSignUpSchema),
    defaultValues: initialEmployerSignUpFormData,
  });

  const signUpMutation = useMutation({
    mutationFn: employerService.signUp,
    onSuccess: () => {},
    onError: () => {},
  });

  const provinceId = watch("provinceId");
  const districtId = watch("districtId");
  const acceptTerms = watch("acceptTerms");
  const receiveJobAlerts = watch("receiveJobAlerts");

  const onSubmit = async (data: EmployerSignUpFormData) => {
    try {
      const response = await signUpMutation.mutateAsync({
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companySize: data.companySize,
        contactPerson: data.contactPerson,
        phoneNumber: data.phone,
        provinceId: data.provinceId,
        districtId: data.districtId,
        detailAddress: data.detailAddress,
      });
      toast.success(t("toast.success.signUpSuccess"));

      setTimeout(() => {
        navigate(`${employer_routes.BASE}/${employer_routes.SIGN_IN}`);
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.message;

      if (axiosError.response?.data?.errors) {
        axiosError.response.data.errors.forEach((err) => {
          toast.error(`${err.fieldName}: ${err.message}`);
        });
      } else {
        toast.error(errorMessage || t("toast.error.signUpFailed"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10 min-h-screen flex">
        {/* Main Content - Centered */}
        <div className="w-full flex items-start justify-center p-4 sm:p-6 lg:p-8 py-8 overflow-y-auto">
          <div className="w-full max-w-3xl space-y-6 my-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <p className="text-sm text-[#0A2E5C] font-medium">Get started!</p>
              <h1 className="text-4xl font-bold text-[#0A2E5C]">
                Employer Sign Up
              </h1>
              <p className="text-sm text-gray-500">
                Access to all features. No credit card required.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Information Section */}
              <div className="space-y-5 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#0A2E5C] rounded-full"></div>
                  Account Information
                </h3>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="work@company.com"
                      className={cn(
                        "pl-12 pr-4 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                        errors.email &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={cn(
                          "pl-12 pr-12 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                          errors.password &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={cn(
                          "pl-12 pr-12 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                          errors.confirmPassword &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Show Password Checkbox */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="showPassword"
                    checked={showPassword}
                    onCheckedChange={(checked) =>
                      setShowPassword(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="showPassword"
                    className="text-sm text-gray-600 font-medium cursor-pointer"
                  >
                    Show password
                  </Label>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="space-y-5 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#0A2E5C] rounded-full"></div>
                  Company Information
                </h3>

                {/* Company Name and Employee Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="companyName"
                        placeholder="Enter your company name"
                        className={cn(
                          "pl-12 pr-4 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                          errors.companyName &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        {...register("companyName")}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="employeeCount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Number of Employees{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="companySize"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="!h-12 w-full bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 rounded-none text-sm">
                            <SelectValue
                              placeholder={
                                lang === "vi"
                                  ? "Chọn quy mô công ty"
                                  : "Select company size"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(CompanySize).map((key) => (
                              <SelectItem
                                key={key}
                                value={key}
                                className="text-sm focus:bg-blue-50 focus:text-[#0A2E5C]"
                              >
                                {
                                  CompanySizeLabel[lang][
                                    key as keyof (typeof CompanySizeLabel)["vi"]
                                  ]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.companySize && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.companySize.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Person and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contactPerson"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact Person <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="contactPerson"
                        placeholder="Full name"
                        className={cn(
                          "pl-12 pr-4 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                          errors.contactPerson &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        {...register("contactPerson")}
                      />
                    </div>
                    {errors.contactPerson && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.contactPerson.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="Phone number"
                        className={cn(
                          "pl-12 pr-4 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                          errors.phone &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600 font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-5 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#0A2E5C] rounded-full"></div>
                  Address Information
                </h3>

                {/* Location Selects */}
                <div className="mb-4">
                  <AddressSelector
                    provinceId={provinceId}
                    districtId={districtId}
                    onProvinceChange={(id) => {
                      setValue("provinceId", Number(id), {
                        shouldValidate: true,
                      });
                      setValue("districtId", 0, { shouldValidate: true });
                    }}
                    onDistrictChange={(id) => {
                      setValue("districtId", Number(id), {
                        shouldValidate: true,
                      });
                    }}
                    errors={{
                      provinceId: errors.provinceId?.message,
                      districtId: errors.districtId?.message,
                    }}
                  />
                </div>

                {/* Detailed Address */}
                <div className="space-y-2">
                  <Label
                    htmlFor="detailAddress"
                    className="text-sm font-medium text-gray-700"
                  >
                    Detailed Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="detailAddress"
                      placeholder="House number, street, ward"
                      className={cn(
                        "pl-12 pr-4 h-12 bg-white border border-gray-300 focus:border-[#0A2E5C] focus:ring-1 focus:ring-[#0A2E5C]/20 transition-all duration-200 rounded-none text-sm",
                        errors.detailAddress &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      {...register("detailAddress")}
                    />
                  </div>
                  {errors.detailAddress && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.detailAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="receiveJobAlerts"
                    checked={receiveJobAlerts}
                    onCheckedChange={(checked) =>
                      setValue("receiveJobAlerts", checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="receiveJobAlerts"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    Receive job alerts and updates
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setValue("acceptTerms", checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    I agree to the processing of personal data and agree to the{" "}
                    <a
                      href="#"
                      className="text-[#0A2E5C] hover:text-[#082040] hover:underline font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[#0A2E5C] hover:text-[#082040] hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>{" "}
                    of Workify.
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-xs text-red-500">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!acceptTerms || signUpMutation.isPending}
                className={cn(
                  "w-full h-12 bg-[#0A2E5C] hover:bg-[#082040] text-white font-medium text-base rounded-none transition-all duration-200 mt-4",
                  (!acceptTerms || signUpMutation.isPending) &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                {signUpMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-700">
                Already have an account?{" "}
                <NavLink
                  to="/employer/sign-in"
                  className="text-[#0A2E5C] hover:text-[#082040] font-medium transition-colors"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative Elements (Hot Air Balloons) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none">
          <div className="relative h-full">
            {/* Large hot air balloon */}
            <div className="absolute top-1/4 right-1/4 w-64 h-80 opacity-20">
              <svg viewBox="0 0 200 240" className="w-full h-full">
                <ellipse cx="100" cy="180" rx="80" ry="40" fill="#1967d2" />
                <path
                  d="M 100 180 L 100 220 L 90 220 L 90 200 L 110 200 L 110 220 L 100 220"
                  fill="#1967d2"
                />
                <ellipse cx="100" cy="100" rx="70" ry="90" fill="#5b8fd7" />
              </svg>
            </div>
            {/* Smaller balloons */}
            <div className="absolute top-1/3 right-1/6 w-32 h-40 opacity-15">
              <svg viewBox="0 0 160 200" className="w-full h-full">
                <ellipse cx="80" cy="150" rx="60" ry="30" fill="#1967d2" />
                <path
                  d="M 80 150 L 80 180 L 75 180 L 75 165 L 85 165 L 85 180 L 80 180"
                  fill="#1967d2"
                />
                <ellipse cx="80" cy="80" rx="50" ry="70" fill="#5b8fd7" />
              </svg>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-40 h-48 opacity-15">
              <svg viewBox="0 0 180 220" className="w-full h-full">
                <ellipse cx="90" cy="170" rx="70" ry="35" fill="#1967d2" />
                <path
                  d="M 90 170 L 90 200 L 85 200 L 85 180 L 95 180 L 95 200 L 90 200"
                  fill="#1967d2"
                />
                <ellipse cx="90" cy="90" rx="60" ry="80" fill="#5b8fd7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerSignUp;
