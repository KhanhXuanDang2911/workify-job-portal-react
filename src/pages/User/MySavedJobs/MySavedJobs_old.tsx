import { useState } from "react";
import UserSideBar from "@/components/UserSideBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3x3, List, MapPin, Building2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import JobSummarySheet from "@/components/JobSummarySheet";
import Pagination from "@/components/Pagination";
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

export default function MySavedJobs() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [jobs, setJobs] = useState<Job[]>(mockSavedJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6;

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
    <div className="flex" style={{ background: "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)" }}>
      {/* Sidebar */}
      <div className="ml-5 my-4 w-64 flex-shrink-0 h-screen">
        <UserSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-5">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
            <h1 className="text-xl font-bold text-gray-800">My Saved Jobs</h1>
          </div>
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
          {isLoading ? (
            viewMode === "table" ? (
              <TableViewSkeleton />
            ) : (
              <GridViewSkeleton />
            )
          ) : viewMode === "table" ? (
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
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:bg-blue-50 transition-shadow"
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
              <Button size="sm" className="bg-[#1967d2] hover:bg-[#1557b0] text-white" onClick={() => onView(job)}>
                View
              </Button>
              <Button size="sm" variant="outline" className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-500 bg-transparent" onClick={() => onDelete(job.id)}>
                <Trash2 className="w-4 h-4 " />
              </Button>
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
        <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow relative hover:bg-blue-50">
          {/* Delete Button */}
          <button
            onClick={() => onDelete(job.id)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Job Logo */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-pink-500 mb-4">
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

          {/* View Button */}
          <Button className="w-full bg-transparent border border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white transition-colors" onClick={() => onView(job)}>
            View
          </Button>
        </div>
      ))}
    </div>
  );
}

// Skeleton Components
function TableViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gradient-to-r from-[#5ba4cf] to-[#7bb8d9] text-white font-semibold text-sm rounded-lg">
        <div>JOBS</div>
        <div>LOCATION</div>
        <div>EXPIRE</div>
        <div>SAVED</div>
        <div>ACTION</div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridViewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <Skeleton className="w-16 h-16 rounded-lg mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
