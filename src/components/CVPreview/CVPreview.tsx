import React, { useRef } from "react";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";

interface CVPreviewProps {
  data: ResumeData;
  template: TemplateType;
}

const CVPreview = ({ data, template }: CVPreviewProps) => {
  const templateRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    const props = {
      data,
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

  // Template actual width: 900px
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cvWidth = 900; // Template actual width in pixels
        setScale(containerWidth / cvWidth);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden bg-white">
      <div
        className="bg-white origin-top-left"
        style={{
          width: "900px",
          minHeight: "1273px", // Maintain A4 aspect ratio (900 * 1.414)
          transform: `scale(${scale})`,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;
