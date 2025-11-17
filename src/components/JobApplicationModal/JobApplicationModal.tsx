import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  Phone,
  FileText,
  AlertTriangle,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { applicationService } from "@/services/application.service";
import { userService } from "@/services/user.service";
import { useUserAuth } from "@/context/user-auth";
import type { User } from "@/types";
import LoginRequiredModal from "@/components/LoginRequiredModal/LoginRequiredModal";
import { Textarea } from "@/components/ui/textarea";
import ChatModal from "@/components/Chat/ChatModal";
import { chatService } from "@/services/chat.service";
import type { ConversationResponse } from "@/types/chat.type";

interface JobApplicationModalProps {
  jobId?: number; // Make optional since we can get from URL
  jobTitle: string;
  companyName: string;
  children: React.ReactNode;
}

export default function JobApplicationModal({
  jobId: jobIdProp,
  jobTitle,
  companyName,
  children,
}: JobApplicationModalProps) {
  const { t } = useTranslation();
  // Get jobId from URL params if not provided as prop
  const { id } = useParams<{ id: string }>();
  const jobId = jobIdProp || (id ? Number(id) : undefined);

  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applyOption, setApplyOption] = useState<"new" | "reuse">("new"); // "new" = upload CV mới, "reuse" = dùng CV cũ
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const queryClient = useQueryClient();
  const { state: authState } = useUserAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null
  );

  // Fetch user profile if not available in auth context
  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userService.getUserProfile(),
    enabled: isOpen && !authState.user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use user from auth context if available, otherwise use fetched profile
  const profile: User | null = authState.user || profileResponse?.data || null;

  // Fetch latest application by job - only when authenticated
  const { data: latestApplicationResponse, isLoading: isLoadingLatest } =
    useQuery({
      queryKey: ["latestApplication", jobId],
      queryFn: () => applicationService.getLatestApplicationByJob(jobId!),
      enabled: isOpen && !!jobId && authState.isAuthenticated, // Only fetch when authenticated
    });

  const latestApplication = latestApplicationResponse?.data;

  // Initialize form data when modal opens or data loads
  useEffect(() => {
    if (isOpen) {
      if (latestApplication) {
        // Có application trước đó - có 2 option
        setFullName(latestApplication.fullName || profile?.fullName || "");
        setEmail(latestApplication.email || profile?.email || "");
        setPhoneNumber(
          latestApplication.phoneNumber || profile?.phoneNumber || ""
        );
        setCoverLetter(latestApplication.coverLetter || "");
        setApplyOption("reuse"); // Mặc định dùng CV cũ
      } else {
        // Lần đầu tiên - BẮT BUỘC phải upload file CV
        setFullName(profile?.fullName || "");
        setEmail(profile?.email || "");
        setPhoneNumber(profile?.phoneNumber || "");
        setCoverLetter("");
        setApplyOption("new"); // Chỉ có option upload CV mới
      }
      setSelectedFile(null);
      setErrors({});
    }
  }, [isOpen, profile, latestApplication]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          file: t("jobApplicationModal.validation.fileSize"),
        });
        return;
      }

      const allowedTypes = [".doc", ".docx", ".pdf"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setErrors({
          ...errors,
          file: t("jobApplicationModal.validation.fileType"),
        });
        return;
      }

      setSelectedFile(file);
      setApplyOption("new"); // Khi chọn file mới, chuyển sang option upload CV mới
      setErrors({ ...errors, file: "" });
    }
  };

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      // Get cover letter text
      const coverLetterText = coverLetter.trim();

      // Validate jobId
      if (!jobId || isNaN(Number(jobId))) {
        throw new Error(t("jobApplicationModal.validation.jobIdInvalid"));
      }
      const validJobId = Number(jobId);

      // Validate required fields
      if (!fullName.trim()) {
        throw new Error(t("jobApplicationModal.validation.fullNameRequired"));
      }
      if (!email.trim()) {
        throw new Error(t("jobApplicationModal.validation.emailRequired"));
      }
      if (!phoneNumber.trim()) {
        throw new Error(t("jobApplicationModal.validation.phoneRequired"));
      }

      if (applyOption === "reuse") {
        // Option 2: Dùng CV cũ (chỉ sửa thông tin, CV giữ nguyên)
        if (!latestApplication) {
          throw new Error(t("jobApplicationModal.validation.oldCvNotFound"));
        }
        if (!latestApplication.cvUrl) {
          throw new Error(t("jobApplicationModal.validation.oldCvNotFound"));
        }
        return await applicationService.applyWithLinkCV({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          coverLetter: coverLetterText,
          jobId: validJobId,
          cvUrl: latestApplication.cvUrl, // Dùng CV cũ từ latestApplication
        });
      } else {
        // Option 1: Upload CV mới (lần đầu hoặc lần sau)
        if (!selectedFile) {
          throw new Error(t("jobApplicationModal.validation.fileRequired"));
        }
        return await applicationService.applyWithFileCV(
          {
            fullName: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            coverLetter: coverLetterText,
            jobId: validJobId,
          },
          selectedFile
        );
      }
    },
    onSuccess: async (response) => {
      toast.success(t("toast.success.applicationSubmitted"), {
        position: "top-right",
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["latestApplication", jobId] });

      // Don't open chat modal automatically after applying
      // User can't send message until employer sends first message anyway
      // Just close the application modal
      handleCancel();
    },
    onError: (error: any) => {
      console.error("Application error:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      console.error("Error config:", error?.config);

      let errorMessage = t("toast.error.applicationFailed");

      if (error?.response?.data) {
        const data = error.response.data;
        // Try different ways to extract error message
        if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (Array.isArray(data) && data.length > 0) {
          errorMessage = data[0]?.message || data[0] || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      if (applyOption === "new") {
        setSelectedFile(null);
      }
    },
  });

  // Validation regexes from API docs
  const EMAIL_REGEX =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^(?:\+84|0)[35789][0-9]{8}$/;

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate fullName: 3-160 characters (required)
    if (!fullName.trim()) {
      newErrors.fullName = t("jobApplicationModal.validation.fullNameRequired");
    } else {
      const trimmedFullName = fullName.trim();
      if (trimmedFullName.length < 3) {
        newErrors.fullName = t(
          "jobApplicationModal.validation.fullNameMinLength"
        );
      } else if (trimmedFullName.length > 160) {
        newErrors.fullName = t(
          "jobApplicationModal.validation.fullNameMaxLength"
        );
      }
    }

    // Validate email: regex (required)
    if (!email.trim()) {
      newErrors.email = t("jobApplicationModal.validation.emailRequired");
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = t("jobApplicationModal.validation.emailInvalid");
    }

    // Validate phoneNumber: regex (required)
    if (!phoneNumber.trim()) {
      newErrors.phone = t("jobApplicationModal.validation.phoneRequired");
    } else {
      // Remove spaces and format phone number for validation
      const cleanedPhone = phoneNumber.trim().replace(/\s/g, "");
      if (!PHONE_REGEX.test(cleanedPhone)) {
        newErrors.phone = t("jobApplicationModal.validation.phoneInvalid");
      }
    }

    // Validate coverLetter: required
    if (!coverLetter.trim()) {
      newErrors.coverLetter = t(
        "jobApplicationModal.validation.coverLetterRequired"
      );
    }

    // Validate CV based on option
    if (applyOption === "new") {
      // Option 1: Upload CV mới - BẮT BUỘC phải có file
      if (!selectedFile) {
        newErrors.file = t("jobApplicationModal.validation.fileRequired");
      }
    } else {
      // Option 2: Dùng CV cũ - phải có latestApplication và cvUrl
      if (!latestApplication || !latestApplication.cvUrl) {
        newErrors.cv = t("jobApplicationModal.validation.oldCvNotFound");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    applyMutation.mutate();
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setCoverLetter("");
    setSelectedFile(null);
    setApplyOption("new");
    setErrors({});
  };

  // Check authentication and role before opening modal
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Check if user is authenticated
      if (!authState.isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
    }
    setIsOpen(open);
  };

  const isLoading = isLoadingProfile || isLoadingLatest;
  const remainingApplications = latestApplication
    ? 3 - latestApplication.applyCount
    : 3;
  const hasReachedLimit = latestApplication
    ? latestApplication.applyCount >= 3
    : false;
  const isSubmitting = applyMutation.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="max-w-2xl max-h-[90vh] flex flex-col
               [&>button.absolute.right-4.top-4]:top-7"
        >
          {/* Header cố định */}
          <DialogHeader className="border-b pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {t("jobApplicationModal.title")}{" "}
                  <span className="text-green-600">{jobTitle}</span>
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  {companyName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Nội dung scroll */}
          <div
            className="flex-1 overflow-y-auto space-y-6 py-4 pr-2 mr-[-8px]
     [&::-webkit-scrollbar]:w-2
     [&::-webkit-scrollbar-track]:bg-transparent
     [&::-webkit-scrollbar-thumb]:bg-gray-300/70
     [&::-webkit-scrollbar-thumb]:rounded-full
     [&::-webkit-scrollbar-thumb]:border-2
     [&::-webkit-scrollbar-thumb]:border-solid
     [&::-webkit-scrollbar-thumb]:border-transparent
     [&::-webkit-scrollbar-thumb]:bg-clip-content
     hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/80"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                {/* Notice about remaining applications or limit reached */}
                {latestApplication && (
                  <div
                    className={`rounded-lg p-3 ${
                      hasReachedLimit
                        ? "bg-red-50 border border-red-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        hasReachedLimit ? "text-red-800" : "text-blue-800"
                      }`}
                    >
                      {hasReachedLimit
                        ? t("jobApplicationModal.limitReached")
                        : t("jobApplicationModal.remainingApplications", {
                            count: remainingApplications,
                          })}
                    </p>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("jobApplicationModal.fullName")}{" "}
                    <span className="text-red-500">
                      {t("jobApplicationModal.required")}
                    </span>
                  </label>
                  <Input
                    type="text"
                    placeholder={t("jobApplicationModal.fullNamePlaceholder")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("jobApplicationModal.email")}{" "}
                    <span className="text-red-500">
                      {t("jobApplicationModal.required")}
                    </span>
                  </label>
                  <Input
                    type="email"
                    placeholder={t("jobApplicationModal.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("jobApplicationModal.phoneNumber")}{" "}
                    <span className="text-red-500">
                      {t("jobApplicationModal.required")}
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder={t(
                        "jobApplicationModal.phoneNumberPlaceholder"
                      )}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* CV Section */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("jobApplicationModal.resume")}{" "}
                      <span className="text-red-500">
                        {t("jobApplicationModal.required")}
                      </span>
                    </span>
                  </div>

                  {/* Nếu có latestApplication, hiển thị 2 option */}
                  {latestApplication?.cvUrl ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {t("jobApplicationModal.alreadyApplied")}
                      </p>

                      {/* Option 1: Upload CV mới */}
                      <button
                        type="button"
                        onClick={() => {
                          setApplyOption("new");
                          setSelectedFile(null);
                        }}
                        className={`w-full flex items-center p-3 border-2 rounded-lg transition-colors ${
                          applyOption === "new"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Upload className="w-5 h-5 text-green-600 mr-2" />
                        <div className="text-left">
                          <span className="text-sm font-medium block">
                            {t("jobApplicationModal.option1")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {t("jobApplicationModal.option1Description")}
                          </span>
                        </div>
                      </button>

                      {/* Option 2: Dùng CV cũ */}
                      <button
                        type="button"
                        onClick={() => {
                          setApplyOption("reuse");
                          setSelectedFile(null);
                        }}
                        className={`w-full flex items-center p-3 border-2 rounded-lg transition-colors ${
                          applyOption === "reuse"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <LinkIcon className="w-5 h-5 text-green-600 mr-2" />
                        <div className="text-left flex-1">
                          <span className="text-sm font-medium block">
                            {t("jobApplicationModal.option2")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {t("jobApplicationModal.option2Description")}
                          </span>
                        </div>
                      </button>

                      {/* Hiển thị CV cũ khi chọn Option 2 */}
                      {applyOption === "reuse" && latestApplication.cvUrl && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">
                                {t("jobApplicationModal.oldCv")}:{" "}
                                {latestApplication.cvUrl.split("/").pop() ||
                                  latestApplication.cvUrl}
                              </span>
                            </div>
                            <a
                              href={latestApplication.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:text-green-700 ml-2 flex-shrink-0"
                            >
                              {t("jobApplicationModal.view")}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Hiển thị upload area khi chọn Option 1 */}
                      {applyOption === "new" && (
                        <>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">
                                Tải lên CV từ máy tính, chọn hoặc kéo thả
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              Hỗ trợ định dạng .doc, .docx, pdf có kích thước
                              dưới 5MB
                            </p>
                            <input
                              type="file"
                              accept=".doc,.docx,.pdf"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="cv-upload"
                            />
                            <label htmlFor="cv-upload">
                              <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                asChild
                              >
                                <span>Chọn tệp để tải lên</span>
                              </Button>
                            </label>
                          </div>

                          {selectedFile && (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700 truncate">
                                  {selectedFile.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    /* Lần đầu - chỉ có option upload CV mới */
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">
                            {t("jobApplicationModal.firstTimeNote")}
                          </span>
                        </p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">
                            {t("jobApplicationModal.uploadCv")}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          {t("jobApplicationModal.uploadCvDescription")}
                        </p>
                        <input
                          type="file"
                          accept=".doc,.docx,.pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload">
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            asChild
                          >
                            <span>{t("jobApplicationModal.selectFile")}</span>
                          </Button>
                        </label>
                      </div>

                      {selectedFile && (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {selectedFile.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {errors.file && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.file}
                    </div>
                  )}
                  {errors.cv && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.cv}
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("jobApplicationModal.coverLetter")}{" "}
                      <span className="text-red-500">
                        {t("jobApplicationModal.required")}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("jobApplicationModal.coverLetterDescription")}
                  </p>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder={t(
                      "jobApplicationModal.coverLetterPlaceholder"
                    )}
                    className={`min-h-[200px] ${errors.coverLetter ? "border-red-500" : ""}`}
                  />
                  {errors.coverLetter && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.coverLetter}
                    </div>
                  )}
                </div>

                {/* Warning Note */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium mb-1">
                        {t("jobApplicationModal.warning")}
                      </p>
                      <p>{t("jobApplicationModal.warningMessage")}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer cố định */}
          <div className="flex justify-end space-x-3 pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
              disabled={applyMutation.isPending}
            >
              {t("jobApplicationModal.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || isSubmitting || hasReachedLimit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("jobApplicationModal.submitting")}
                </>
              ) : hasReachedLimit ? (
                t("jobApplicationModal.noMoreApplications")
              ) : (
                t("jobApplicationModal.submit")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title={t("loginRequired.title")}
        description={t("loginRequired.description")}
        actionText={t("loginRequired.actionText")}
      />
      {conversation && (
        <ChatModal
          open={showChatModal}
          onOpenChange={setShowChatModal}
          conversation={conversation}
          applicationId={conversation.applicationId}
          currentUserId={profile?.id}
          currentUserType="USER"
        />
      )}
    </>
  );
}
