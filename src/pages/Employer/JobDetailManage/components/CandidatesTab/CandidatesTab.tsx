import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TableView from "@/pages/Employer/JobDetailManage/components/TableView";
import PipelineView from "@/pages/Employer/JobDetailManage/components/PipelineView";
import { applicationService } from "@/services";
import Loading from "@/components/Loading";
import { useTranslation } from "@/hooks/useTranslation";

export default function CandidatesTab() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"pipeline" | "table">("pipeline");
  const { jobId } = useParams<{ jobId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [receivedWithin, setReceivedWithin] = useState<number | undefined>(
    undefined
  );

  const {
    data: applicationsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "applications-by-job",
      Number(jobId),
      currentPage,
      pageSize,
      statusFilter,
      receivedWithin,
    ],
    queryFn: () =>
      applicationService.getApplicationsByJob(Number(jobId), {
        pageNumber: currentPage,
        pageSize: pageSize,
        status: statusFilter,
        receivedWithin: receivedWithin,
      }),
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const applications = applicationsResponse?.data?.items || [];
  const totalCandidates = applicationsResponse?.data?.numberOfElements || 0;

  if (isLoading) {
    return (
      <div className="py-6 bg-sky-50 flex items-center justify-center min-h-[400px]">
        <Loading variant="bars" className="mx-auto" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6 bg-sky-50 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">
          {t("employer.candidates.loadCandidatesError")}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-sky-50">
      <div className="flex items-center justify-between mx-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {t("employer.candidates.totalCandidates")}:
          </span>
          <Badge className="bg-teal-600 hover:bg-teal-700">
            {totalCandidates}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "pipeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("pipeline")}
            className={
              viewMode === "pipeline"
                ? "bg-[#1967d2] hover:bg-[#1557b0]"
                : "border-[#1967d2] text-[#1967d2] hover:text-[#1967d2] hover:bg-[#e3eefc]"
            }
          >
            {t("employer.candidates.pipelineView")}
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={
              viewMode === "table"
                ? "bg-[#1967d2] hover:bg-[#1557b0]"
                : "border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2]"
            }
          >
            {t("employer.candidates.tableView")}
          </Button>
        </div>
      </div>
      <div className="mx-4">
        {viewMode === "pipeline" ? (
          <PipelineView
            applications={applications}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={applicationsResponse?.data?.totalPages || 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        ) : (
          <TableView
            applications={applications}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={applicationsResponse?.data?.totalPages || 0}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            receivedWithin={receivedWithin}
            onReceivedWithinChange={setReceivedWithin}
          />
        )}
      </div>
    </div>
  );
}
