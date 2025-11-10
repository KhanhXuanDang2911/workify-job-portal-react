import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import JobInformation from "@/components/JobInformation";
import { employer_routes } from "@/routes/routes.const";
import type { JobProp } from "@/components/JobInformation/JobInformation";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services";
import {
  AgeType,
  CompanySize,
  EducationLevel,
  ExperienceLevel,
  JobGender,
  JobLevel,
  JobType,
} from "@/constants";
import Loading from "@/components/Loading";
import { useEmployerAuth } from "@/context/employer-auth";

export default function JobDetailsTab() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const handleEditJob = () => {
    navigate(`${employer_routes.BASE}/${employer_routes.JOBS}/${jobId}/edit`);
  };

  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", Number(jobId)],
    queryFn: async () => {
      const res = await jobService.getJobById(Number(jobId));
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
    enabled: !!jobId,
  });

  const { state } = useEmployerAuth();
  const employer = state.employer;

  if (!job) {
    return null;
  }

  const jobDetail: JobProp = {
    // header
    isNew: true,
    companyBanner: employer?.backgroundUrl || "",
    companyLogo: employer?.avatarUrl || "",
    jobTitle: job?.jobTitle || "Tiêu đề Job",
    companyName: job?.companyName || "Company Name",
    jobLocation:
      job?.jobLocations?.map((location) => ({
        province: location.province,
        district: location.district,
        detailAddress: location.detailAddress,
      })) || [],
    companyWebsite: job?.companyWebsite || "",
    salary: {
      salaryType: job?.salaryType || "NEGOTIABLE",
      minSalary: job?.minSalary,
      maxSalary: job?.maxSalary,
      salaryUnit: job?.salaryUnit,
    },
    expirationDate: job?.expirationDate || "",

    // Description
    jobDescription: job?.jobDescription || "",

    // Benefit
    jobBenefits: job?.jobBenefits || [],

    // Requirement
    requirement: job?.requirement || "",

    // Job details
    jobType: job?.jobType || JobType.FULL_TIME,
    jobLevel: job?.jobLevel || JobLevel.MANAGER,
    educationLevel: job?.educationLevel || EducationLevel.UNIVERSITY,
    experienceLevel:
      job?.experienceLevel || ExperienceLevel.MORE_THAN_TEN_YEARS,
    gender: job?.gender || JobGender.ANY,
    age: {
      ageType: job?.ageType || AgeType.NONE,
      minAge: job?.minAge,
      maxAge: job?.maxAge,
    },
    industries: job?.industries || [],

    // Contact
    contactPerson: job?.contactPerson || "",
    phoneNumber: job?.phoneNumber || "",
    contactLocation: job?.contactLocation || {
      province: {
        id: job?.contactLocation?.province.id || 0,
        code: "",
        name: job?.contactLocation?.province.name || "",
        engName: "",
      },
      district: {
        id: job?.contactLocation?.district.id || 0,
        code: "",
        name: job?.contactLocation?.district.name || "",
      },
      detailAddress: job?.contactLocation?.detailAddress || "",
    },
    description: job?.description || "",

    // Company Information
    companySize: job?.companySize || CompanySize.FROM_100_TO_499,
    aboutCompany: job?.aboutCompany || "",
  };

  if (isLoadingJob) {
    return <Loading className="mx-auto" variant="bars" />;
  }

  return (
    <div className="py-6">
      <div className="px-6 mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Chi tiết công việc
        </h2>
        <Button
          onClick={handleEditJob}
          className="bg-[#1967d2] hover:bg-[#1251a3] gap-2"
        >
          <Pencil className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="px-6 mx-auto max-w-4xl">
        <JobInformation job={jobDetail} hideActionButtons={true} />
      </div>
    </div>
  );
}
