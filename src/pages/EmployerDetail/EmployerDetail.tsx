import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  PhoneCall,
  Mail,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Youtube,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employerService } from "@/services/employer.service";
import { CompanySizeLabelVN } from "@/constants/company.constant";

export default function EmployerDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch employer data
  const {
    data: employerResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employer", id],
    queryFn: () => employerService.getEmployerById(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
    staleTime: 5 * 60 * 1000,
  });

  const employer = employerResponse?.data;

  // Build full address
  const buildFullAddress = () => {
    if (!employer) return "";
    const parts = [
      employer.detailAddress,
      employer.district?.name,
      employer.province?.name,
    ].filter(Boolean);
    return parts.join(", ") || "Chưa cập nhật";
  };

  // Build Google Maps URL for iframe
  const buildGoogleMapsUrl = () => {
    const address = buildFullAddress();
    if (!address || address === "Chưa cập nhật") {
      return "https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Vietnam&t=&z=6&ie=UTF8&iwloc=B&output=embed";
    }
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
  };

  // Get company size label
  const getCompanySizeLabel = () => {
    if (!employer?.companySize) return "Chưa cập nhật";
    return CompanySizeLabelVN[employer.companySize as keyof typeof CompanySizeLabelVN] || employer.companySize;
  };

  // Parse websiteUrls (can be array or string)
  const getWebsiteUrls = () => {
    if (!employer?.websiteUrls) return [];
    if (Array.isArray(employer.websiteUrls)) return employer.websiteUrls;
    try {
      const parsed = JSON.parse(employer.websiteUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin nhà tuyển dụng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !employer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error
              ? "Không thể tải thông tin nhà tuyển dụng. Vui lòng thử lại sau."
              : "Không tìm thấy nhà tuyển dụng."}
          </p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-45 animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-35 animate-breathe"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-purple-100 to-transparent opacity-50"></div>

        <div className="container mx-auto px-4 py-6 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Company Image and Info */}
            <div className="lg:col-span-2">
              <div className="relative h-80 rounded-lg overflow-hidden mb-6">
                <img
                  src={
                    employer.backgroundUrl ||
                    "https://thewebmax.org/react/jobzilla/assets/images/employer-bg.jpg"
                  }
                  alt={`${employer.companyName} background`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://thewebmax.org/react/jobzilla/assets/images/employer-bg.jpg";
                  }}
                />

                {/* Company logo positioned at bottom left */}
                <div className="absolute bottom-6 left-6">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg border overflow-hidden">
                    {employer.avatarUrl ? (
                      <img
                        src={employer.avatarUrl}
                        alt={employer.companyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg";
                        }}
                      />
                    ) : (
                    <img
                      src="https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg"
                        alt={employer.companyName}
                    />
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons positioned below the image */}
              

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {employer.companyName}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{buildFullAddress()}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{getCompanySizeLabel()}</span>
                </div>
                {employer.websiteUrls && getWebsiteUrls().length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {employer.facebookUrl && (
                      <a
                        href={employer.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {employer.twitterUrl && (
                      <a
                        href={employer.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {employer.linkedinUrl && (
                      <a
                        href={employer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {employer.googleUrl && (
                      <a
                        href={employer.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {employer.youtubeUrl && (
                      <a
                        href={employer.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                        <Youtube className="w-5 h-5" />
                </a>
                    )}
                  </div>
                )}
              </div>

              {/* About Company Section */}
              {employer.aboutCompany && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  About Company
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{employer.aboutCompany}</p>
                </div>
              </div>
              )}
            </div>

            {/* Right Column - Location and Profile Info Sidebars */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Location
                  </h3>
                  <div className="mb-3">
                    {employer.district && (
                      <div className="text-sm text-gray-600 mb-1">
                        {employer.district.name}
                      </div>
                    )}
                    <div className="font-medium text-gray-900">
                      {buildFullAddress()}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildFullAddress())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View larger map
                    </a>
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <iframe
                      src={buildGoogleMapsUrl()}
                      width="100%"
                      height="300"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0"
                    />
                  </div>
                </div>
              </Card>

              {/* Profile Info Section */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Profile Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium text-gray-900">
                          {getCompanySizeLabel()}
                        </p>
                      </div>
                    </div>

                    {employer.contactPerson && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                          <p className="text-sm text-gray-600">Contact Person</p>
                          <p className="font-medium text-gray-900">
                            {employer.contactPerson}
                          </p>
                      </div>
                    </div>
                    )}

                    {employer.phoneNumber && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <PhoneCall className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">
                            {employer.phoneNumber}
                        </p>
                      </div>
                    </div>
                    )}

                    {employer.email && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                            {employer.email}
                        </p>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
