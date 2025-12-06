import RightPanel from "@/components/RightPanel";
import { FileText } from "lucide-react";
import Toolbar from "@/components/Toolbar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useResume } from "@/context/ResumeContext/useResume";
import LeftPanel from "@/components/LeftPanel";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";

const TRANSFORM_COMPONENT_DEFAULT_STYLE = {
  width: "900px",
  height: "1300px",
  top: 74,
  left: 560,
  transform: "scale(1)",
};

function ResumeBuilder() {
  const { resume, setResume, setResumeName, resumeName, template } =
    useResume();
  console.log(resume);
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResume((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        avatarUrl: "default-avatar.jpg",
      },
    }));
  }, []);

  useEffect(() => {
    updateHeightTransformComponent(1300);
  }, [template]);

  const transformComponentRef = useRef<HTMLDivElement>(null); // tham chiếu đến vùng làm việc

  const isDragging = useRef(false); // lưu trạng thái đang kéo hay không
  const startX = useRef(0); // vị trí chuột khi bắt đầu kéo
  const startY = useRef(0);
  const originX = useRef(0); //vị trí hiện tại của work area
  const originY = useRef(0);
  const scale = useRef(1); // trạng thái scale hiện tại

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transformWrapperBgMode, setTransformWrapperBgMode] = useState<
    "light" | "dark"
  >("dark");

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const transformComponent = transformComponentRef.current;
    startX.current = e.clientX;
    startY.current = e.clientY;
    if (transformComponent) {
      transformComponent.style.cursor = "grabbing";

      const matrix = new DOMMatrixReadOnly(
        getComputedStyle(transformComponent).transform
      );
      originX.current = matrix.m41;
      originY.current = matrix.m42;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    const transformComponent = transformComponentRef.current;
    if (transformComponent)
      transformComponent.style.transform = `translate(${originX.current + dx}px, ${originY.current + dy}px) scale(${scale.current})`;
    if (templateRef.current)
      templateRef.current.style.outline = "4px solid #3b82f6";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    const transformComponent = transformComponentRef.current;
    if (transformComponent) transformComponent.style.cursor = "grab";
    if (templateRef.current) templateRef.current.style.outline = "none";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const zoomSpeed = 0.1;
    const transformComponent = transformComponentRef.current;

    if (!transformComponent) return;

    if (e.deltaY < 0) {
      // cuộn lên
      scale.current = Math.min(scale.current + zoomSpeed, 4);
    } else {
      // cuộn xuống
      scale.current = Math.max(scale.current - zoomSpeed, 0.1);
    }

    // cập nhật transform
    const matrix = new DOMMatrixReadOnly(
      getComputedStyle(transformComponent).transform
    );
    const x = matrix.m41;
    const y = matrix.m42;

    transformComponent.style.transform = `
      translate(${x}px, ${y}px)
      scale(${scale.current})
    `;
  };

  const updateHeightTransformComponent = (newHeight: number) => {
    const transformComponent = transformComponentRef.current;
    if (transformComponent) {
      transformComponent.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  /** 
      Các function cho Toolbar
  **/
  const handleDownloadAsPDF = async () => {
    const input = templateRef.current;
    if (!input) return;

    try {
      const dataUrl = await toPng(input, { cacheBust: true, quality: 1 });
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Scale ảnh theo chiều ngang
        const ratio = pdfWidth / img.width;
        const imgHeightScaled = img.height * ratio;

        // Nếu ảnh dài hơn 1 trang, chia ra nhiều trang
        let position = 0;
        while (position < imgHeightScaled) {
          const heightLeft = imgHeightScaled - position;
          const pageHeight = Math.min(pdfHeight, heightLeft);

          pdf.addImage(img, "PNG", 0, -position, pdfWidth, imgHeightScaled);

          position += pdfHeight;
          if (position < imgHeightScaled) pdf.addPage();
        }

        pdf.save(`${resumeName}.pdf`);
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleResetSize = () => {
    const transformComponent = transformComponentRef.current;
    if (transformComponent) {
      scale.current = 1;
      transformComponent.style.transform = `translate(0px, 0px) scale(1)`;
    }
  };

  return (
    <>
      <LeftPanel />
      <RightPanel
        setTransformWrapperBgMode={setTransformWrapperBgMode}
        transformWrapperBgMode={transformWrapperBgMode}
      />
      <Toolbar onDownload={handleDownloadAsPDF} onResetSize={handleResetSize} />

      <div className="flex fixed px-5 py-2 top-[64px] left-1/2 -translate-x-1/2 rounded-b-xl flex-row items-center gap-3 bg-[#F1F2F6] z-100">
        <FileText />
        <input
          type="text"
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          className="bg-[#F1F2F6] text-xl font-semibold h-[46px] pl-4 rounded-lg w-[300px] outline-0  "
          placeholder="CV chưa đặt tên"
        />
      </div>

      <div
        id="transform-wrapper"
        className={cn(
          "fixed inset-0 overflow-hidden ",
          transformWrapperBgMode === "light" ? "bg-[#FAFAFA]" : "bg-[#414141]"
        )}
        style={{ width: "2000px", height: "2000px" }}
        onWheel={handleWheel}
      >
        <div
          id="transform-component"
          ref={transformComponentRef}
          onMouseDown={handleMouseDown}
          className="absolute bg-white shadow"
          style={{
            ...TRANSFORM_COMPONENT_DEFAULT_STYLE,
            cursor: "grab",
            transformOrigin: "center",
          }}
        >
          {template === "TEMPLATE-PANDA" && (
            <TemplatePanda
              data={resume}
              ref={templateRef}
              onUpdateHeight={(value) => updateHeightTransformComponent(value)}
            />
          )}
          {template === "TEMPLATE-RABBIT" && (
            <TemplateRabbit
              data={resume}
              ref={templateRef}
              onUpdateHeight={(value) => updateHeightTransformComponent(value)}
            />
          )}
          {template === "TEMPLATE-LION" && (
            <TemplateLion
              data={resume}
              ref={templateRef}
              onUpdateHeight={(value) => updateHeightTransformComponent(value)}
            />
          )}
          {template === "TEMPLATE-DOLPHIN" && (
            <TemplateDolphin
              data={resume}
              ref={templateRef}
              onUpdateHeight={(value) => updateHeightTransformComponent(value)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ResumeBuilder;
