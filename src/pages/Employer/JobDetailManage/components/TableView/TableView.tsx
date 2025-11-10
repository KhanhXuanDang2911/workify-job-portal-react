import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Pagination from "@/components/Pagination";
import CandidateSheet from "@/components/CandidateSheet";
import type { ApplicationResponse } from "@/types";
import { ApplicationStatus } from "@/types";

interface TableViewProps {
  applications: ApplicationResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string | undefined) => void;
  receivedWithin?: number;
  onReceivedWithinChange?: (days: number | undefined) => void;
}

// Map ApplicationStatus to stage name and progress
const getStageInfo = (status: ApplicationStatus): { name: string; progress: number[]; color: string } => {
  const stageMap: Record<ApplicationStatus, { name: string; progress: number[]; color: string }> = {
    [ApplicationStatus.UNREAD]: { name: "New Applied", progress: [1, 0, 0, 0, 0, 0], color: "bg-green-500" },
    [ApplicationStatus.VIEWED]: { name: "Viewed", progress: [1, 1, 0, 0, 0, 0], color: "bg-blue-500" },
    [ApplicationStatus.EMAILED]: { name: "Emailed", progress: [1, 1, 1, 0, 0, 0], color: "bg-purple-500" },
    [ApplicationStatus.SCREENING]: { name: "Screening", progress: [1, 1, 0, 0, 0, 0], color: "bg-teal-600" },
    [ApplicationStatus.SCREENING_PENDING]: { name: "Screening Pending", progress: [1, 1, 1, 0, 0, 0], color: "bg-orange-500" },
    [ApplicationStatus.INTERVIEW_SCHEDULING]: { name: "Interview Scheduling", progress: [1, 1, 1, 1, 0, 0], color: "bg-purple-500" },
    [ApplicationStatus.INTERVIEWED_PENDING]: { name: "Interviewed Pending", progress: [1, 1, 1, 1, 1, 0], color: "bg-cyan-500" },
    [ApplicationStatus.OFFERED]: { name: "Offered", progress: [1, 1, 1, 1, 1, 1], color: "bg-yellow-500" },
    [ApplicationStatus.REJECTED]: { name: "Rejected", progress: [1, 0, 0, 0, 0, 0], color: "bg-red-500" },
  };
  return stageMap[status] || { name: status, progress: [1, 0, 0, 0, 0, 0], color: "bg-gray-500" };
};

// Format relative time
const relativePosted = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  } catch (e) {
    return "";
  }
};

export default function TableView({
  applications,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  statusFilter,
  onStatusFilterChange,
  receivedWithin,
  onReceivedWithinChange,
}: TableViewProps) {
  const handleStatusFilterChange = (value: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(value === "all" ? undefined : value);
    }
  };

  const handleReceivedWithinChange = (value: string) => {
    if (onReceivedWithinChange) {
      onReceivedWithinChange(value === "all" ? undefined : Number(value));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search candidates" className="pl-9 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
          </div>
          <Select value={statusFilter || "all"} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value={ApplicationStatus.UNREAD} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Chưa đọc
              </SelectItem>
              <SelectItem value={ApplicationStatus.VIEWED} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Đã xem
              </SelectItem>
              <SelectItem value={ApplicationStatus.SCREENING} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Đang sàng lọc
              </SelectItem>
              <SelectItem value={ApplicationStatus.INTERVIEW_SCHEDULING} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Lên lịch phỏng vấn
              </SelectItem>
              <SelectItem value={ApplicationStatus.OFFERED} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Đã đề xuất
              </SelectItem>
              <SelectItem value={ApplicationStatus.REJECTED} className="focus:bg-sky-200 focus:text-[#1967d2]">
                Đã từ chối
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={receivedWithin ? String(receivedWithin) : "all"} onValueChange={handleReceivedWithinChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Received Within" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Tất cả thời gian
              </SelectItem>
              <SelectItem value="7" className="focus:bg-sky-200 focus:text-[#1967d2]">
                7 ngày qua
              </SelectItem>
              <SelectItem value="30" className="focus:bg-sky-200 focus:text-[#1967d2]">
                30 ngày qua
              </SelectItem>
              <SelectItem value="90" className="focus:bg-sky-200 focus:text-[#1967d2]">
                90 ngày qua
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#1967d2] hover:bg-[#1967d2]">
            <TableHead className="w-[300px]">
              <div className="flex items-center gap-2 py-4 text-white">
                Candidate Name
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Rating
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Stages
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Applied date
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Email
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Không có ứng viên nào
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const stageInfo = getStageInfo(application.status);
              return (
                <CandidateSheet key={application.id} candidate={application}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">{application.fullName.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-gray-900">{application.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-4 w-4", "fill-gray-200 text-gray-200")} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">0.0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{stageInfo.name}</span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-1">
                          {stageInfo.progress.map((status, i) => (
                            <div key={i} className={cn("h-1.5 w-6 rounded-full", status === 1 ? stageInfo.color : "bg-gray-200")} />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{relativePosted(application.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{application.email}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Gửi email</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Tải CV</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2] text-red-600">Từ chối</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </CandidateSheet>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6" className="focus:bg-sky-200 focus:text-[#1967d2]">
                6
              </SelectItem>
              <SelectItem value="10" className="focus:bg-sky-200 focus:text-[#1967d2]">
                10
              </SelectItem>
              <SelectItem value="20" className="focus:bg-sky-200 focus:text-[#1967d2]">
                20
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Candidates per page</span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
