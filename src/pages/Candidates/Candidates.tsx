import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { ResponsiveContext } from "@/context/ResponsiveContext";
import { applicationService } from "@/services";
import { ApplicationStatus } from "@/types";
import Loading from "@/components/Loading";
// CandidateSheet removed for /employer/applications — render rows/cards directly
// type ApplicationResponse not used in this file
import { toast } from "react-toastify";
import { FileText, FileTextIcon, Download, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { useTranslation } from "@/hooks/useTranslation";
import ChatModal from "@/components/Chat/ChatModal";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";
import { useEmployerAuth } from "@/context/employer-auth";

// Map ApplicationStatus to display text and color with badge styles
const getStatusInfo = (
  status: ApplicationStatus,
  t: (key: string) => string
): { label: string; badgeColor: string } => {
  const statusMap: Record<
    ApplicationStatus,
    { label: string; badgeColor: string }
  > = {
    [ApplicationStatus.UNREAD]: {
      label: t("employer.candidates.status.newApplied"),
      badgeColor: "bg-gray-100 text-gray-700 border-gray-300",
    },
    [ApplicationStatus.VIEWED]: {
      label: t("employer.candidates.status.viewed"),
      badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
    },
    [ApplicationStatus.EMAILED]: {
      label: t("employer.candidates.status.emailed"),
      badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
    },
    [ApplicationStatus.SCREENING]: {
      label: t("employer.candidates.status.screening"),
      badgeColor: "bg-teal-100 text-teal-700 border-teal-300",
    },
    [ApplicationStatus.SCREENING_PENDING]: {
      label: t("employer.candidates.status.screeningPending"),
      badgeColor: "bg-orange-100 text-orange-700 border-orange-300",
    },
    [ApplicationStatus.INTERVIEW_SCHEDULING]: {
      label: t("employer.candidates.status.interviewScheduling"),
      badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    [ApplicationStatus.INTERVIEWED_PENDING]: {
      label: t("employer.candidates.status.interviewedPending"),
      badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-300",
    },
    [ApplicationStatus.OFFERED]: {
      label: t("employer.candidates.status.offered"),
      badgeColor: "bg-green-100 text-green-700 border-green-300",
    },
    [ApplicationStatus.REJECTED]: {
      label: t("employer.candidates.status.rejected"),
      badgeColor: "bg-red-100 text-red-700 border-red-300",
    },
  };
  return (
    statusMap[status] || {
      label: status,
      badgeColor: "bg-gray-100 text-gray-700 border-gray-300",
    }
  );
};

// Format date - will be updated inside component to use i18n
const formatDate = (dateString?: string, locale: string = "vi-VN"): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

function Candidates() {
  const { t, i18n } = useTranslation();
  const { device } = useContext(ResponsiveContext);
  const params = useParams();

  const [selectedJobId, setSelectedJobId] = useState<number | undefined>(
    params.jobId ? Number(params.jobId) : undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  // NOTE: removed fetching all jobs here to avoid extra API calls.
  // The page now relies on `selectedJobId` from the route params.

  // Fetch applications by job
  const {
    data: applicationsResponse,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["applications-by-job", selectedJobId, currentPage, itemsPerPage],
    queryFn: () =>
      applicationService.getApplicationsByJob(selectedJobId!, {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      }),
    enabled: !!selectedJobId,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });

  const queryClient = useQueryClient();
  const { state: employerAuth } = useEmployerAuth();
  const applications = applicationsResponse?.data?.items || [];
  const totalCandidates = applicationsResponse?.data?.numberOfElements || 0;
  const totalPages = applicationsResponse?.data?.totalPages || 0;

  // Chat modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  // Change application status mutation
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      applicationService.changeApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications-by-job", selectedJobId],
      });
      toast.success(t("employer.applications.statusUpdatedSuccess"));
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("employer.applications.statusUpdateError")
      );
    },
  });

  // Filter applications by search keyword
  const filteredApplications = applications.filter((app) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      app.fullName.toLowerCase().includes(keyword) ||
      app.email.toLowerCase().includes(keyword) ||
      app.job.jobTitle.toLowerCase().includes(keyword)
    );
  });

  // Auto-select first job if available
  // Previously this component fetched all jobs and auto-selected the first one.
  // That behaviour was removed per request: the page now expects `jobId` from
  // the URL. If `params.jobId` changes, update selection accordingly.
  useEffect(() => {
    if (params.jobId) {
      const id = Number(params.jobId);
      if (!isNaN(id)) {
        setSelectedJobId(id);
      }
    }
  }, [params.jobId]);

  // Refetch applications when job is selected/changed
  useEffect(() => {
    if (selectedJobId) {
      refetchApplications();
    }
  }, [selectedJobId, refetchApplications]);

  // Handle change status
  const handleChangeStatus = (
    applicationId: number,
    newStatus: ApplicationStatus
  ) => {
    changeStatusMutation.mutate({ id: applicationId, status: newStatus });
  };

  // Handle view CV
  const handleViewCV = (cvUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    } else {
      toast.error(t("employer.applications.cvNotAvailable"));
    }
  };

  // State for cover letter dialog
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("");

  // Handle view cover letter
  const handleViewCoverLetter = (coverLetter: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCoverLetter(coverLetter);
    setCoverLetterDialogOpen(true);
  };

  // Handle open chat
  const handleOpenChat = async (applicationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const conversationResponse =
        await chatService.getConversationByApplicationId(applicationId);
      if (conversationResponse.data) {
        setSelectedConversation(conversationResponse.data);
        setSelectedApplicationId(applicationId);
        setShowChatModal(true);
      }
    } catch (error: any) {
      console.error("Error fetching conversation:", error);
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404) {
        toast.error(
          t("employer.applications.chatNotFound") ||
            "Chưa có kênh chat cho đơn ứng tuyển này"
        );
      } else if (status === 403) {
        toast.error(
          t("employer.applications.chatNoPermission") ||
            "Bạn không có quyền truy cập chat này"
        );
      } else if (status === 401) {
        toast.error(
          t("employer.applications.chatUnauthorized") ||
            "Vui lòng đăng nhập lại để sử dụng tính năng chat"
        );
      } else {
        toast.error(
          message ||
            t("employer.applications.chatError") ||
            "Không thể mở chat. Vui lòng thử lại sau."
        );
      }
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    if (filteredApplications.length === 0) {
      toast.warning(t("employer.applications.noDataToExport"));
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = filteredApplications.map((application, index) => {
        const statusInfo = getStatusInfo(application.status, t);
        return {
          [t("employer.applications.excel.stt")]: index + 1,
          [t("employer.applications.excel.fullName")]: application.fullName,
          [t("employer.applications.excel.email")]: application.email,
          [t("employer.applications.excel.phoneNumber")]:
            application.phoneNumber,
          [t("employer.applications.excel.status")]: statusInfo.label,
          [t("employer.applications.excel.appliedDate")]: formatDate(
            application.createdAt,
            i18n.language === "vi" ? "vi-VN" : "en-US"
          ),
          [t("employer.applications.excel.cvLink")]:
            application.cvUrl || t("employer.applications.excel.noCv"),
          [t("employer.applications.excel.position")]: application.job.jobTitle,
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 25 }, // Full Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 20 }, // Status
        { wch: 20 }, // Applied Date
        { wch: 50 }, // CV Link
        { wch: 30 }, // Position
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        t("employer.applications.excel.sheetName")
      );

      // Generate filename with current date
      const currentDate = new Date()
        .toLocaleDateString("vi-VN")
        .replace(/\//g, "-");
      const jobTitle = selectedJobId ? `job_${selectedJobId}` : "All";
      const filename = `${t("employer.applications.excel.filenamePrefix")}_${jobTitle}_${currentDate}.xlsx`;

      // Write file
      XLSX.writeFile(wb, filename);

      toast.success(
        t("employer.applications.exportSuccess", {
          count: filteredApplications.length,
        })
      );
    } catch (error) {
      toast.error(t("employer.applications.exportError"));
    }
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Content Header */}
        <div
          className={`flex items-center ${device !== "desktop" ? "flex-col items-stretch gap-5" : ""} justify-between mb-6`}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-[#084abc]">
              {t("employer.applications.receivedApplications", {
                count: totalCandidates,
              })}
            </h2>
            {/* Job select removed — page relies on jobId in URL */}
          </div>

          <div
            className={`flex items-center gap-4 ${device === "mobile" ? "flex-col items-stretch gap-5" : ""}`}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c8493]"
                size={20}
              />
              <Input
                placeholder={t("employer.applications.searchCandidates")}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className={`pl-10 ${device === "mobile" ? "w-full" : "w-72"} bg-white border-[#e2e7f5]`}
              />
            </div>

            <Button
              className="bg-[#4640de] hover:bg-[#4640de]/90 text-white flex items-center gap-2"
              onClick={handleExportToExcel}
              disabled={filteredApplications.length === 0}
            >
              <Download className="w-4 h-4" />
              {t("employer.applications.exportCvList")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#e2e7f5] overflow-hidden">
          {!selectedJobId ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img
                src="/empty-folder.png"
                alt="No job selected"
                className="w-48 h-48 mb-4"
              />
              <p className="text-[#7c8493] text-lg">
                {t("employer.applications.pleaseSelectJob")}
              </p>
            </div>
          ) : isLoadingApplications ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loading variant="bars" className="mx-auto" />
            </div>
          ) : isErrorApplications ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-[#7c8493] text-lg">
                {t("employer.applications.loadCandidatesError")}
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img
                src="/empty-folder.png"
                alt="No candidates"
                className="w-48 h-48 mb-4"
              />
              <p className="text-[#7c8493] text-lg">
                {t("employer.applications.noCandidates")}
              </p>
            </div>
          ) : (
            <>
              {/* Table Container with Horizontal Scroll */}
              {device === "desktop" ? (
                <div className="overflow-x-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-500">
                  <table className="min-w-screen w-full border-collapse text-sm table-fixed">
                    {/* Table Header */}
                    <thead>
                      <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
                        <th className="px-4 py-3 w-[60px] font-semibold uppercase tracking-wide text-xs text-center">
                          {t("employer.applications.table.stt")}
                        </th>
                        <th className="px-4 py-3 w-[200px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.fullName")}
                        </th>
                        <th className="px-4 py-3 w-[130px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.phoneNumber")}
                        </th>
                        <th className="px-4 py-3 w-[200px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.email")}
                        </th>
                        <th className="px-4 py-3 w-[180px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.status")}
                        </th>
                        <th className="px-4 py-3 w-[150px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.appliedDate")}
                        </th>
                        <th className="px-4 py-3 w-[300px] font-semibold uppercase tracking-wide text-xs">
                          {t("employer.applications.table.action")}
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {filteredApplications.map((application, index) => {
                        const statusInfo = getStatusInfo(application.status, t);
                        return (
                          <tr
                            key={application.id}
                            className="hover:bg-muted/30 border-b last:border-none transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-medium">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                  <AvatarImage src={""} />
                                  <AvatarFallback className="bg-purple-200 text-purple-600 font-semibold">
                                    {application.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {application.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {application.phoneNumber}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 truncate">
                              {application.email}
                            </td>
                            <td
                              className="px-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Select
                                value={application.status}
                                onValueChange={(value) =>
                                  handleChangeStatus(
                                    application.id,
                                    value as ApplicationStatus
                                  )
                                }
                              >
                                <SelectTrigger className="w-fit border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
                                  <Badge
                                    variant="outline"
                                    className={`${statusInfo.badgeColor} font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(ApplicationStatus).map(
                                    (status) => {
                                      const info = getStatusInfo(status, t);
                                      return (
                                        <SelectItem
                                          key={status}
                                          value={status}
                                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                                        >
                                          <Badge
                                            variant="outline"
                                            className={`${info.badgeColor} font-medium`}
                                          >
                                            {info.label}
                                          </Badge>
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {formatDate(
                                application.createdAt,
                                i18n.language === "vi" ? "vi-VN" : "en-US"
                              )}
                            </td>
                            <td
                              className="px-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                  onClick={(e) =>
                                    handleViewCV(application.cvUrl, e)
                                  }
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  {t("employer.applications.viewCv")}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-purple-500 text-white hover:bg-purple-600 border-purple-500"
                                  onClick={(e) =>
                                    handleViewCoverLetter(
                                      application.coverLetter,
                                      e
                                    )
                                  }
                                >
                                  <FileTextIcon className="w-4 h-4 mr-1" />
                                  Cover Letter
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500 text-white hover:bg-green-600 border-green-500"
                                  onClick={(e) =>
                                    handleOpenChat(application.id, e)
                                  }
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  {/* Mobile/Tablet Card Layout */}
                  {filteredApplications.map((application, index) => {
                    const statusInfo = getStatusInfo(application.status, t);
                    return (
                      <div
                        key={application.id}
                        className="p-4 border-b border-[#e2e7f5] hover:bg-[#f8f8fd]/50 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-sm text-[#7c8493] font-medium mt-1 min-w-[24px]">
                            {(currentPage - 1) * itemsPerPage + index + 1}.
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={""} />
                            <AvatarFallback className="bg-purple-200 text-purple-600">
                              {application.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">
                              {application.fullName}
                            </p>
                            <p className="text-sm text-[#7c8493] mt-1 truncate">
                              {application.job.jobTitle}
                            </p>
                            <div
                              className="flex items-center gap-2 mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Select
                                value={application.status}
                                onValueChange={(value) =>
                                  handleChangeStatus(
                                    application.id,
                                    value as ApplicationStatus
                                  )
                                }
                              >
                                <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
                                  <Badge
                                    variant="outline"
                                    className={`${statusInfo.badgeColor} text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(ApplicationStatus).map(
                                    (status) => {
                                      const info = getStatusInfo(status, t);
                                      return (
                                        <SelectItem
                                          key={status}
                                          value={status}
                                          className="focus:bg-sky-200 focus:text-[#1967d2]"
                                        >
                                          <Badge
                                            variant="outline"
                                            className={`${info.badgeColor} text-xs font-medium`}
                                          >
                                            {info.label}
                                          </Badge>
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select>
                              <span className="text-xs text-[#7c8493]">
                                {formatDate(
                                  application.createdAt,
                                  i18n.language === "vi" ? "vi-VN" : "en-US"
                                )}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-[#7c8493]">
                                <span className="font-medium">
                                  {t("employer.applications.phoneLabel")}:
                                </span>{" "}
                                {application.phoneNumber}
                              </div>
                              <div className="text-xs text-[#7c8493] truncate">
                                <span className="font-medium">
                                  {t("employer.applications.emailLabel")}:
                                </span>{" "}
                                {application.email}
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#4640de] border-[#4640de] hover:bg-[#4640de]/10 bg-transparent flex-1 min-w-[80px]"
                                onClick={(e) =>
                                  handleViewCV(application.cvUrl, e)
                                }
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                <span className="text-xs sm:text-sm">
                                  {t("employer.applications.viewCv")}
                                </span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#4640de] border-[#4640de] hover:bg-[#4640de]/10 bg-transparent flex-1 min-w-[100px]"
                                onClick={(e) =>
                                  handleViewCoverLetter(
                                    application.coverLetter,
                                    e
                                  )
                                }
                              >
                                <FileTextIcon className="w-3 h-3 mr-1" />
                                <span className="text-xs sm:text-sm">
                                  {t("employer.applications.coverLetter")}
                                </span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-600/10 bg-transparent flex-1 min-w-[80px]"
                                onClick={(e) =>
                                  handleOpenChat(application.id, e)
                                }
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                <span className="text-xs sm:text-sm">
                                  {t("employer.applications.chat")}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        {selectedJobId && filteredApplications.length > 0 && (
          <>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-[#7c8493]">
                <span>{t("employer.applications.show")}</span>
                <select
                  className="border border-[#e2e7f5] rounded px-2 py-1 bg-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                </select>
                <span>{t("employer.applications.candidatesPerPage")}</span>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Cover Letter Dialog */}
        <Dialog
          open={coverLetterDialogOpen}
          onOpenChange={setCoverLetterDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#1967d2] text-xl font-semibold">
                {t("employer.applications.coverLetter")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedCoverLetter ||
                    t("employer.applications.noCoverLetter")}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Chat Modal */}
        {selectedConversation && (
          <ChatModal
            open={showChatModal}
            onOpenChange={setShowChatModal}
            conversation={selectedConversation}
            applicationId={selectedApplicationId || undefined}
            currentUserId={employerAuth.employer?.id}
            currentUserType="EMPLOYER"
          />
        )}
      </main>
    </>
  );
}

export default Candidates;
