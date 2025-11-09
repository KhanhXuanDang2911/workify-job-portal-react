import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid3x3, List, MapPin, Building2, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import JobSummarySheet from "@/components/JobSummarySheet";
import Pagination from "@/components/Pagination";
import SuggestedJobs from "@/components/SuggestedJob";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import type { JobResponse } from "@/types/job.type";
import { JobTypeLabelVN } from "@/constants";
import { mockSavedJobs } from "@/pages/User/MySavedJobs/MySavedJobsMockData";

type ViewMode = "table" | "grid";

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
}

// Format salary
const formatSalary = (job: JobResponse): string => {
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

export default function MySavedJobs() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [jobs, setJobs] = useState<Job[]>(mockSavedJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch top attractive jobs for suggestions
  const { data: topAttractiveResponse } = useQuery({
    queryKey: ["top-attractive-jobs", 5],
    queryFn: () => jobService.getTopAttractiveJobs(5),
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
    setJobs(jobs.filter((job) => job.id !== jobId));
    if (selectedJob?.id === jobId) {
      setIsSheetOpen(false);
      setSelectedJob(null);
    }
    const newTotalPages = Math.ceil((jobs.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsSheetOpen(true);
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
          backgroundImage:
            "linear-gradient(#00000080, #00000080), url('/work1.jpg')",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="text-center px-4">
          <h1
            className="text-white drop-shadow-lg"
            style={{
              marginBottom: 0,
              fontWeight: 500,
              lineHeight: '60px',
              fontSize: '40px',
            }}
          >
            Tìm việc làm nhanh 24h mới nhất trên toàn quốc
          </h1>
          <p
            className="text-white mt-4"
            style={{
              color: '#fff',
              fontSize: '18px',
              lineHeight: '28px',
              fontWeight: 400,
              opacity: 0.95,
            }}
          >
            Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>
        </div>
      </div>
      <div style={{ background: "linear-gradient(90deg, #fafcfb 0%, #f5faf7 30%, #f0f7f5 60%, #f0f7fc 100%)" }}>
      <div className="flex main-layout relative z-10 pt-20 pb-8" >
          {/* Left Sidebar - Suggested Jobs */}
          <div className="w-96 flex-shrink-0">
            <SuggestedJobs jobs={suggestedJobs} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto p-5">
              {/* View Toggle */}
              <div className="flex gap-0 mb-6 w-fit">
                <Button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "!px-14 gap-2 rounded-none transition-all duration-300",
                    viewMode === "table" ? "bg-[#1967d2] text-white hover:bg-[#1557b0]" : "bg-[#5ba4cf] text-white hover:bg-[#4a93be]"
                  )}
                  style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
                >
                  <List className="w-4 h-4" />
                  Table View
                </Button>
                <Button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-none transition-all flex items-center justify-center gap-2 duration-300 !px-14",
                    viewMode === "grid" ? "bg-[#1967d2] text-white hover:bg-[#1557b0]" : "bg-[#5ba4cf] text-white hover:bg-[#4a93be]"
                  )}
                  style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%,20px 50%)" }}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span>Grid View</span>
                </Button>
              </div>

              {/* Content */}
              {viewMode === "table" ? (
                <>
                  <TableView jobs={currentJobs} onView={handleViewJob} onDelete={handleDeleteJob} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <GridView jobs={currentJobs} onView={handleViewJob} onDelete={handleDeleteJob} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Job Summary Sheet */}
          <JobSummarySheet job={selectedJob} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} onDelete={handleDeleteJob} />

        </div>
      </div>
    </>
  );
}

// Table View Component
function TableView({ jobs, onView, onDelete }: { jobs: Job[]; onView: (job: Job) => void; onDelete: (id: number) => void }) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gradient-to-r from-[#5ba4cf] to-[#7bb8d9] text-white font-semibold text-sm rounded-lg">
        <div>JOBS</div>
        <div>LOCATION</div>
        <div>EXPIRE</div>
        <div>SAVED</div>
        <div>ACTION</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
          >
            {/* Job Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <Badge variant="secondary" className={cn("text-xs", job.type === "Remote" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                    {job.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Building2 className="w-3 h-3" />
                  <span>{job.company}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>

            {/* Expire Date */}
            <div className="text-sm text-gray-600">{job.expireDate}</div>

            {/* Saved Date */}
            <div className="text-sm text-gray-600">{job.savedDate}</div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(job)}
                className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="w-8 h-8 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
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

// Grid View Component
function GridView({ jobs, onView, onDelete }: { jobs: Job[]; onView: (job: Job) => void; onDelete: (id: number) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer relative p-6">
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onView(job)}
              className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="w-8 h-8 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Job Logo */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-full h-full object-cover" />
          </div>

          {/* Job Title */}
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
            {job.type && (
              <Badge variant="secondary" className={cn("text-xs", job.type === "Remote" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                {job.type}
              </Badge>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>

          {/* Company */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

