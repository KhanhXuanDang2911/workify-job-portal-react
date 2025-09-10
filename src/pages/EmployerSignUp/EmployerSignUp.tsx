import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const EmployerSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    employeeCount: "",
    contactPerson: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    acceptTerms: false,
    receiveJobAlerts: false,
  });

  const employeeCounts = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg float-animation"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl float-animation-delayed"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl float-animation-delayed-2"></div>

        {/* Animated Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              backgroundColor: `rgba(25, 103, 210, ${
                0.1 + Math.random() * 0.3
              })`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231967d2' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employer Registration
            </h1>
            <p className="text-gray-600 text-base">
              Create an account to access high-quality candidates and start
              hiring today
            </p>
          </div>

          {/* Form Card */}
          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-fade-in-up delay-300">
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your work email"
                      className="pl-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Show Password Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showPassword"
                    checked={showPassword}
                    onCheckedChange={(checked) =>
                      setShowPassword(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="showPassword"
                    className="text-sm text-gray-600"
                  >
                    Show password
                  </Label>
                </div>

                {/* Company Information Section */}
                <div className="border-t pt-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                  </h3>

                  {/* Company Name */}
                  <div className="space-y-2 mb-4">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyName"
                        placeholder="Enter your company name"
                        className="pl-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Employee Count */}
                  <div className="space-y-2 mb-4">
                    <Label
                      htmlFor="employeeCount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Number of Employees
                    </Label>
                    <Select
                      value={formData.employeeCount}
                      onValueChange={(value) =>
                        handleInputChange("employeeCount", value)
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeCounts.map((count) => (
                          <SelectItem
                            key={count}
                            value={count}
                            className="text-sm"
                          >
                            {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Person and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="contactPerson"
                        className="text-sm font-medium text-gray-700"
                      >
                        Contact Person
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="contactPerson"
                          placeholder="Full name"
                          className="pl-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            handleInputChange("contactPerson", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="Phone number"
                          className="pl-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t pt-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Address
                  </h3>

                  {/* Location Selects */}
                  <div className="mb-4">
                    <AddressSelector
                      province={formData.province}
                      district={formData.district}
                      ward={formData.ward}
                      onProvinceChange={(value) => {
                        handleInputChange("province", value);
                        handleInputChange("district", "");
                        handleInputChange("ward", "");
                      }}
                      onDistrictChange={(value) => {
                        handleInputChange("district", value);
                        handleInputChange("ward", "");
                      }}
                      onWardChange={(value) => handleInputChange("ward", value)}
                    />
                  </div>

                  {/* Detailed Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="detailAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Detailed Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="detailAddress"
                        placeholder="House number, street, ward"
                        className="pl-10 h-11 border-gray-200 focus:border-[#1967d2] focus:ring-[#1967d2] text-sm"
                        value={formData.detailAddress}
                        onChange={(e) =>
                          handleInputChange("detailAddress", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="receiveJobAlerts"
                      checked={formData.receiveJobAlerts}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "receiveJobAlerts",
                          checked as boolean
                        )
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="receiveJobAlerts"
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      Receive job alerts and updates
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("acceptTerms", checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-600 leading-relaxed inline-block"
                    >
                      I agree to the processing of personal data and agree to
                      the{" "}
                      <a
                        href="#"
                        className="text-[#1967d2] hover:underline font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#1967d2] hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>{" "}
                      of CareerLink.
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#1967d2] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 pulse-on-hover"
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
              <a
                href="/signin"
                className="text-[#1967d2] hover:underline font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignUp;
