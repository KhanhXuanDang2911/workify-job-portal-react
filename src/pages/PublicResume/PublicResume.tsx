import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resumeService } from "@/services/resume.service";
import type { ResumeItem } from "@/types/resume.type";
import CVPreview from "@/components/CVPreview/CVPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Download } from "lucide-react";
import { routes } from "@/routes/routes.const";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

import { useTranslation } from "@/hooks/useTranslation";

export default function PublicResume() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPublicResume = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await resumeService.getPublicResume(id);
        if (response.data) {
          setResume(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch public resume", err);
        if (err.response?.status === 403) {
          setError(t("publicResume.errors.private"));
        } else if (err.response?.status === 404) {
          setError(t("publicResume.errors.notFound"));
        } else {
          setError(t("publicResume.errors.generic"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicResume();
  }, [id]);

  const handleDownloadPDF = async () => {
    const input = downloadRef.current;
    if (!input) {
      toast.error(t("viewResume.toast.imageLoadFailed"));
      return;
    }

    setIsDownloading(true);
    try {
      // Use PNG for lossless quality with good compression for text/graphics
      // pixelRatio 2.5 for sharper text while keeping file size reasonable
      const dataUrl = await toPng(input, {
        pixelRatio: 2.5, // 2.5x resolution - sharper than 2x, smaller than 3x
        backgroundColor: "#ffffff",
        cacheBust: true,
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

        pdf.save(`${resume?.title || "resume"}.pdf`);
        toast.success(t("viewResume.toast.downloadSuccess"));
        setIsDownloading(false);
      };

      img.onerror = () => {
        toast.error(t("viewResume.toast.imageLoadFailed"));
        setIsDownloading(false);
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(t("viewResume.toast.downloadFailed"));
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("publicResume.unavailable")}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || t("publicResume.notAvailable")}
          </p>
          <Button onClick={() => navigate(routes.BASE)}>
            {t("publicResume.goHome")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(routes.BASE)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("publicResume.home")}
          </Button>
          <span className="text-sm text-gray-400">|</span>
          <h1 className="text-sm font-medium text-gray-800 truncate max-w-[200px] sm:max-w-md">
            {resume.title}
          </h1>
        </div>
        <div>
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("publicResume.downloading")}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t("publicResume.downloadPDF")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
        <div
          ref={downloadRef}
          className="w-full max-w-[210mm] bg-white shadow-lg min-h-[297mm]"
        >
          <CVPreview
            data={resume.data}
            template={resume.template}
            fontFamily={resume.fontFamily}
          />
        </div>
      </div>
    </div>
  );
}
