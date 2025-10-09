import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import UserSideBar from "@/components/UserSideBar";
import UploadNewCVModal from "@/pages/User/MyResume/components/UploadNewCVModal";

interface Resume {
  id: string;
  title: string;
  date: string;
  type: "created" | "uploaded";
  fileUrl?: string;
}

const MyResume = () => {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Frontend Developer",
      date: "Cập Nhật 09-10-2025",
      type: "created",
    },
    {
      id: "2",
      title: "Game Developer",
      date: "Cập Nhật 09-10-2025",
      type: "created",
    },
    {
      id: "3",
      title: "Software Engineering",
      date: "Cập Nhật 09-10-2025",
      type: "created",
    },
    {
      id: "4",
      title: "Backend Developer",
      date: "Cập Nhật 09-10-2025",
      type: "created",
    },
    {
      id: "5",
      title: "Sales Consultant",
      date: "Cập Nhật 09-10-2025",
      type: "created",
    },
    {
      id: "6",
      title: "CV_Dang_Xuan_Khanh.Pdf",
      date: "Cập Nhật 09-10-2025",
      type: "uploaded",
      fileUrl: "/sample-cv.pdf",
    },
    {
      id: "7",
      title: "CV_QA.Pdf",
      date: "Cập Nhật 09-10-2025",
      type: "uploaded",
      fileUrl: "/sample-cv.pdf",
    },
    {
      id: "8",
      title: "CV_Fresher.Pdf",
      date: "Cập Nhật 09-10-2025",
      type: "uploaded",
      fileUrl: "/sample-cv.pdf",
    },
    {
      id: "9",
      title: "CV_Intern.Pdf",
      date: "Cập Nhật 09-10-2025",
      type: "uploaded",
      fileUrl: "/sample-cv.pdf",
    },
    {
      id: "10",
      title: "CV_Nguyen_Minh_Quan.Pdf",
      date: "Nhập 09-10-2025",
      type: "uploaded",
      fileUrl: "/sample-cv.pdf",
    },
  ]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cvName, setCvName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createdResumes = resumes.filter((r) => r.type === "created");
  const uploadedResumes = resumes.filter((r) => r.type === "uploaded");

  const handleFileSelect = (file: File | null) => {
    if (file && file.type === "application/pdf" && file.size <= 12 * 1024 * 1024) {
      setSelectedFile(file);
    } else if (file) {
      alert("Please select a PDF file under 12 MB");
    }
  };

  const handleUploadCV = (onClose: () => void) => {
    if (!cvName.trim()) {
      alert("Vui lòng nhập tên Cv/Resume");
      return;
    }
    if (!selectedFile) {
      alert("Vui lòng chọn file để upload");
      return;
    }

    const newResume: Resume = {
      id: Date.now().toString(),
      title: cvName,
      date: `Nhập ${new Date().toLocaleDateString("vi-VN")}`,
      type: "uploaded",
      fileUrl: URL.createObjectURL(selectedFile),
    };

    setResumes([...resumes, newResume]);
    setCvName("");
    setSelectedFile(null);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa CV này?")) {
      setResumes(resumes.filter((r) => r.id !== id));
    }
  };

  const handleView = (resume: Resume) => {
    if (resume.type === "uploaded" && resume.fileUrl) {
      window.open(resume.fileUrl, "_blank");
    } else {
      alert("Xem CV: " + resume.title);
    }
  };

  const handleEdit = (id: string) => {
    alert("Chỉnh sửa CV: " + id);
  };

  const handleDownload = (resume: Resume) => {
    alert("Tải xuống CV: " + resume.title);
  };

  const handleDuplicate = (resume: Resume) => {
    const duplicated: Resume = {
      ...resume,
      id: Date.now().toString(),
      title: resume.title + " (Copy)",
    };
    setResumes([...resumes, duplicated]);
  };

  const renderResumeCard = (resume: Resume, isCreateNew = false) => {
    const isHovered = hoveredId === resume.id;

    return (
      <div
        key={resume.id}
        className="resume-card relative bg-gray-200 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg"
        style={{ aspectRatio: "3/4" }}
        onMouseEnter={() => setHoveredId(resume.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {isCreateNew ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-6xl text-gray-600 mb-4">+</div>
            <div className="text-gray-700 font-medium">Create New CV</div>
          </div>
        ) : (
          <>
            <div className="w-full h-full bg-white"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t">
              <div className="font-medium text-sm text-gray-800 truncate">{resume.title}</div>
              <div className="text-xs text-gray-500 mt-1">{resume.date}</div>
            </div>

            {/* Hover overlay with actions */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                <div className="flex gap-3">
                  {resume.type === "created" && (
                    <button
                      onClick={() => handleEdit(resume.id)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-sky-400 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleView(resume)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-400 transition-colors"
                    title="Xem"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    title="Xóa"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {resume.type === "created" && (
                  <div className="flex gap-2 absolute bottom-3">
                    <button
                      onClick={() => handleDownload(resume)}
                      className="px-2 py-1.5 bg-white rounded-xl text-[10px] font-medium hover:bg-[#1967d2] transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => handleDuplicate(resume)}
                      className="px-2 bg-white py-1.5 rounded-xl text-[10px] font-medium hover:bg-[#1967d2] transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Duplicate
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
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
            <h1 className="text-xl font-bold text-gray-800">My Resumes</h1>
          </div>

          {/* Created CV Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div
                  className="inline-block text-white font-semibold px-8 py-3 uppercase text-center"
                  style={{ backgroundColor: "#4eb0c6", clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%,20px 50%)" }}
                >
                  Created CV
                </div>
              </div>
              <Button className="bg-[#1967d2] hover:bg-[#1557b0] text-white px-6">Create New CV</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div
                className="resume-card relative  rounded-lg overflow-hidden cursor-pointer hover:border-[#1967d2] hover:bg-[#e3eefc] group transition-all duration-300 hover:shadow-lg border-2 border-dashed border-gray-400"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="text-6xl group-hover:text-[#1967d2] text-gray-600 mb-4">+</div>
                  <div className="text-gray-700 font-medium">Create New CV</div>
                </div>
              </div>
              {createdResumes.map((resume) => renderResumeCard(resume))}
            </div>
          </div>
          {/* Uploaded CV Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div
                  className="inline-block text-white font-semibold px-8 py-3 uppercase text-center"
                  style={{ backgroundColor: "#4eb0c6", clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%,20px 50%)" }}
                >
                  Uploaded CV
                </div>
              </div>
              <UploadNewCVModal
                trigger={<Button className="bg-[#1967d2] hover:bg-[#1557b0] text-white px-6">Upload New CV</Button>}
                cvName={cvName}
                setCvName={setCvName}
                fileInputRef={fileInputRef}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                handleUploadCV={handleUploadCV}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <UploadNewCVModal
                trigger={
                  <div
                    className="resume-card relative rounded-lg overflow-hidden cursor-pointer hover:border-[#1967d2] hover:bg-[#e3eefc] group transition-all duration-300 hover:shadow-lg border-2 border-dashed border-gray-400"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="text-6xl text-gray-600 group-hover:text-[#1967d2] mb-4">+</div>
                      <div className="text-gray-700 font-medium">Upload New CV</div>
                    </div>
                  </div>
                }
                cvName={cvName}
                setCvName={setCvName}
                fileInputRef={fileInputRef}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                handleUploadCV={handleUploadCV}
              />
              {uploadedResumes.map((resume) => renderResumeCard(resume))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResume;
