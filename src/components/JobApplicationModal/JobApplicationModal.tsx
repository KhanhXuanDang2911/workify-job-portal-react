import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, Phone, FileText, AlertTriangle, Link as LinkIcon, Loader2 } from "lucide-react";
import { applicationService } from "@/services/application.service";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/auth/useAuth";
import { ROLE } from "@/constants";
import type { User } from "@/types";
import TiptapEditor from "@/components/TiptapEditor";

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
  // Get jobId from URL params if not provided as prop
  const { id } = useParams<{ id: string }>();
  const jobId = jobIdProp || (id ? Number(id) : undefined);
  
  // Debug: log jobId when component receives it
  console.log("JobApplicationModal - jobIdProp:", jobIdProp, "id from URL:", id, "final jobId:", jobId);
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvLink, setCvLink] = useState("");
  const [useLink, setUseLink] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const editorInitialized = useRef(false);

  const queryClient = useQueryClient();
  const { state: authState } = useAuth();

  // Use user from auth context, or fetch if needed
  // Fetch profile if:
  // - User is ADMIN (always need to fetch)
  // - User is JOB_SEEKER but not in authState
  const shouldFetchProfile = 
    isOpen && 
    (authState.role === ROLE.ADMIN || 
     (authState.role === ROLE.JOB_SEEKER && !authState.user));

  const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => authService.getProfile(),
    enabled: shouldFetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use user from auth context if JOB_SEEKER and available, otherwise use fetched profile
  const profile: User | null = 
    authState.user && authState.role === ROLE.JOB_SEEKER 
      ? (authState.user as User)
      : profileResponse?.data || null;

  // Fetch latest application by job
  const { data: latestApplicationResponse, isLoading: isLoadingLatest } = useQuery({
    queryKey: ["latestApplication", jobId],
    queryFn: () => applicationService.getLatestApplicationByJob(jobId),
    enabled: isOpen && !!jobId,
  });

  const latestApplication = latestApplicationResponse?.data;

  // Helper function to strip HTML tags and get plain text
  const stripHtml = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Initialize form data when modal opens or data loads
  useEffect(() => {
    if (isOpen) {
      if (profile) {
        setPhoneNumber(profile.phoneNumber || "");
      }
      if (latestApplication) {
        // Có application trước đó - có thể dùng link CV hoặc upload file mới
        setPhoneNumber(latestApplication.phoneNumber || profile?.phoneNumber || "");
        setCoverLetter(latestApplication.coverLetter || "");
        setCvLink(latestApplication.cvUrl || "");
        setUseLink(true); // Mặc định dùng link CV từ lần trước
        editorInitialized.current = false;
      } else {
        // Lần đầu tiên - BẮT BUỘC phải upload file CV
        setCoverLetter("");
        setCvLink("");
        setUseLink(false); // Không được dùng link CV
        editorInitialized.current = false;
      }
      setSelectedFile(null);
      setErrors({});
    }
  }, [isOpen, profile, latestApplication]);

  // Initialize editor content when cover letter is loaded
  useEffect(() => {
    if (latestApplication?.coverLetter && !editorInitialized.current && isOpen) {
      editorInitialized.current = true;
    }
  }, [latestApplication, isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "Kích thước file phải nhỏ hơn 5MB" });
        return;
      }

      const allowedTypes = [".doc", ".docx", ".pdf"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setErrors({
          ...errors,
          file: "Chỉ chấp nhận file .doc, .docx, .pdf",
        });
        return;
      }

      setSelectedFile(file);
      setUseLink(false);
      setErrors({ ...errors, file: "" });
    }
  };

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!profile) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // Get cover letter text - strip HTML tags for backend
      // Backend might not accept HTML, so convert to plain text
      const coverLetterText = stripHtml(coverLetter).trim();

      // Validate jobId
      console.log("jobId in mutation:", jobId, typeof jobId);
      if (!jobId || isNaN(Number(jobId))) {
        console.error("Invalid jobId:", jobId);
        throw new Error("Job ID không hợp lệ");
      }
      const validJobId = Number(jobId);

      if (useLink) {
        // Chỉ được dùng link CV nếu đã có application trước đó
        if (!latestApplication) {
          throw new Error("Lần đầu ứng tuyển phải tải lên CV!");
        }
        if (!cvLink.trim()) {
          throw new Error("Vui lòng nhập link CV!");
        }
        return await applicationService.applyWithLinkCV({
          fullName: profile.fullName,
          email: profile.email,
          phoneNumber: phoneNumber.trim(),
          coverLetter: coverLetterText,
          jobId: validJobId,
          cvUrl: cvLink.trim(),
        });
      } else {
        // Upload file CV (lần đầu hoặc lần sau)
        if (!selectedFile) {
          throw new Error("Vui lòng tải lên CV!");
        }
        return await applicationService.applyWithFileCV(
          {
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber: phoneNumber.trim(),
            coverLetter: coverLetterText,
            jobId: validJobId,
          },
          selectedFile
        );
      }
    },
    onSuccess: () => {
      toast.success("Ứng tuyển thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["latestApplication", jobId] });
      handleCancel();
    },
    onError: (error: any) => {
      console.error("Application error:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      console.error("Error config:", error?.config);
      
      let errorMessage = "Không thể gửi ứng tuyển, thử lại sau.";
      
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
      if (!useLink) {
        setSelectedFile(null);
      }
    },
  });

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!phoneNumber.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại!";
    }

    // Check if cover letter has content (strip HTML to check)
    const coverLetterText = stripHtml(coverLetter);
    if (!coverLetterText.trim()) {
      newErrors.coverLetter = "Vui lòng nhập thư xin việc!";
    }

    // Nếu không có latestApplication (lần đầu), BẮT BUỘC phải upload file
    if (!latestApplication) {
      if (!selectedFile) {
        newErrors.file = "Lần đầu ứng tuyển phải tải lên CV!";
      }
    } else {
      // Có latestApplication (lần 2, 3) - có thể dùng link hoặc upload file mới
      if (!useLink && !selectedFile) {
        newErrors.file = "Vui lòng tải lên CV hoặc chọn link CV!";
      }
      if (useLink && !cvLink.trim()) {
        newErrors.cvLink = "Vui lòng nhập link CV!";
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
    setPhoneNumber("");
    setCoverLetter("");
    setSelectedFile(null);
    setCvLink("");
    setUseLink(false);
    setErrors({});
    editorInitialized.current = false;
  };

  // Check authentication and role before opening modal
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Check if user is authenticated
      if (!authState.isAuthenticated) {
        toast.error("Vui lòng đăng nhập để ứng tuyển", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      // Check if user is JOB_SEEKER or ADMIN (EMPLOYER cannot apply)
      if (authState.role === ROLE.EMPLOYER) {
        toast.error("Nhà tuyển dụng không thể ứng tuyển", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (authState.role !== ROLE.JOB_SEEKER && authState.role !== ROLE.ADMIN) {
        toast.error("Chỉ ứng viên và quản trị viên mới có thể ứng tuyển", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    setIsOpen(open);
  };

  const isLoading = isLoadingProfile || isLoadingLatest;
  const remainingApplications = latestApplication ? 3 - latestApplication.applyCount : 3;

  return (
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
                Ứng tuyển <span className="text-green-600">{jobTitle}</span>
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
              {/* Notice about remaining applications */}
              {latestApplication && remainingApplications > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    Bạn còn {remainingApplications} lượt nộp cho công việc này
                  </p>
                </div>
              )}

              {/* User Info Display */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Thông tin cá nhân
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Họ và tên:</span> {profile?.fullName || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {profile?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Nhập số điện thoại"
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
                    Hồ sơ xin việc
                  </span>
                </div>

                {/* Option to use link CV - CHỈ hiển thị nếu đã có application trước đó */}
                {latestApplication?.cvUrl ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseLink(true);
                        setCvLink(latestApplication.cvUrl || "");
                        setSelectedFile(null);
                      }}
                      className={`w-full flex items-center p-3 border-2 rounded-lg transition-colors ${
                        useLink
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <LinkIcon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Link CV của bạn</span>
                    </button>
                    {useLink && latestApplication.cvUrl && (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <a
                            href={latestApplication.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-700 truncate hover:text-green-600"
                          >
                            {latestApplication.cvUrl.split("/").pop() || latestApplication.cvUrl}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Lưu ý:</span> Lần đầu ứng tuyển, vui lòng tải lên CV từ thiết bị.
                    </p>
                  </div>
                )}

                {/* Option to upload file */}
                <button
                  type="button"
                  onClick={() => {
                    setUseLink(false);
                    setCvLink("");
                    setSelectedFile(null);
                  }}
                  className={`w-full flex items-center p-3 border-2 rounded-lg transition-colors ${
                    !useLink
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Upload className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Tải lên từ thiết bị</span>
                </button>

                {!useLink && (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          Tải lên CV từ máy tính, chọn hoặc kéo thả
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
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

                {useLink && (
                  <div className="space-y-2">
                    {!latestApplication?.cvUrl && (
                      <Input
                        type="url"
                        placeholder="Nhập link CV (Google Drive, Dropbox, ...)"
                        value={cvLink}
                        onChange={(e) => setCvLink(e.target.value)}
                        className={errors.cvLink ? "border-red-500" : ""}
                      />
                    )}
                    {errors.cvLink && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.cvLink}
                      </div>
                    )}
                  </div>
                )}

                {errors.file && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.file}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Thư xin việc <span className="text-red-500">*</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Một thư xin việc ngắn gọn, chỉnh chu sẽ giúp bạn trở nên chuyên
                  nghiệp và gây ấn tượng hơn với nhà tuyển dụng.
                </p>
                <TiptapEditor
                  content={coverLetter}
                  onChange={setCoverLetter}
                  placeholder="Nhập thư xin việc của bạn..."
                  className="min-h-[200px]"
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
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <p>
                      Workify khuyến cáo ứng viên không nên đóng phí trước trong quá
                      trình tìm việc. Nếu có vấn đề phát sinh trong quá trình ứng
                      tuyển, vui lòng liên hệ với chúng tôi.
                    </p>
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
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || applyMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            {applyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Nộp đơn ngay"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
