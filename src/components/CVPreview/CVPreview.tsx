import React, { useRef } from "react";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import TemplateTiger from "@/templates/TemplateTiger/TemplateTiger";
import TemplateEagle from "@/templates/TemplateEagle/TemplateEagle";
import TemplateProfessional1 from "@/templates/TemplateProfessional1/TemplateProfessional1";
import TemplateProfessional2 from "@/templates/TemplateProfessional2/TemplateProfessional2";
import TemplateProfessional3 from "@/templates/TemplateProfessional3/TemplateProfessional3";
import TemplateProfessional4 from "@/templates/TemplateProfessional4/TemplateProfessional4";
import TemplateHavard1 from "@/templates/TemplateHavard1/TemplateHavard1";
import TemplateHavard2 from "@/templates/TemplateHavard2/TemplateHavard2";

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
      case "TEMPLATE-TIGER":
        return <TemplateTiger {...props} />;
      case "TEMPLATE-EAGLE":
        return <TemplateEagle {...props} />;
      case "TEMPLATE-PROFESSIONAL-1":
        return <TemplateProfessional1 {...props} />;
      case "TEMPLATE-PROFESSIONAL-2":
        return <TemplateProfessional2 {...props} />;
      case "TEMPLATE-PROFESSIONAL-3":
        return <TemplateProfessional3 {...props} />;
      case "TEMPLATE-PROFESSIONAL-4":
        return <TemplateProfessional4 {...props} />;
      case "TEMPLATE-HAVARD-1":
        return <TemplateHavard1 {...props} />;
      case "TEMPLATE-HAVARD-2":
        return <TemplateHavard2 {...props} />;
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
