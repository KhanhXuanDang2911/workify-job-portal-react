import React from "react";
import { useRef, useState, useMemo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import CandidateSheet from "@/components/CandidateSheet";
import type { ApplicationResponse } from "@/types";
import { ApplicationStatus } from "@/types";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PipelineViewProps {
  applications: ApplicationResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface PipelineColumn {
  id: string;
  title: string;
  count: number;
  color: string;
  applications: ApplicationResponse[];
}

const getPipelineColumn = (
  status: ApplicationStatus
): { id: string; title: string; color: string } => {
  const columnMap: Record<
    ApplicationStatus,
    { id: string; title: string; color: string }
  > = {
    [ApplicationStatus.UNREAD]: {
      id: "new-applied",
      title: "New Applied",
      color: "bg-green-500",
    },
    [ApplicationStatus.VIEWED]: {
      id: "viewed",
      title: "Viewed",
      color: "bg-blue-500",
    },
    [ApplicationStatus.EMAILED]: {
      id: "emailed",
      title: "Emailed",
      color: "bg-purple-500",
    },
    [ApplicationStatus.SCREENING]: {
      id: "screening",
      title: "Screening",
      color: "bg-teal-600",
    },
    [ApplicationStatus.SCREENING_PENDING]: {
      id: "screening-pending",
      title: "Screening Pending",
      color: "bg-orange-500",
    },
    [ApplicationStatus.INTERVIEW_SCHEDULING]: {
      id: "interview-scheduling",
      title: "Interview Scheduling",
      color: "bg-purple-500",
    },
    [ApplicationStatus.INTERVIEWED_PENDING]: {
      id: "interviewed-pending",
      title: "Interviewed Pending",
      color: "bg-cyan-500",
    },
    [ApplicationStatus.OFFERED]: {
      id: "offered",
      title: "Offered",
      color: "bg-yellow-500",
    },
    [ApplicationStatus.REJECTED]: {
      id: "rejected",
      title: "Rejected",
      color: "bg-red-500",
    },
  };
  return (
    columnMap[status] || {
      id: status.toLowerCase(),
      title: status,
      color: "bg-gray-500",
    }
  );
};

const relativePosted = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "1 ngày trước";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  } catch (e) {
    return "";
  }
};

export default function PipelineView({
  applications,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PipelineViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const pipelineColumns = useMemo(() => {
    const columnsMap = new Map<string, PipelineColumn>();

    const allStatuses: ApplicationStatus[] = [
      ApplicationStatus.UNREAD,
      ApplicationStatus.VIEWED,
      ApplicationStatus.EMAILED,
      ApplicationStatus.SCREENING,
      ApplicationStatus.SCREENING_PENDING,
      ApplicationStatus.INTERVIEW_SCHEDULING,
      ApplicationStatus.INTERVIEWED_PENDING,
      ApplicationStatus.OFFERED,
      ApplicationStatus.REJECTED,
    ];

    allStatuses.forEach((status) => {
      const columnInfo = getPipelineColumn(status);
      columnsMap.set(status, {
        id: columnInfo.id,
        title: columnInfo.title,
        count: 0,
        color: columnInfo.color,
        applications: [],
      });
    });

    applications.forEach((application) => {
      const status = application.status;
      const column = columnsMap.get(status);
      if (column) {
        column.applications.push(application);
        column.count = column.applications.length;
      }
    });

    return Array.from(columnsMap.values()).filter((col) => col.count > 0);
  }, [applications]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        ref={scrollContainerRef}
        className={cn(
          "overflow-x-auto pb-4",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-4 min-w-max">
          {pipelineColumns.length === 0 ? (
            <div className="w-full text-center py-20 text-gray-500">
              Không có ứng viên nào
            </div>
          ) : (
            pipelineColumns.map((column) => (
              <div key={column.id} className="w-[280px] flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className={cn("h-1.5", column.color)} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        {column.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-300 rounded-sm min-w-7 text-center p-1">
                        {column.count}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {column.applications.map((application) => (
                        <CandidateSheet
                          key={application.id}
                          candidate={application}
                        >
                          <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                <span className="text-purple-600 font-medium">
                                  {application.fullName.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 flex-1">
                                {application.fullName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3.5 w-3.5",
                                      "fill-gray-200 text-gray-200"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {relativePosted(application.createdAt)}
                              </span>
                            </div>
                          </div>
                        </CandidateSheet>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="6"
                  className="focus:bg-sky-200 focus:text-[#1967d2]"
                >
                  6
                </SelectItem>
                <SelectItem
                  value="10"
                  className="focus:bg-sky-200 focus:text-[#1967d2]"
                >
                  10
                </SelectItem>
                <SelectItem
                  value="20"
                  className="focus:bg-sky-200 focus:text-[#1967d2]"
                >
                  20
                </SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">Candidates per page</span>
          </div>
          <div className="flex items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
