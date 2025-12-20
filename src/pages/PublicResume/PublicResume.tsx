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
      const images = input.querySelectorAll("img");
      const imagePromises = Array.from(images).map(async (img) => {
        if (img.src.startsWith("data:")) return;

        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = base64;
        } catch (e) {}
      });

      await Promise.all(imagePromises);

      const dataUrl = await toPng(input, {
        pixelRatio: 2.5,
        backgroundColor: "#ffffff",
        cacheBust: false,
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        const imgWidth = img.width / 2.5;
        const imgHeight = img.height / 2.5;

        const scale = A4_WIDTH / imgWidth;
        const scaledHeight = imgHeight * scale;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [A4_WIDTH, Math.max(scaledHeight, A4_HEIGHT)],
          compress: true,
        });

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
