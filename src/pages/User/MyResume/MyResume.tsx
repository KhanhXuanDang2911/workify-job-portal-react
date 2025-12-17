import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import UserSideBar from "@/components/UserSideBar";
import { resumeService } from "@/services/resume.service";
import type { ResumeItem } from "@/types/resume.type";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CVPreview from "@/components/CVPreview";
import { routes } from "@/routes/routes.const";
import Pagination from "@/components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useTranslation } from "@/hooks/useTranslation";
import { getFontFamilyName } from "@/utils/font.utils";

import { Loader2, Share2, Copy, Check, Globe } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const MyResume = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [createdResumes, setCreatedResumes] = useState<ResumeItem[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<number | null>(null);

  // Share Dialog State
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [resumeToShare, setResumeToShare] = useState<ResumeItem | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  // PDF Download State
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [resumeToDownload, setResumeToDownload] = useState<ResumeItem | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchResumes(currentPage);
  }, [currentPage]);

  const fetchResumes = async (page: number) => {
    try {
      const res = await resumeService.getMyResumes(page, ITEMS_PER_PAGE);
      if (res.data) {
        setCreatedResumes(res.data.items);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch resumes", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = async (resume: ResumeItem) => {
    setDownloadingId(resume.id);
    setResumeToDownload(resume);

    // Wait for the template to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    const element = downloadRef.current;
    if (!element) {
      toast.error(t("toast.error.generatePdfFailed"));
      setDownloadingId(null);
      setResumeToDownload(null);
      return;
    }

    try {
      // Convert all images to base64 BEFORE calling toPng
      const images = element.querySelectorAll("img");
      const imagePromises = Array.from(images).map(async (img) => {
        if (img.src.startsWith("data:")) return; // Already base64

        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = base64;
        } catch (e) {
          console.warn("Failed to convert image to base64:", img.src, e);
        }
      });

      await Promise.all(imagePromises);

      // Use PNG for lossless quality with good compression for text/graphics
      // pixelRatio 2.5 for sharper text while keeping file size reasonable
      const dataUrl = await toPng(element, {
        pixelRatio: 2.5, // 2.5x resolution - sharper than 2x, smaller than 3x
        backgroundColor: "#ffffff",
        cacheBust: false, // Don't bust cache since we already converted images
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        // A4 dimensions in pt: 595.28 x 841.89
        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        // Image dimensions (at 2.5x pixelRatio, divide by 2.5 to get actual size)
        const imgWidth = img.width / 2.5;
        const imgHeight = img.height / 2.5;

        // Scale to fit A4 width
        const scale = A4_WIDTH / imgWidth;
        const scaledHeight = imgHeight * scale;

        // Create PDF with custom page height to fit entire content without breaking
        // This prevents content from being cut off at page boundaries
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [A4_WIDTH, Math.max(scaledHeight, A4_HEIGHT)], // Custom page size
          compress: true,
        });

        // Add the entire image in one piece - no page breaks
        pdf.addImage(
          img,
          "PNG",
          0,
          0,
          A4_WIDTH,
          scaledHeight,
          undefined,
          "FAST"
        );

        pdf.save(`${resume.title || "resume"}.pdf`);
        setDownloadingId(null);
        setResumeToDownload(null);
      };

      img.onerror = () => {
        toast.error(t("toast.error.generatePdfFailed"));
        setDownloadingId(null);
        setResumeToDownload(null);
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(t("toast.error.downloadPdfFailed"));
      setDownloadingId(null);
      setResumeToDownload(null);
    }
  };

  const handleCreateNew = () => {
    // Navigate to templates page to choose a template
    navigate("/templates-cv");
  };

  const handleEdit = (id: number) => {
    navigate(`/${routes.RESUME}/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (resumeToDelete === null) return;

    try {
      await resumeService.deleteResume(resumeToDelete);
      toast.success(t("toast.success.resumeDeleted"));
      fetchResumes(currentPage);
    } catch (error) {
      toast.error(t("toast.error.deleteResumeFailed"));
    } finally {
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleViewCreated = (id: number) => {
    navigate(`/${routes.VIEW_RESUME}/${id}`);
  };

  // Share logic
  const handleShare = (resume: ResumeItem) => {
    setResumeToShare(resume);
    setShareDialogOpen(true);
    setCopied(false);
  };

  const toggleShare = async () => {
    if (!resumeToShare) return;

    try {
      setIsSharing(true);
      const newStatus = !resumeToShare.isSharedPublic;
      const res = await resumeService.toggleShareResume(
        resumeToShare.id,
        newStatus
      );

      if (res.data) {
        setResumeToShare(res.data);
        // Update list
        setCreatedResumes((prev) =>
          prev.map((r) => (r.id === res.data!.id ? res.data! : r))
        );
        toast.success(
          newStatus
            ? t("auth.shareResume.toast.public")
            : t("auth.shareResume.toast.private")
        );
      }
    } catch (error) {
      toast.error(t("auth.shareResume.toast.failed"));
    } finally {
      setIsSharing(false);
    }
  };

  const getPublicUrl = (id: number) => {
    return `${window.location.origin}/cv/public/${id}`;
  };

  const copyToClipboard = () => {
    if (!resumeToShare) return;
    navigator.clipboard.writeText(getPublicUrl(resumeToShare.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("auth.shareResume.toast.copied"));
  };

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{
        background:
          "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)",
      }}
    >
      {/* Sidebar */}
      <div className="lg:ml-5 lg:my-4 w-full lg:w-64 flex-shrink-0">
        <UserSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-5 lg:p-5">
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
                  style={{
                    backgroundColor: "#4eb0c6",
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%,20px 50%)",
                  }}
                >
                  Created CV
                </div>
              </div>
              <Button
                onClick={handleCreateNew}
                className="bg-[#1967d2] hover:bg-[#1557b0] text-white px-6"
              >
                Create New CV
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {createdResumes.map((resume) => {
                const isHovered = hoveredId === resume.id;
                return (
                  <div
                    key={resume.id}
                    className="resume-card relative bg-gray-200 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{ aspectRatio: "210/297" }}
                    onMouseEnter={() => setHoveredId(resume.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div
                      className="w-full overflow-hidden absolute inset-0"
                      style={{ userSelect: "text" }}
                    >
                      <CVPreview
                        data={resume.data}
                        template={resume.template}
                        fontFamily={resume.fontFamily}
                      />
                    </div>

                    {/* Public Badge */}
                    {resume.isSharedPublic && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                        <Globe className="w-3 h-3" /> Public
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t z-10">
                      <div className="font-medium text-sm text-gray-800 truncate">
                        {resume.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Hover overlay with actions */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200 z-20">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(resume.id)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-sky-400 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleViewCreated(resume.id)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-400 transition-colors"
                            title="Xem"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
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
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(resume);
                            }}
                            disabled={downloadingId === resume.id}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-blue-400 transition-colors disabled:opacity-50"
                            title="Tải xuống PDF"
                          >
                            {downloadingId === resume.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            )}
                          </button>

                          {/* Share Button (Moved to End) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(resume);
                            }}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-purple-400 transition-colors"
                            title="Chia sẻ"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Hidden container for PDF generation - renders full size CV offscreen */}
      {resumeToDownload && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            zIndex: -1,
            overflow: "visible",
          }}
        >
          <div
            ref={downloadRef}
            style={{
              width: "900px", // Match template width (900px as used in TemplatePanda)
              backgroundColor: "#ffffff",
              fontFamily: getFontFamilyName(resumeToDownload.fontFamily),
            }}
          >
            <CVPreview
              data={resumeToDownload.data}
              template={resumeToDownload.template}
              fontFamily={resumeToDownload.fontFamily}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa CV</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa CV này không? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("auth.shareResume.title")}</DialogTitle>
            <DialogDescription>
              {t("auth.shareResume.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base">
                  {t("auth.shareResume.publicAccess")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("auth.shareResume.publicDesc")}
                </p>
              </div>
              <Button
                variant={
                  resumeToShare?.isSharedPublic ? "destructive" : "default"
                }
                className={
                  !resumeToShare?.isSharedPublic
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                onClick={toggleShare}
                disabled={isSharing}
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : resumeToShare?.isSharedPublic ? (
                  t("auth.shareResume.disable")
                ) : (
                  t("auth.shareResume.enable")
                )}
              </Button>
            </div>

            {resumeToShare?.isSharedPublic && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label>{t("auth.shareResume.publicLink")}</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={getPublicUrl(resumeToShare.id)}
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="icon"
                    variant="outline"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  asChild
                  variant="link"
                  className="px-0 text-blue-600 h-auto"
                >
                  <a
                    href={getPublicUrl(resumeToShare.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("auth.shareResume.openLink")}{" "}
                    <Globe className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShareDialogOpen(false)}>
              {t("auth.shareResume.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyResume;
