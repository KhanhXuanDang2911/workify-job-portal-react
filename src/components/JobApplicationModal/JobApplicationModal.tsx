import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, Phone, FileText, AlertTriangle } from "lucide-react";

interface JobApplicationModalProps {
  jobTitle: string;
  companyName: string;
  children: React.ReactNode;
}

// Mock user data - in real app this would come from auth context
const mockUser = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
};

export default function JobApplicationModal({
  jobTitle,
  companyName,
  children,
}: JobApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size must be under 5MB" });
        return;
      }

      const allowedTypes = [".doc", ".docx", ".pdf"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setErrors({
          ...errors,
          file: "Only .doc, .docx, .pdf files are allowed",
        });
        return;
      }

      setSelectedFile(file);
      setErrors({ ...errors, file: "" });
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!phoneNumber.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!selectedFile) {
      newErrors.file = "CV file is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Submitting application:", {
      name: mockUser.name,
      email: mockUser.email,
      phone: phoneNumber,
      coverLetter,
      cv: selectedFile,
    });

    setIsOpen(false);
    setPhoneNumber("");
    setCoverLetter("");
    setSelectedFile(null);
    setErrors({});
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPhoneNumber("");
    setCoverLetter("");
    setSelectedFile(null);
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <p className="text-sm text-gray-600 mt-1">
                Chuyên Viên Hành Chính Và Quản Trị Văn Phòng - {companyName}
              </p>
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
          {/* User Info Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Chọn CV để ứng tuyển
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Họ và tên:</span> {mockUser.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {mockUser.email}
              </p>
            </div>
          </div>

          {/* CV Upload Section */}
          <div className="space-y-3">
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
                  <span>Chọn CV</span>
                </Button>
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {selectedFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {errors.file && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {errors.file}
              </div>
            )}
          </div>

          {/* Required Information */}
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              <span className="text-green-600">
                Vui lòng nhập đầy đủ thông tin chi tiết:
              </span>
              <span className="text-red-500 ml-2">(*) Thông tin bắt buộc.</span>
            </p>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Số điện thoại hiện tại với NTD"
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
          </div>

          {/* Cover Letter */}
          <div className="space-y-3">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Thư giới thiệu:
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Một thư giới thiệu ngắn gọn, chỉnh chu sẽ giúp bạn trở nên chuyên
              nghiệp và gây ấn tượng hơn với nhà tuyển dụng.
            </p>
            <textarea
              placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
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
        </div>

        {/* Footer cố định */}
        <div className="flex justify-end space-x-3 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            Nộp hồ sơ ứng tuyển
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
