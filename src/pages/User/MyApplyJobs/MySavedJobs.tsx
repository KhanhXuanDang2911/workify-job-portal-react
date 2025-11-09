import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { JobTypeLabelVN } from "@/constants";
import { Link } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import { mockSavedJobs } from "@/pages/User/MySavedJobs/MySavedJobsMockData";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  expireDate: string;
  savedDate: string;
  salary: string;
  posted: string;
  applications: string;
  description: string;
  requirements: string[];
  benefits: {
    offer: string[];
    rights: string[];
  };
  image: string;
  companyWebsite?: string;
  backgroundUrl?: string;
}

// Format salary
const formatSalary = (job: any): string => {
  try {
    if (job.salaryType === "RANGE") {
      const min = job.minSalary != null ? Number(job.minSalary).toLocaleString() : null;
      const max = job.maxSalary != null ? Number(job.maxSalary).toLocaleString() : null;
      return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${job.salaryUnit ?? ""}`.trim();
    }
    if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
      return `${Number(job.minSalary).toLocaleString()} ${job.salaryUnit ?? ""}`;
    }
    if (job.salaryType === "NEGOTIABLE") return "Thỏa thuận";
    if (job.salaryType === "COMPETITIVE") return "Cạnh tranh";
    return "Thỏa thuận";
  } catch (e) {
    return "Thỏa thuận";
  }
};

// Map type to color
const mapTypeColor = (jobType?: string): string => {
  if (!jobType) return "bg-gray-400";
  if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL")) return "bg-green-500";
  if (jobType.includes("PART")) return "bg-orange-500";
  if (jobType.includes("CONTRACT")) return "bg-purple-500";
  return "bg-blue-500";
};

export default function MyApplyJobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Use mock data for now (static)
  const jobs: Job[] = useMemo(() => {
    return mockSavedJobs.map((job) => ({
      ...job,
      companyWebsite: "",
      backgroundUrl: job.image || "https://marketplace.canva.com/EAGZ0XPzFoE/1/0/1600w/canva-blue-and-white-line-modern-corporate-business-banner-Cvux46kBPZ8.jpg",
    }));
  }, []);

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 7],
    queryFn: () => jobService.getTopAttractiveJobs(7),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map suggested jobs
  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => ({
      id: job.id,
      title: job.jobTitle || "",
      company: job.companyName || job.author?.companyName || "",
      salary: formatSalary(job),
      type: JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] || job.jobType,
      typeColor: mapTypeColor(job.jobType),
      logo: job.author?.avatarUrl || "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
    }));
  }, [topAttractiveResponse]);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handleDeleteJob = (jobId: number) => {
    // TODO: Implement delete functionality when API is integrated
    console.log("Delete job:", jobId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="w-full h-[450px] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(#00000080, #00000080), url('/work1.jpg')",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="text-center px-4">
          <h1
            className="text-white drop-shadow-lg"
            style={{
              marginBottom: 0,
              fontWeight: 500,
              lineHeight: "60px",
              fontSize: "40px",
            }}
          >
            Tìm việc làm nhanh 24h mới nhất trên toàn quốc
          </h1>
          <p
            className="text-white mt-4"
            style={{
              color: "#fff",
              fontSize: "18px",
              lineHeight: "28px",
              fontWeight: 400,
              opacity: 0.95,
            }}
          >
            Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>
        </div>
      </div>
      <div style={{ background: "linear-gradient(90deg, #fafcfb 0%, #f5faf7 30%, #f0f7f5 60%, #f0f7fc 100%)" }}>
        <div className="flex main-layout relative z-10 pt-20 pb-8">
          {/* Left Sidebar - Suggested Jobs */}
          <div className="w-96 flex-shrink-0">
            <SuggestedJobs jobs={suggestedJobs} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-5">
              {/* Content */}
              {jobs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600">Bạn chưa ứng tuyển việc làm nào</p>
                </div>
              ) : (
                <>
                  <TableView jobs={currentJobs} onDelete={handleDeleteJob} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Table View Component
function TableView({ jobs, onDelete }: { jobs: Job[]; onDelete: (id: number) => void }) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-[5fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gradient-to-r from-[#5ba4cf] to-[#7bb8d9] text-white font-semibold text-sm rounded-lg shadow-lg">
        <div>JOBS</div>
        <div>LOCATION</div>
        <div>EXPIRE</div>
        <div className="text-right">ACTION</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-[5fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-24"
          >
            {/* Job Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                  <Badge variant="secondary" className={cn("text-xs shrink-0", job.type === "Remote" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                    {job.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600 min-w-0">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>

            {/* Expire Date */}
            <div className="text-sm text-gray-600 truncate">{job.expireDate}</div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <Link
                to={`/${routes.JOB_DETAIL}/${job.id}`}
                className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors bg-white shrink-0"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(job.id)}
                className="w-8 h-8 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors bg-white shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
