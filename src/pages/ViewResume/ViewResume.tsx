import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { resumeService } from "@/services/resume.service";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import { Download, Edit } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { routes } from "@/routes/routes.const";

const ViewResume = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const templateRef = useRef<HTMLDivElement>(null);

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<TemplateType>("TEMPLATE-PANDA");
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume(Number(id));
    } else {
      navigate(`/${routes.MY_RESUME}`);
    }
  }, [id, navigate]);

  const fetchResume = async (id: number) => {
    try {
      const res = await resumeService.getResumeById(id);
      if (res.data) {
        setResume(res.data.data);
        setTemplate(res.data.template);
        setResumeName(res.data.title);
      }
    } catch (error) {
      console.error("Failed to load resume", error);
      toast.error("Failed to load resume");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const input = templateRef.current;
    if (!input) return;

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

        pdf.save(`${resumeName}.pdf`);
        toast.success("Downloaded CV as PDF");
        setIsDownloading(false);
      };

      img.onerror = () => {
        toast.error("Failed to load image for PDF");
        setIsDownloading(false);
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to download PDF");
      setIsDownloading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/${routes.CREATE_RESUME}/edit/${id}`);
    }
  };

  const renderTemplate = () => {
    if (!resume) return null;

    const props = {
      data: resume,
      ref: templateRef,
      onUpdateHeight: () => {},
    };

    switch (template) {
      case "TEMPLATE-PANDA":
        return <TemplatePanda {...props} />;
      case "TEMPLATE-RABBIT":
        return <TemplateRabbit {...props} />;
      case "TEMPLATE-LION":
        return <TemplateLion {...props} />;
      case "TEMPLATE-DOLPHIN":
        return <TemplateDolphin {...props} />;
      default:
        return <TemplatePanda {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              Xem CV Online của {resume?.basicInfo?.fullName || "User"}
            </h1>
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-white text-teal-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Đang tải..." : "Tải CV PDF"}
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-white text-teal-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Sửa CV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - CV hiển thị thẳng trên background */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-white shadow-2xl [&_*]:!select-text [&_*]:!cursor-text"
          style={{
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
            userSelect: "text",
            cursor: "text",
          }}
        >
          {renderTemplate()}
        </div>
      </main>
    </div>
  );
};

export default ViewResume;
