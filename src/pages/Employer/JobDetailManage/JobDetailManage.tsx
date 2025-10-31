import { useState } from "react";
import { ChevronLeft, MoreHorizontal, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CandidatesTab from "@/pages/Employer/JobDetailManage/components/CandidatesTab";
import SettingsTab from "@/pages/Employer/JobDetailManage/components/SettingsTab";
import TabsAnimation from "@/components/TabsAnimation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { employer_routes } from "@/routes/routes.const";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services";
import JobDetailsTab from "@/pages/Employer/JobDetailManage/components/JobDetailsTab";
import { authUtils } from "@/lib/auth";
import { AgeType, CompanySize, EducationLevel, ExperienceLevel, JobGender, JobLevel, JobType } from "@/constants";
import type { JobProp } from "@/components/JobInformation/JobInformation";

const tabs = [
  { id: "candidates", label: "CANDIDATES", icon: null },
  { id: "job-details", label: "JOB DETAILS", icon: null },
  { id: "timeline-notes", label: "TIMELINE & NOTES", icon: null },
  { id: "hiring-team", label: "HIRING TEAM", icon: null },
  { id: "settings", label: "SETTINGS", icon: null },
];

export default function JobDetailManage() {
  const [activeTab, setActiveTab] = useState("candidates");
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  console.log("jobId: ", jobId);
  const from = location.state?.from?.pathname + location.state?.from?.search;

  const { data: job } = useQuery({
    queryKey: ["job", Number(jobId)],
    queryFn: () => jobService.getJobById(Number(jobId)),
    staleTime: 2 * 60 * 1000,
    enabled: !!jobId,
  });

  const jobDetail: JobProp = {
    // header
    isNew: true,
    companyBanner: authUtils.getEmployer()?.backgroundUrl || "",
    companyLogo: authUtils.getEmployer()?.avatarUrl || "",
    jobTitle: job?.data.jobTitle || "Tiêu đề Job",
    companyName: job?.data.companyName || "Company Name",
    jobLocation: job?.data.jobLocations?.map((location) => ({ province: location.province, district: location.district, detailAddress: location.detailAddress })) || [],
    companyWebsite: job?.data.companyWebsite || "",
    salary: {
      salaryType: job?.data.salaryType || "NEGOTIABLE",
      minSalary: job?.data.minSalary,
      maxSalary: job?.data.maxSalary,
      salaryUnit: job?.data.salaryUnit,
    },
    expirationDate: job?.data.expirationDate || "",

    // Description
    jobDescription: job?.data.jobDescription || "",

    // Benefit
    jobBenefits: job?.data.jobBenefits || [],

    // Requirement
    requirement: job?.data.requirement || "",

    // Job details
    jobType: job?.data.jobType || JobType.FULL_TIME,
    jobLevel: job?.data.jobLevel || JobLevel.MANAGER,
    educationLevel: job?.data.educationLevel || EducationLevel.UNIVERSITY,
    experienceLevel: job?.data.experienceLevel || ExperienceLevel.MORE_THAN_TEN_YEARS,
    gender: job?.data.gender || JobGender.ANY,
    age: {
      ageType: job?.data.ageType || AgeType.NONE,
      minAge: job?.data.minAge,
      maxAge: job?.data.maxAge,
    },
    industries: job?.data.industries || [],

    // Contact
    contactPerson: job?.data.contactPerson || "",
    phoneNumber: job?.data.phoneNumber || "",
    contactLocation: job?.data.contactLocation || {
      province: { id: job?.data.contactLocation?.province.id || 0, code: "", name: job?.data.contactLocation?.province.name || "", engName: "" },
      district: { id: job?.data.contactLocation?.district.id || 0, code: "", name: job?.data.contactLocation?.district.name || "" },
      detailAddress: job?.data.contactLocation?.detailAddress || "",
    },
    description: job?.data.description || "",

    // Company Information
    companySize: job?.data.companySize || CompanySize.FROM_100_TO_499,
    aboutCompany: job?.data.aboutCompany || "",
  };

  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      {/* Header */}
      <div className="bg-white border m-3">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(from || `${employer_routes.BASE}/${employer_routes.JOBS}`)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-[#1967d2] uppercase flex items-center gap-2">
                {job?.data.jobTitle}
                <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
              </h1>
              <p className="text-sm text-gray-500">
                {job?.data.status} • {job?.data.jobType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc]">
              <Share2 className="h-4 w-4" />
              Share & Promote
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#1967d2] hover:bg-[#1251a3] gap-2">
                  <Check className="h-4 w-4" />
                  Published
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Unpublish</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-3 bg-white border">
        <div className="m-5">
          <TabsAnimation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} tabsBoxPadding="3.5" />
        </div>
      </div>
      {/* Content */}
      <div className="mx-3 mt-3 bg-white border">
        {activeTab === "candidates" && (
          <div>
            <CandidatesTab />
          </div>
        )}
        {activeTab === "job-details" && <JobDetailsTab {...jobDetail} />}
        {activeTab === "timeline-notes" && <div>Timeline & Notes Content</div>}
        {activeTab === "hiring-team" && <div>Hiring Team Content</div>}
        {activeTab === "settings" && (
          <div>
            <SettingsTab />
          </div>
        )}
      </div>
    </div>
  );
}
