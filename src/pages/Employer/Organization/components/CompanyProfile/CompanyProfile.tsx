import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  MapPin,
  Users,
  Plus,
  Loader2,
  ExternalLink,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CompanyBannerModal from "@/pages/Employer/Organization/components/CompanyBannerModal";
import CompanyInformationModal from "@/pages/Employer/Organization/components/CompanyInformationModal";
// sort select removed; pagination implemented instead
import AboutCompanyModal from "@/pages/Employer/Organization/components/AboutCompanyModal";
import { useNavigate } from "react-router-dom";
import { employerService, jobService } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "@/types/api.types";
import type { JobResponse } from "@/types/job.type";
import { toast } from "react-toastify";
import { CompanySizeLabelVN } from "@/constants";
import Loading from "@/components/Loading";
import { employer_routes } from "@/routes/routes.const";
import EditWebsiteUrlsModal from "@/pages/Employer/Organization/components/CompanyProfile/EditWebsiteUrlsModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "@/hooks/useTranslation";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultBanner =
  "https://i.pinimg.com/1200x/80/27/c6/8027c6c615900bf009b322294b61fcb2.jpg";
const defaultAvatar =
  "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg";

export default function CompanyProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [bannerImage, setBannerImage] = useState<string>(defaultBanner);
  const [avatarImage, setAvatarImage] = useState<string>(defaultAvatar);
  const [showAvatarHover, setShowAvatarHover] = useState(false);
  const [showEditCoverMenu, setShowEditCoverMenu] = useState(false);
  // pagination for hiring jobs (API uses 1-based pageNumber)
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 5;
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: employerData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
  });

  // Get current hiring jobs - only fetch when employer data is loaded
  const {
    data: hiringJobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useQuery<PageResponse<JobResponse>, Error>({
    queryKey: ["openingsByEmployer", employerData?.id, pageNumber, pageSize],
    queryFn: async () => {
      if (!employerData?.id) throw new Error("Missing employer id");
      const response = await jobService.getJobsByEmployerId(
        employerData.id,
        pageNumber,
        pageSize
      );
      return response.data;
    },
    enabled: !!employerData?.id, // Only fetch when employer id is available
  });

  useEffect(() => {
    if (jobsError) {
      toast.error(t("toast.error.unknownError"));
    }
  }, [jobsError, t]);

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => employerService.updateEmployerAvatar(file),
    onSuccess: (response) => {
      setAvatarImage(response.data?.avatarUrl || "");
      toast.success(t("toast.success.profileUpdated"));
    },
    onError: () => {
      toast.error(t("toast.error.updateProfileFailed"));
    },
  });

  useEffect(() => {
    if (employerData) {
      setAvatarImage(employerData.avatarUrl || defaultAvatar);
      setBannerImage(employerData.backgroundUrl || defaultBanner);
    }
  }, [employerData]);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatarMutation.mutate(file);
    }
  };

  return (
    <>
      {isLoadingProfile && (
        <div className="absolute top-1/2 left-1/2">
          <Loading />
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Banner Section */}
        <div className="relative">
          <img
            src={bannerImage || defaultBanner}
            alt="Company Banner"
            className="w-full h-64 object-cover"
          />
          <DropdownMenu
            open={showEditCoverMenu}
            onOpenChange={setShowEditCoverMenu}
          >
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-gray-100"
                size="sm"
              >
                <Camera className="mr-2 h-4 w-4" />
                {t("employer.organization.editCover")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <CompanyBannerModal
                currentBanner={bannerImage}
                onBannerChange={setBannerImage}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="focus:bg-sky-200 focus:text-[#1967d2]"
                  >
                    Select banner
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">
                Change position
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowAvatarHover(true)}
              onMouseLeave={() => setShowAvatarHover(false)}
              onClick={handleAvatarClick}
            >
              <img
                src={avatarImage || defaultAvatar}
                alt="Company Avatar"
                className="w-32 h-32 rounded-lg border-4 border-white object-cover"
              />
              {showAvatarHover && (
                <div className="absolute inset-0 bg-black opacity-40 rounded-lg flex items-center justify-center">
                  {updateAvatarMutation.isPending ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={updateAvatarMutation.isPending}
            />
          </div>
        </div>

        {/* Company Info Header */}
        <div className="pt-20 px-8 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {employerData?.companyName}
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {employerData
                      ? `${employerData.detailAddress}, ${employerData.district?.name}, ${employerData.province?.name}`
                      : t("employer.organization.addressNotSet")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {employerData?.companySize
                      ? CompanySizeLabelVN[employerData.companySize]
                      : "Company size not set"}
                  </span>
                </div>
              </div>
            </div>
            <CompanyInformationModal />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1967d2]">
                  {t("employer.organization.aboutCompany")}
                </h3>
                <AboutCompanyModal />
              </div>
              {employerData && employerData.aboutCompany !== "" ? (
                <div
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: employerData.aboutCompany || "",
                  }}
                />
              ) : (
                <p className="text-gray-600">
                  {t("employer.organization.noDescription")}
                </p>
              )}
            </div>

            {/* Current Hiring Position */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1967d2]">
                  {t("employer.organization.currentHiring")}
                </h3>
                <Button
                  className="bg-[#1967d2] hover:bg-[#1557b0] py-5"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `${employer_routes.BASE}/${employer_routes.JOB_ADD}`
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("employer.organization.postNewJob")}
                </Button>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 space-x-2">
                  <span className="text-green-500">
                    {hiringJobsData?.numberOfElements || 0}
                  </span>
                  <span className="font-semibold">
                    {t("employer.organization.activeJobs", {
                      count: hiringJobsData?.numberOfElements || 0,
                    })}
                  </span>
                </span>
              </div>
              {isLoadingJobs ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1967d2] mx-auto" />
                </div>
              ) : hiringJobsData && hiringJobsData.items.length > 0 ? (
                <div className="space-y-4">
                  {hiringJobsData.items.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-[#1967d2] hover:underline cursor-pointer"
                            onClick={() =>
                              navigate(
                                `${employer_routes.BASE}/${employer_routes.JOBS}`
                              )
                            }
                          >
                            {job.jobTitle}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {job.jobLocations
                                ?.map((loc) => loc.province?.name)
                                .join(", ") || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>
                              {t("employer.organization.posted")}:{" "}
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              {t("employer.organization.expires")}:{" "}
                              {new Date(
                                job.expirationDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `${employer_routes.BASE}/${employer_routes.JOBS}/${job.id}/edit`
                            )
                          }
                        >
                          {t("common.edit")}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(hiringJobsData?.numberOfElements || 0) === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>{t("employer.organization.allJobsPending")}</p>
                    </div>
                  )}
                  {(hiringJobsData?.numberOfElements || 0) > 0 && (
                    <div className="mt-3">
                      {/* Pagination controls */}
                      {hiringJobsData && hiringJobsData.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-600">
                            {t("employer.organization.pageOf", {
                              page: pageNumber,
                              total: hiringJobsData.totalPages,
                            })}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setPageNumber((p) => Math.max(1, p - 1))
                              }
                              disabled={pageNumber === 1}
                            >
                              {t("common.previous")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setPageNumber((p) =>
                                  Math.min(hiringJobsData.totalPages, p + 1)
                                )
                              }
                              disabled={
                                pageNumber === hiringJobsData.totalPages
                              }
                            >
                              {t("common.next")}
                            </Button>
                          </div>
                        </div>
                      )}
                      {/* View all jobs link */}
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            navigate(
                              `${employer_routes.BASE}/${employer_routes.JOBS}`
                            )
                          }
                        >
                          {t("employer.organization.viewAllJobs")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-left py-8">
                  <p className="font-semibold mb-2">
                    {t("employer.organization.noActiveJobPostings")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("employer.organization.postFirstJob")}
                  </p>
                </div>
              )}
            </div>

            {/* Work Locations */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1967d2]">
                  Work locations
                </h3>
              </div>
              <div className="space-y-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1967d2]">
                      {employerData?.companyName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {employerData
                        ? `${employerData.detailAddress}, ${employerData.district?.name}, ${employerData.province?.name}`
                        : t("employer.organization.addressNotSet")}
                    </p>
                  </div>
                </div>
              </div>
              {/* Map View */}
              {employerData?.province && employerData?.district && (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[16.0544, 108.2022]} // Da Nang coordinates as default
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[16.0544, 108.2022]}>
                      <Popup>
                        <div>
                          <strong>{employerData.companyName}</strong>
                          <br />
                          {employerData.detailAddress},{" "}
                          {employerData.district?.name},{" "}
                          {employerData.province?.name}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Website */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#1967d2]">
                  Website
                </h3>
                <EditWebsiteUrlsModal />
              </div>
              <div className="space-y-2">
                {employerData?.websiteUrls &&
                employerData.websiteUrls.length > 0 ? (
                  <>
                    {employerData.websiteUrls.map((url, index) => (
                      <div
                        key={index}
                        className="text-sm flex items-center gap-2 text-gray-600"
                      >
                        <ExternalLink size={16} className="text-gray-500" />
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Chưa có thông tin website
                  </p>
                )}
              </div>
            </div>

            {/* Follow */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Follow us
              </h3>
              <div className="flex flex-col gap-3">
                {/* Facebook */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </div>
                  {employerData?.facebookUrl ? (
                    <a
                      href={employerData.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      {employerData.facebookUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                  </div>
                  {employerData?.linkedinUrl ? (
                    <a
                      href={employerData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      {employerData.linkedinUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </div>

                {/* YouTube */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Youtube className="h-5 w-5 text-red-600" />
                  </div>
                  {employerData?.youtubeUrl ? (
                    <a
                      href={employerData.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      {employerData.youtubeUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </div>

                {/* Twitter */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <Twitter className="h-5 w-5 text-sky-500" />
                  </div>
                  {employerData?.twitterUrl ? (
                    <a
                      href={employerData.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      {employerData.twitterUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </div>

                {/* Google */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                      />
                    </svg>
                  </div>
                  {employerData?.googleUrl ? (
                    <a
                      href={employerData.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      {employerData.googleUrl}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
