import type React from "react";
import { useRef, useImperativeHandle } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Heart,
  Share2,
  CalendarDays,
  Briefcase,
  Users,
  Building2,
  DollarSign,
  GraduationCap,
  Globe,
  Phone,
  Mail,
  Award,
  Target,
  Gift,
  UserCheck,
  Layers,
  User,
  Grid3X3,
} from "lucide-react";
import JobApplicationModal from "../JobApplicationModal";
import type { District, Province } from "@/types";
import {
  benefitMapVN,
  CompanySize,
  CompanySizeLabel,
  EducationLevelLabelVN,
  ExperienceLevelLabelVN,
  JobGenderLabelVN,
  JobLevelLabelVN,
  JobTypeLabelVN,
  SalaryTypeLabelEN,
  type AgeType,
  type EducationLevel,
  type ExperienceLevel,
  type JobGender,
  type JobLevel,
  type JobType,
  type SalaryType,
  type SalaryUnit,
} from "@/constants";
import type { JobBenefit } from "@/types/benefit.type";
import { cn } from "@/lib/utils";

export interface JobProp {
  // header
  isNew: boolean;
  companyBanner: string;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  jobLocation: {
    province: Province;
    district: District;
    detailAddress: string;
  }[];
  companyWebsite: string;
  salary: { salaryType: SalaryType; minSalary?: number; maxSalary?: number; salaryUnit?: SalaryUnit };
  expirationDate: string;

  // Description
  jobDescription: string;

  // Benefit
  jobBenefits: JobBenefit[];

  // Requirement
  requirement: string;

  // Job details
  jobType: JobType;
  jobLevel: JobLevel;
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  gender: JobGender;
  age: { ageType: AgeType; minAge?: number; maxAge?: number };
  industries: Array<{
    id: number;
    name: string;
  }>;

  // Contact
  contactPerson: string;
  phoneNumber: string;
  contactLocation: {
    province: Province;
    district: District;
    detailAddress: string;
  };
  description?: string;

  // Company Information
  // companyName: string;
  companySize: CompanySize;
  aboutCompany: string;
}

export interface JobInformationProps {
  job: JobProp;
  jobId?: number;
  hideActionButtons: boolean;
  ref?: React.Ref<JobInformationRef>;
}

export interface JobInformationRef {
  scrollToHeader: () => void;
  scrollToDescription: () => void;
  scrollToBenefits: () => void;
  scrollToRequirements: () => void;
  scrollToJobDetails: () => void;
  scrollToContact: () => void;
  scrollToCompanyInformation: () => void;
}

function JobInformation({ job, jobId, hideActionButtons, ref }: JobInformationProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);
  const jobDetailsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyInformationRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Check if job is saved - use placeholderData from saved-jobs cache to avoid flash
  const { data: isSavedResponse } = useQuery({
    queryKey: ["saved-job", jobId],
    queryFn: () => jobService.checkSavedJob(jobId!),
    enabled: !!jobId,
    retry: false,
    placeholderData: () => {
      // Check if job exists in saved-jobs cache
      const savedJobsQueries = queryClient.getQueriesData({ queryKey: ["saved-jobs"] });
      for (const [, data] of savedJobsQueries) {
        const savedJobsData = data as any;
        if (savedJobsData?.data?.items) {
          const isInSavedList = savedJobsData.data.items.some((job: any) => job.id === jobId);
          if (isInSavedList) {
            return { status: 200, message: "", data: true };
          }
        }
      }
      return undefined;
    },
  });

  const isSaved = isSavedResponse?.data ?? false;

  // Toggle save/unsave mutation
  const toggleSaveMutation = useMutation({
    mutationFn: () => jobService.toggleSavedJob(jobId!),
    onSuccess: () => {
      // Invalidate both saved-job status and saved-jobs list
      queryClient.invalidateQueries({ queryKey: ["saved-job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success(isSaved ? "Đã bỏ lưu việc làm" : "Đã lưu việc làm");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });

  const handleToggleSave = () => {
    if (!jobId) {
      toast.error("Không tìm thấy ID công việc");
      return;
    }
    toggleSaveMutation.mutate();
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;

    const previewContainer = ref.current.closest(".job-information-preview");
    if (!previewContainer) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const containerRect = previewContainer.getBoundingClientRect();
    const elementRect = ref.current.getBoundingClientRect();

    const containerScrollTop = previewContainer.scrollTop;
    const elementOffsetTop = elementRect.top - containerRect.top + containerScrollTop;
    const containerHeight = containerRect.height;
    const elementHeight = elementRect.height;

    const targetScrollTop = elementOffsetTop - (containerHeight - elementHeight) / 2;

    previewContainer.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  };

  useImperativeHandle(ref, () => ({
    scrollToHeader: () => scrollToSection(headerRef),
    scrollToDescription: () => scrollToSection(descriptionRef),
    scrollToBenefits: () => scrollToSection(benefitsRef),
    scrollToRequirements: () => scrollToSection(requirementsRef),
    scrollToJobDetails: () => scrollToSection(jobDetailsRef),
    scrollToContact: () => scrollToSection(contactRef),
    scrollToCompanyInformation: () => scrollToSection(companyInformationRef),
  }));

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Company Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        <img
          src={job.companyBanner}
          alt={`${job.companyName} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>

        {/* New Badge - Repositioned */}
        {job.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 font-medium">New</Badge>}
      </div>

      {/* Job Header */}
      <div ref={headerRef} className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Company Logo */}
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white -mt-10 relative z-10">
            <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 object-contain" />
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{job.jobTitle}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <p className="text-lg font-medium text-gray-800">{job.companyName}</p>
                </div>
                <div className="flex flex-col text-gray-600 mb-2">
                  {job.jobLocation && Array.isArray(job.jobLocation) && job.jobLocation.length > 0 ? (
                    job.jobLocation.map((location, index) => (
                      <div className="flex gap-1" key={index}>
                        <MapPin className="w-4 h-4" />
                        <span>
                          {location.detailAddress}, {location.province?.name || ""}, {location.district?.name || ""}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Chưa cập nhật địa chỉ</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-blue-600 text-sm">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="hover:underline cursor-pointer">{job.companyWebsite}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={cn("flex items-center gap-3", hideActionButtons && "hidden")}>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToggleSave}
                  disabled={!jobId || toggleSaveMutation.isPending}
                  className={cn(
                    "border-red-300 hover:bg-red-50 bg-transparent",
                    isSaved ? "text-red-600 bg-red-50" : "text-red-600"
                  )}
                >
                  <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
                  {isSaved ? "Đã lưu" : "Lưu"}
                </Button>
                <JobApplicationModal jobTitle={job.jobTitle} companyName={job.companyName}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">Nộp đơn ngay</Button>
                </JobApplicationModal>
              </div>
            </div>

            {/* Job Meta Info with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/80 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-gray-900">
                    {job.salary.salaryType === "RANGE" && job.salary.minSalary && job.salary.maxSalary && job.salary.salaryUnit && (
                      <>
                        <span className="font-semibold">{job.salary.minSalary}</span> - <span className="font-semibold">{job.salary.maxSalary}</span>{" "}
                        <span>{job.salary.salaryUnit}</span>
                      </>
                    )}
                    {job.salary.salaryType === "GREATER_THAN" && job.salary.minSalary && job.salary.salaryUnit && (
                      <>
                        Hơn <span className="font-semibold">{job.salary.minSalary}</span> {job.salary.salaryUnit}
                      </>
                    )}
                    {(job.salary.salaryType === "COMPETITIVE" || job.salary.salaryType === "NEGOTIABLE") && (
                      <span className="capitalize">{SalaryTypeLabelEN[job.salary.salaryType]}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Ngày hết hạn</p>
                  <p className="font-semibold text-red-600">{job.expirationDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => scrollToSection(descriptionRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Mô tả
          </button>
          <button
            onClick={() => scrollToSection(benefitsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Quyền lợi
          </button>
          <button
            onClick={() => scrollToSection(requirementsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Kỹ năng yêu cầu
          </button>
          <button
            onClick={() => scrollToSection(jobDetailsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Chi tiết công việc
          </button>
          <button
            onClick={() => scrollToSection(contactRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Liên hệ
          </button>
          <button
            onClick={() => scrollToSection(companyInformationRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Về công ty
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">
        {/* Job Description Section */}
        <div ref={descriptionRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-600">Mô tả công việc</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-lg p-6 border border-blue-100">
            <div className="prose prose-gray max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
          </div>
        </div>

        <Separator />

        {/* Benefits Section */}
        <div ref={benefitsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-600">Phúc lợi</h3>
          </div>
          <div className="space-y-4">
            {job.jobBenefits && Array.isArray(job.jobBenefits) && job.jobBenefits.length > 0 ? (
              job.jobBenefits.map((benefit, index) => {
                const benefitInfo = benefitMapVN[benefit.type];
                if (!benefitInfo) return null;
                const Icon = benefitInfo.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full  flex-shrink-0"></div>
                    <Icon size={28} strokeWidth={1.8} color="#1967d2 w-[28px]! h-[28px]!" />
                    <span className="text-gray-700">{benefit.description}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">Chưa cập nhật phúc lợi</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Skills Required Section */}
        <div ref={requirementsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-600">Kỹ năng yêu cầu</h3>
          </div>
          <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-lg p-6 border border-orange-100">
            <div
              className="prose prose-gray max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: job.requirement,
              }}
            />
          </div>
        </div>

        <Separator />

        {/* Job Details Section */}
        <div ref={jobDetailsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-600">Chi tiết công việc</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-lg p-6 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Loại công việc</p>
                    <p className="font-semibold text-gray-900">{JobTypeLabelVN[job.jobType]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Layers className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Cấp bậc</p>
                    <p className="font-semibold text-gray-900">{JobLevelLabelVN[job.jobLevel]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Học vấn</p>
                    <p className="font-semibold text-gray-900">{EducationLevelLabelVN[job.educationLevel]}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Kinh nghiệm</p>
                    <p className="font-semibold text-gray-900">{ExperienceLevelLabelVN[job.experienceLevel]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Giới tính</p>
                    <p className="font-semibold text-gray-900">{JobGenderLabelVN[job.gender]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tuổi</p>
                    <p className="font-semibold text-gray-900">
                      {job.age.ageType === "INPUT" && (
                        <>
                          Từ <span>{job.age.minAge}</span> đến <span>{job.age.maxAge}</span> tuổi
                        </>
                      )}
                      {job.age.ageType === "ABOVE" && (
                        <>
                          Trên <span>{job.age.minAge}</span>
                        </>
                      )}
                      {job.age.ageType === "BELOW" && (
                        <>
                          Dưới <span>{job.age.maxAge}</span>
                        </>
                      )}
                      {job.age.ageType === "NONE" && "Không yêu cầu độ tuổi"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Grid3X3 className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Ngành nghề</p>
                    {job.industries && Array.isArray(job.industries) && job.industries.length > 0 ? (
                      job.industries.map((industry, index) => (
                        <span key={industry.id} className="font-semibold text-gray-900">
                          {industry.name}
                          {index < job.industries.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className="font-semibold text-gray-900">Chưa cập nhật</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Section */}
        <div ref={contactRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-indigo-600">Thông tin liên hệ</h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Tên liên hệ: {job.contactPerson}</h4>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong>
                  {job.contactLocation ? (
                    <>
                      {job.contactLocation.detailAddress || ""}, {job.contactLocation.province?.name || ""}, {job.contactLocation.district?.name || ""}
                    </>
                  ) : (
                    "Chưa cập nhật"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Số điện thoại: {job.phoneNumber}</h4>
              </div>
              <div className="space-y-3">
                <div
                  className="prose prose-gray max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: job.description || "",
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-600" />
                <strong>Ngày hết hạn:</strong> {job.expirationDate}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Information Section */}
        <div ref={companyInformationRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-emerald-600">Về công ty</h3>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-lg p-6 border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-emerald-600" />
              <h4 className="text-lg font-semibold text-gray-900">{job.companyName}</h4>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-gray-600">
                <strong>Quy mô:</strong> {CompanySizeLabel["vi"][job.companySize]}
              </p>
            </div>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.aboutCompany }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobInformation;
