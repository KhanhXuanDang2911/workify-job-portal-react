import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Users, Pencil, Plus, Loader2, Link } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CompanyBannerModal from "@/pages/Employer/Organization/components/CompanyBannerModal";
import CompanyInformationModal from "@/pages/Employer/Organization/components/CompanyInformationModal";
import CompanyLocationModal from "@/pages/Employer/Organization/components/CompanyLocationModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AboutCompanyModal from "@/pages/Employer/Organization/components/AboutCompanyModal";
import { useNavigate } from "react-router-dom";
import { employerService } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CompanySizeLabelVN } from "@/constants";
import Loading from "@/components/Loading";
import { employer_routes } from "@/routes/routes.const";
import EditWebsiteUrlsModal from "@/pages/Employer/Organization/components/CompanyProfile/EditWebsiteUrlsModal";

const defaultBanner = "https://i.pinimg.com/1200x/80/27/c6/8027c6c615900bf009b322294b61fcb2.jpg";
const defaultAvatar = "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg";

export default function CompanyProfile() {
  const navigate = useNavigate();

  const [bannerImage, setBannerImage] = useState<string>(defaultBanner);
  const [avatarImage, setAvatarImage] = useState<string>(defaultAvatar);
  const [showAvatarHover, setShowAvatarHover] = useState(false);
  const [showEditCoverMenu, setShowEditCoverMenu] = useState(false);
  const [sortBy, setSortBy] = useState<string>("Date Updated");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: employerData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employerProfile"],
    queryFn: async () => {
      const response = await employerService.getEmployerProfile();
      return response.data;
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => employerService.updateEmployerAvatar(file),
    onSuccess: (response) => {
      setAvatarImage(response.data?.avatarUrl || "");
      toast.success("Cập nhật avatar thành công");
    },
    onError: () => {
      toast.error("Cập nhật avatar thất bại");
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
        {/* Preview Mode Banner */}
        <div className="bg-gray-700 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-gray-600">
              ← Back
            </Button>
            <span>You are in preview and editing mode</span>
          </div>
          <Button variant="outline" size="sm" className="bg-[#1967d2] text-white border-[#1967d2] hover:bg-[#1557b0]">
            View this page on job-seeker site
          </Button>
        </div>

        {/* Banner Section */}
        <div className="relative">
          <img src={bannerImage || defaultBanner} alt="Company Banner" className="w-full h-64 object-cover" />
          <DropdownMenu open={showEditCoverMenu} onOpenChange={setShowEditCoverMenu}>
            <DropdownMenuTrigger asChild>
              <Button className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-gray-100" size="sm">
                <Camera className="mr-2 h-4 w-4" />
                Edit cover
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <CompanyBannerModal
                currentBanner={bannerImage}
                onBannerChange={setBannerImage}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-sky-200 focus:text-[#1967d2]">
                    Select banner
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Change position</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative cursor-pointer" onMouseEnter={() => setShowAvatarHover(true)} onMouseLeave={() => setShowAvatarHover(false)} onClick={handleAvatarClick}>
              <img src={avatarImage || defaultAvatar} alt="Company Avatar" className="w-32 h-32 rounded-lg border-4 border-white object-cover" />
              {showAvatarHover && (
                <div className="absolute inset-0 bg-black opacity-40 rounded-lg flex items-center justify-center">
                  {updateAvatarMutation.isPending ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Camera className="h-8 w-8 text-white" />}
                </div>
              )}
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={updateAvatarMutation.isPending} />
          </div>
        </div>

        {/* Company Info Header */}
        <div className="pt-20 px-8 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{employerData?.companyName}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{employerData ? `${employerData.detailAddress}, ${employerData.district?.name}, ${employerData.province?.name}` : "Address not set"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{employerData?.companySize ? CompanySizeLabelVN[employerData.companySize] : "Company size not set"}</span>
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
                <h3 className="text-lg font-semibold text-[#1967d2]">About company</h3>
                <AboutCompanyModal />
              </div>
              {employerData && employerData.aboutCompany !== "" ? (
                <div className="text-gray-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: employerData.aboutCompany || "" }} />
              ) : (
                <p className="text-gray-600">No description available.</p>
              )}
            </div>

            {/* Current Hiring Position */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1967d2]">Current hiring position</h3>
                <Button className="bg-[#1967d2] hover:bg-[#1557b0] py-5" size="sm" onClick={() => navigate(`${employer_routes.BASE}/${employer_routes.JOB_ADD}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post a new Job
                </Button>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 space-x-2">
                  <span className="text-green-500">0</span>
                  <span className="font-semibold">job</span>
                </span>
                <div className="ml-auto flex items-center">
                  <span className="text-sm text-gray-500">Sort by</span>
                  <div className="ml-2">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                      <SelectTrigger className="mt-1 w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Date Updated" className="focus:bg-sky-200 focus:text-[#1967d2]">
                          Date Updated
                        </SelectItem>
                        <SelectItem value="Date Posted" className="focus:bg-sky-200 focus:text-[#1967d2]">
                          Date Posted
                        </SelectItem>
                        <SelectItem value="Expire soon" className="focus:bg-sky-200 focus:text-[#1967d2]">
                          Expire soon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="text-left py-8">
                <p className="font-semibold mb-2">We have not found jobs for this search.</p>
                <p className="text-sm text-gray-600">Search suggestions:</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>○ Check your spelling.</li>
                  <li>○ Try different keywords.</li>
                  <li>○ Try more general keywords.</li>
                </ul>
              </div>
            </div>

            {/* Work Locations */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1967d2]">Work locations (2)</h3>
                <CompanyLocationModal />
              </div>
              <div className="space-y-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1967d2]">{employerData?.companyName}</h4>
                    <p className="text-sm text-gray-600">130 Nguyễn Chí Thanh, Hai Chau District, Da Nang</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1967d2]">FPT Building</h4>
                    <p className="text-sm text-gray-600">số 17 Duy Tân, Cầu Giấy, Hà Nội, Cau Giay District, Ha Noi</p>
                  </div>
                </div>
              </div>
              {/* Map Placeholder */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Map View</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Website */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#1967d2]">Website</h3>
                <EditWebsiteUrlsModal />
              </div>
              <div className="space-y-2">
                {employerData?.websiteUrls && employerData.websiteUrls.length > 0 && (
                  <>
                    {employerData.websiteUrls.map((url, index) => (
                      <div key={index} className="text-sm flex items-center gap-1 text-gray-600">
                        <Link size={18} />{" "}
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                          {url}
                        </a>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Follow */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">Follow</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <span className="text-blue-600">f</span>
                  </Button>
                  <a href={employerData?.facebookUrl ? employerData.facebookUrl : "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {employerData?.facebookUrl ? employerData.facebookUrl : "empty"}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <span className="text-blue-500">in</span>
                  </Button>
                  <a href={employerData?.linkedinUrl ? employerData.linkedinUrl : "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {employerData?.linkedinUrl ? employerData.linkedinUrl : "empty"}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <span className="text-red-500">yt</span>
                  </Button>
                  <a href={employerData?.youtubeUrl ? employerData.youtubeUrl : "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {employerData?.youtubeUrl ? employerData.youtubeUrl : "empty"}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <span className="text-blue-400">tw</span>
                  </Button>
                  <a href={employerData?.twitterUrl ? employerData.twitterUrl : "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {employerData?.twitterUrl ? employerData.twitterUrl : "empty"}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <span className="text-orange-500">g</span>
                  </Button>
                  <a href={employerData?.googleUrl ? employerData.googleUrl : "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {employerData?.googleUrl ? employerData.googleUrl : "empty"}
                  </a>
                </div>
              </div>

              {/* Company Photos */}
              <div className="border rounded-lg p-6 mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1967d2]">Company photos</h3>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
