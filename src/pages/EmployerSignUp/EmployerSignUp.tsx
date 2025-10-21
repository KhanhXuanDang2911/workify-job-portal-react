import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Mail, User, Phone, MapPin, Eye, EyeOff, Lock } from "lucide-react";
import AddressSelector from "@/components/AddressSelector";
import { employerSignUpSchema, type EmployerSignUpFormData } from "@/schemas/employer";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { employerService } from "@/services";
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
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.log(error);
    },
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
      toast.success(response.message);

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
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg float-animation"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl float-animation-delayed"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl float-animation-delayed-2"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-[#1967d2] to-blue-600 rounded-2xl shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Registration</h1>
            <p className="text-gray-600 text-base">Create an account to access high-quality candidates and start hiring today</p>
          </div>

          {/* Form Card */}
          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-fade-in-up delay-300">
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="Enter your work email"
                      className={cn(
                        "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 text-sm",
                        errors.email && "border-red-500 "
                      )}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={cn(
                          "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 text-sm",
                          errors.password && "border-red-500 "
                        )}
                        {...register("password")}
                      />
                      <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={cn(
                          "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200text-sm",
                          errors.confirmPassword && "border-red-500 "
                        )}
                        {...register("confirmPassword")}
                      />
                      <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Show Password Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="showPassword" checked={showPassword} onCheckedChange={(checked) => setShowPassword(checked as boolean)} />
                  <Label htmlFor="showPassword" className="text-sm text-gray-600">
                    Show password
                  </Label>
                </div>

                {/* Company Information Section */}
                <div className="border-t pt-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>

                  {/* Company Name */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyName"
                        placeholder="Enter your company name"
                        className={cn(
                          "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 text-sm",
                          errors.companyName && "border-red-500 "
                        )}
                        {...register("companyName")}
                      />
                    </div>
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                  </div>

                  {/* Employee Count */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">
                      Number of Employees
                    </Label>
                    <Controller
                      name="companySize"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // hiển thị giá trị đã chọn
                        >
                          <SelectTrigger className="h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm">
                            <SelectValue placeholder={lang === "vi" ? "Chọn quy mô công ty" : "Select company size"} />
                          </SelectTrigger>

                          <SelectContent>
                            {Object.keys(CompanySize).map((key) => (
                              <SelectItem key={key} value={key} className="text-sm focus:bg-sky-200 focus:text-[#1967d2]">
                                {CompanySizeLabel[lang][key as keyof (typeof CompanySizeLabel)["vi"]]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.companySize && <p className="text-sm text-red-500">{errors.companySize.message}</p>}
                  </div>

                  {/* Contact Person and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">
                        Contact Person
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="contactPerson"
                          placeholder="Full name"
                          className={cn(
                            "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200text-sm",
                            errors.contactPerson && "border-red-500 "
                          )}
                          {...register("contactPerson")}
                        />
                      </div>
                      {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="Phone number"
                          className={cn(
                            "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 text-sm",
                            errors.email && "border-red-500 "
                          )}
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t pt-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>

                  {/* Location Selects */}
                  <div className="mb-4">
                    <AddressSelector
                      provinceId={provinceId}
                      districtId={districtId}
                      onProvinceChange={(id) => {
                        setValue("provinceId", Number(id), { shouldValidate: true });
                        setValue("districtId", 0, { shouldValidate: true });
                      }}
                      onDistrictChange={(id) => {
                        setValue("districtId", Number(id), { shouldValidate: true });
                      }}
                      errors={{
                        provinceId: errors.provinceId?.message,
                        districtId: errors.districtId?.message,
                      }}
                    />
                  </div>

                  {/* Detailed Address */}
                  <div className="space-y-2">
                    <Label htmlFor="detailAddress" className="text-sm font-medium text-gray-700">
                      Detailed Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="detailAddress"
                        placeholder="House number, street, ward"
                        className={cn(
                          "pl-10 h-11 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] transition-all duration-200 text-sm",
                          errors.email && "border-red-500 "
                        )}
                        {...register("detailAddress")}
                      />
                    </div>
                    {errors.detailAddress && <p className="text-sm text-red-500">{errors.detailAddress.message}</p>}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="receiveJobAlerts" checked={receiveJobAlerts} onCheckedChange={(checked) => setValue("receiveJobAlerts", checked as boolean)} className="mt-0.5" />
                    <Label htmlFor="receiveJobAlerts" className="text-sm text-gray-600 leading-relaxed">
                      Receive job alerts and updates
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="acceptTerms" checked={acceptTerms} onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)} className="mt-0.5" />
                    <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed inline-block">
                      I agree to the processing of personal data and agree to the{" "}
                      <a href="#" className="text-[#1967d2] hover:underline font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#1967d2] hover:underline font-medium">
                        Privacy Policy
                      </a>{" "}
                      of CareerLink.
                    </Label>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!acceptTerms || signUpMutation.isPending}
                  className={cn(
                    "w-full h-12 bg-gradient-to-r from-[#1967d2] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 pulse-on-hover",
                    (!acceptTerms || signUpMutation.isPending) && "cursor-not-allowed"
                  )}
                >
                  Register Now
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 animate-fade-in-up delay-1000">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <NavLink to="/employer/sign-in" className="text-[#1967d2] hover:underline font-medium">
                Sign in here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerSignUp;
