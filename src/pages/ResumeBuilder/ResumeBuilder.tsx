import RightPanel from "@/components/RightPanel";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import { useResume } from "@/context/ResumeContext/useResume";
import LeftPanel from "@/components/LeftPanel";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import { useParams, useNavigate } from "react-router-dom";
import type { TemplateType } from "@/types/resume.type";
import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { templateRabbitDummy } from "@/templates/TemplateRabbit/dummy";
import { templateLionDummy } from "@/templates/TemplateLion/dummy";
import { templateDolphinDummy } from "@/templates/TemplateDolphin/dummy";

function ResumeBuilder() {
  const { t } = useTranslation();
  const { template: templateParam, id: idParam } = useParams<{
    template?: string;
    id?: string;
  }>();
  const navigate = useNavigate();
  const {
    resume,
    setResume,
    resumeName,
    setResumeName,
    template,
    setTemplate,
  } = useResume();
  console.log(resume);
  const templateRef = useRef<HTMLDivElement>(null);

  // Map template slug to dummy data
  const getTemplateDummyData = (templateType: TemplateType) => {
    const dummyDataMap: Record<TemplateType, typeof templatePandaDummy> = {
      "TEMPLATE-PANDA": templatePandaDummy,
      "TEMPLATE-RABBIT": templateRabbitDummy,
      "TEMPLATE-LION": templateLionDummy,
      "TEMPLATE-DOLPHIN": templateDolphinDummy,
    };
    return dummyDataMap[templateType];
  };

  // Load CV from ID (edit mode) or create new from template
  useEffect(() => {
    // If ID exists in path param, ResumeProvider will handle loading
    if (idParam) {
      // ResumeProvider already loads data via resumeId from context
      return;
    }

    // Create new CV from template
    if (templateParam) {
      const uppercaseTemplate = templateParam.toUpperCase() as TemplateType;
      const validTemplates: TemplateType[] = [
        "TEMPLATE-PANDA",
        "TEMPLATE-RABBIT",
        "TEMPLATE-LION",
        "TEMPLATE-DOLPHIN",
      ];
      if (validTemplates.includes(uppercaseTemplate)) {
        setTemplate(uppercaseTemplate);
        const dummyData = getTemplateDummyData(uppercaseTemplate);
        setResume(dummyData);
      } else {
        navigate("/404", { replace: true });
      }
    } else {
      // No template and no ID, redirect to templates page
      navigate("/templates-cv", { replace: true });
    }
  }, [templateParam, idParam, setTemplate, setResume, navigate]);
  useEffect(() => {
    updateHeightTransformComponent(1300);
  }, [template]);

  const transformComponentRef = useRef<HTMLDivElement>(null);

  const [transformWrapperBgMode, setTransformWrapperBgMode] = useState<
    "light" | "dark"
  >("dark");

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

  // Get resume context for header
  const {
    saveResume: saveResumeFromContext,
    isSaving: isSavingFromContext,
    validateResume,
  } = useResume();

  const handleSaveFromHeader = async () => {
    // Validate using context validation
    if (!validateResume()) {
      return;
    }

    await saveResumeFromContext();
  };

  return (
    <>
      {/* Header with CV name and action buttons */}
      <div className="fixed top-[64px] left-[320px] xl:left-[544px] right-[44px] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder={t("resumeBuilder.toolbar.untitledResume")}
            className="text-xl font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-cyan-600 focus:outline-none px-1 py-0.5 min-w-[200px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2 bg-cyan-950 hover:bg-cyan-700"
            onClick={handleSaveFromHeader}
            disabled={isSavingFromContext}
          >
            {isSavingFromContext ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSavingFromContext
              ? t("common.loading")
              : t("resumeBuilder.toolbar.save")}
          </Button>
        </div>
      </div>

      <LeftPanel />
      <RightPanel
        setTransformWrapperBgMode={setTransformWrapperBgMode}
        transformWrapperBgMode={transformWrapperBgMode}
      />

      <div
        id="transform-wrapper"
        className={cn(
          "fixed bottom-0 overflow-auto pt-8 pb-8 px-4",
          transformWrapperBgMode === "light" ? "bg-[#FAFAFA]" : "bg-[#414141]",
          "top-[128px] left-[320px] xl:left-[544px] right-[44px]"
        )}
      >
        <div
          id="transform-component"
          ref={transformComponentRef}
          className="bg-white shadow-2xl [&_*]:!select-text [&_*]:!cursor-text mx-auto"
          style={{
            width: "900px", // Match template actual width
            minHeight: "1273px", // A4 aspect ratio (900 * 1.414)
            userSelect: "text",
            cursor: "text",
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
