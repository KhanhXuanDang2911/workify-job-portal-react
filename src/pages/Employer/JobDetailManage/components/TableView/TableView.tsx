import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star,
  MoreHorizontal,
  ChevronDown,
  Search,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import CandidateSheet from "@/components/CandidateSheet";
import type { ApplicationResponse } from "@/types";
import { ApplicationStatus } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import ChatModal from "@/components/Chat/ChatModal";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";
import { useEmployerAuth } from "@/context/EmployerAuth";
import { toast } from "react-toastify";

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

function getStageInfo(
  status: ApplicationStatus,
  t: (key: string) => string
): { name: string; progress: number[]; color: string } {
  const stageMap: Record<
    ApplicationStatus,
    { name: string; progress: number[]; color: string }
  > = {
    [ApplicationStatus.UNREAD]: {
      name: t("employer.candidates.status.newApplied"),
      progress: [1, 0, 0, 0, 0, 0],
      color: "bg-green-500",
    },
    [ApplicationStatus.VIEWED]: {
      name: t("employer.candidates.status.viewed"),
      progress: [1, 1, 0, 0, 0, 0],
      color: "bg-blue-500",
    },
    [ApplicationStatus.EMAILED]: {
      name: t("employer.candidates.status.emailed"),
      progress: [1, 1, 1, 0, 0, 0],
      color: "bg-purple-500",
    },
    [ApplicationStatus.SCREENING]: {
      name: t("employer.candidates.status.screening"),
      progress: [1, 1, 0, 0, 0, 0],
      color: "bg-teal-600",
    },
    [ApplicationStatus.SCREENING_PENDING]: {
      name: t("employer.candidates.status.screeningPending"),
      progress: [1, 1, 1, 0, 0, 0],
      color: "bg-orange-500",
    },
    [ApplicationStatus.INTERVIEW_SCHEDULING]: {
      name: t("employer.candidates.status.interviewScheduling"),
      progress: [1, 1, 1, 1, 0, 0],
      color: "bg-purple-500",
    },
    [ApplicationStatus.INTERVIEWED_PENDING]: {
      name: t("employer.candidates.status.interviewedPending"),
      progress: [1, 1, 1, 1, 1, 0],
      color: "bg-cyan-500",
    },
    [ApplicationStatus.OFFERED]: {
      name: t("employer.candidates.status.offered"),
      progress: [1, 1, 1, 1, 1, 1],
      color: "bg-yellow-500",
    },
    [ApplicationStatus.REJECTED]: {
      name: t("employer.candidates.status.rejected"),
      progress: [1, 0, 0, 0, 0, 0],
      color: "bg-red-500",
    },
  };
  return (
    stageMap[status] || {
      name: status,
      progress: [1, 0, 0, 0, 0, 0],
      color: "bg-gray-500",
    }
  );
}

function relativePosted(
  dateString: string | undefined,
  t: (key: string, options?: any) => string
): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("employer.candidates.time.today");
    if (diffDays === 1) return t("employer.candidates.time.yesterday");
    if (diffDays < 7)
      return t("employer.candidates.time.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return t("employer.candidates.time.weeksAgo", {
        count: Math.floor(diffDays / 7),
      });
    if (diffDays < 365)
      return t("employer.candidates.time.monthsAgo", {
        count: Math.floor(diffDays / 30),
      });
    return t("employer.candidates.time.yearsAgo", {
      count: Math.floor(diffDays / 365),
    });
  } catch (e) {
    return "";
  }
}

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
  const { t } = useTranslation();
  const { state: employerAuth } = useEmployerAuth();
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  const handleOpenChat = async (applicationId: number) => {
    try {
      const conversationResponse =
        await chatService.getConversationByApplicationId(applicationId);
      if (conversationResponse.data) {
        setSelectedConversation(conversationResponse.data);
        setSelectedApplicationId(applicationId);
        setShowChatModal(true);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404) {
        toast.error(
          t("employer.candidates.chatNotFound") ||
            "Chưa có kênh chat cho đơn ứng tuyển này"
        );
      } else if (status === 403) {
        toast.error(
          t("employer.candidates.chatNoPermission") ||
            "Bạn không có quyền truy cập chat này"
        );
      } else if (status === 401) {
        toast.error(
          t("employer.candidates.chatUnauthorized") ||
            "Vui lòng đăng nhập lại để sử dụng tính năng chat"
        );
      } else {
        toast.error(
          message ||
            t("employer.candidates.chatError") ||
            "Không thể mở chat. Vui lòng thử lại sau."
        );
      }
    }
  };
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
            <Input
              placeholder={t("employer.candidates.searchCandidates")}
              className="pl-9 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
            />
          </div>
          <Select
            value={statusFilter || "all"}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("employer.candidates.statusLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.allStatus")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.UNREAD}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.newApplied")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.VIEWED}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.viewed")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.SCREENING}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.screening")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.INTERVIEW_SCHEDULING}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.interviewScheduling")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.OFFERED}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.offered")}
              </SelectItem>
              <SelectItem
                value={ApplicationStatus.REJECTED}
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.status.rejected")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={receivedWithin ? String(receivedWithin) : "all"}
            onValueChange={handleReceivedWithinChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={t("employer.candidates.receivedWithin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.allTime")}
              </SelectItem>
              <SelectItem
                value="7"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.daysAgo", { count: 7 })}
              </SelectItem>
              <SelectItem
                value="30"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.daysAgo", { count: 30 })}
              </SelectItem>
              <SelectItem
                value="90"
                className="focus:bg-sky-200 focus:text-[#1967d2]"
              >
                {t("employer.candidates.daysAgo", { count: 90 })}
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
                {t("employer.candidates.table.candidateName")}
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                {t("employer.candidates.table.rating")}
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                {t("employer.candidates.table.stages")}
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                {t("employer.candidates.table.appliedDate")}
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                {t("employer.candidates.table.email")}
                <ChevronDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-white">
              {t("employer.candidates.table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                {t("employer.candidates.noCandidates")}
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const stageInfo = getStageInfo(application.status, t);
              return (
                <CandidateSheet key={application.id} candidate={application}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {application.fullName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {application.fullName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                "fill-gray-200 text-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">0.0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {stageInfo.name}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-1">
                          {stageInfo.progress.map((status, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-6 rounded-full",
                                status === 1 ? stageInfo.color : "bg-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {relativePosted(application.createdAt, t)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {application.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {t("employer.candidates.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-sky-200 focus:text-[#1967d2]"
                            onClick={() => handleOpenChat(application.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {t("employer.candidates.chat") || "Chat"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {t("employer.candidates.sendEmail")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">
                            {t("employer.candidates.downloadCV")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2] text-red-600">
                            {t("employer.candidates.reject")}
                          </DropdownMenuItem>
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
          <span className="text-sm text-gray-600">
            {t("employer.candidates.view")}
          </span>
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
          <span className="text-sm text-gray-600">
            {t("employer.candidates.candidatesPerPage")}
          </span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

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
    </div>
  );
}
