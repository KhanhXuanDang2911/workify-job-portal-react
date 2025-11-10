import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import JobInformation from "@/components/JobInformation";
import { admin_routes } from "@/routes/routes.const";
import type { JobProp } from "@/components/JobInformation/JobInformation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services";
import {
  AgeType,
  CompanySize,
  EducationLevel,
  ExperienceLevel,
  JobGender,
  JobLevel,
  JobStatus,
  JobType,
} from "@/constants";
import Loading from "@/components/Loading";
import { useCallback, useEffect, useState } from "react";
import JobAuthor from "@/components/JobAuthor";
import { JobStatusTooltip } from "@/components/JobStatusTooltip/JobStatusTooltip";
import { toast } from "react-toastify";

interface JobAuthor {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  companyName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  employerSlug: string;
}

export default function JobDetailsManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState<JobProp | null>(null);
  const [jobAuthors, setJobAuthors] = useState<JobAuthor | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.PENDING);

  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["admin-job", Number(id)],
    queryFn: async () => {
      const res = await jobService.getJobByIdWithAuth(Number(id));
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
  });

  useEffect(() => {
    if (job) {
      setJobDetail({
        isNew: true,
        companyBanner: job.author?.backgroundUrl || "",
        companyLogo: job.author?.avatarUrl || "",
        jobTitle: job.jobTitle || "Tiêu đề Job",
        companyName: job.companyName || "Company Name",
        jobLocation:
          job.jobLocations?.map((l) => ({
            province: l.province,
            district: l.district,
            detailAddress: l.detailAddress,
          })) || [],
        companyWebsite: job.companyWebsite || "",
        salary: {
          salaryType: job.salaryType || "NEGOTIABLE",
          minSalary: job.minSalary,
          maxSalary: job.maxSalary,
          salaryUnit: job.salaryUnit,
        },
        expirationDate: job.expirationDate || "",
        jobDescription: job.jobDescription || "",
        jobBenefits: job.jobBenefits || [],
        requirement: job.requirement || "",
        jobType: job.jobType || JobType.FULL_TIME,
        jobLevel: job.jobLevel || JobLevel.MANAGER,
        educationLevel: job.educationLevel || EducationLevel.UNIVERSITY,
        experienceLevel:
          job.experienceLevel || ExperienceLevel.MORE_THAN_TEN_YEARS,
        gender: job.gender || JobGender.ANY,
        age: {
          ageType: job.ageType || AgeType.NONE,
          minAge: job.minAge,
          maxAge: job.maxAge,
        },
        industries: job.industries || [],
        contactPerson: job.contactPerson || "",
        phoneNumber: job.phoneNumber || "",
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
        description: job.description || "",
        companySize: job.companySize || CompanySize.FROM_100_TO_499,
        aboutCompany: job.aboutCompany || "",
      });
      setJobAuthors(job.author);
      setJobStatus(job.status);
    }
  }, [job]);

  const updateJobStatusMutation = useMutation({
    mutationFn: ({
      jobId,
      newStatus,
    }: {
      jobId: number;
      newStatus: JobStatus;
    }) => jobService.updateJobStatusAsAdmin(jobId, newStatus),
    onSuccess: () => {
      toast.success("Job status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["job", Number(id)] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "all"] });
    },
    onError: () => {
      toast.error("An error occurred while updating the job status");
    },
  });

  const handleChangeStatus = useCallback(
    (jobId: number, newStatus: JobStatus) => {
      updateJobStatusMutation.mutate({ jobId, newStatus });
    },
    [updateJobStatusMutation]
  );

  if (isLoadingJob || !jobDetail) {
    return (
      <div className="h-screen relative">
        <Loading className="mx-auto top-1/2 left-1/2 absolute" variant="bars" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Button
        variant="outline"
        className="mb-4 ml-12 "
        onClick={() => navigate(`${admin_routes.BASE}/${admin_routes.JOBS}`)}
      >
        <ChevronLeft className="h-5 w-5" /> Back
      </Button>
      <div className="px-6 mb-6 flex">
        <div className="px-6 space-y-2 ">
          <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
          <div className=" mx-auto max-w-4xl">
            <JobInformation job={jobDetail} hideActionButtons={true} />
          </div>
        </div>
        <div className="px-6 space-y-2 ">
          <h2 className="text-lg font-semibold text-gray-900">Author</h2>
          <div className="mx-auto max-w-4xl">
            <JobAuthor {...jobAuthors!} />
            <div className="flex mt-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Status:</h2>
              <JobStatusTooltip
                status={jobStatus}
                onChangeStatus={(newStatus) =>
                  handleChangeStatus(Number(id), newStatus)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
