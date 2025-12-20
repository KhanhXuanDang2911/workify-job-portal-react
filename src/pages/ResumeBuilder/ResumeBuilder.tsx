import { getFontFamilyName } from "@/utils/font.utils";
import RightPanel from "@/components/RightPanel";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import { useResume } from "@/context/Resume/useResume";
import LeftPanel from "@/components/LeftPanel";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import TemplateTiger from "@/templates/TemplateTiger/TemplateTiger";
import TemplateEagle from "@/templates/TemplateEagle/TemplateEagle";
import TemplateProfessional1 from "@/templates/TemplateProfessional1/TemplateProfessional1";
import TemplateProfessional2 from "@/templates/TemplateProfessional2/TemplateProfessional2";
import TemplateProfessional3 from "@/templates/TemplateProfessional3/TemplateProfessional3";
import TemplateProfessional4 from "../../templates/TemplateProfessional4/TemplateProfessional4";
import TemplateHavard1 from "@/templates/TemplateHavard1/TemplateHavard1";
import TemplateHavard2 from "@/templates/TemplateHavard2/TemplateHavard2";
import { useParams, useNavigate } from "react-router-dom";
import type { TemplateType } from "@/types/resume.type";
import {
  templatePandaDummyVi,
  templatePandaDummyEn,
} from "@/templates/TemplatePanda/dummy";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Edit3, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  templateRabbitDummyVi,
  templateRabbitDummyEn,
} from "@/templates/TemplateRabbit/dummy";
import {
  templateLionDummyVi,
  templateLionDummyEn,
} from "@/templates/TemplateLion/dummy";
import {
  templateDolphinDummyVi,
  templateDolphinDummyEn,
} from "@/templates/TemplateDolphin/dummy";
import {
  templateTigerDummyVi,
  templateTigerDummyEn,
} from "@/templates/TemplateTiger/dummy";
import {
  templateEagleDummyVi,
  templateEagleDummyEn,
} from "@/templates/TemplateEagle/dummy";
import {
  templateProfessional1DummyVi,
  templateProfessional1DummyEn,
} from "@/templates/TemplateProfessional1/dummy";
import {
  templateProfessional2DummyVi,
  templateProfessional2DummyEn,
} from "@/templates/TemplateProfessional2/dummy";
import {
  templateProfessional3DummyVi,
  templateProfessional3DummyEn,
} from "@/templates/TemplateProfessional3/dummy";
import {
  templateProfessional4DummyVi,
  templateProfessional4DummyEn,
} from "../../templates/TemplateProfessional4/dummy";
import {
  templateHavard1DummyVi,
  templateHavard1DummyEn,
} from "@/templates/TemplateHavard1/dummy";
import {
  templateHavard2DummyVi,
  templateHavard2DummyEn,
} from "@/templates/TemplateHavard2/dummy";
import { useSearchParams } from "react-router-dom";

function ResumeBuilder() {
  const { t } = useTranslation();
  const { template: templateParam, id: idParam } = useParams<{
    template?: string;
    id?: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    resume,
    setResume,
    resumeName,
    setResumeName,
    template,
    setTemplate,
    fontFamily,
  } = useResume();

  const templateRef = useRef<HTMLDivElement>(null);

  const getTemplateDummyData = (templateType: TemplateType, lang: string) => {
    const isEnglish = lang.startsWith("en");
    const dummyDataMap: Record<TemplateType, typeof templatePandaDummyVi> =
      isEnglish
        ? {
            "TEMPLATE-PANDA": templatePandaDummyEn,
            "TEMPLATE-RABBIT": templateRabbitDummyEn,
            "TEMPLATE-LION": templateLionDummyEn,
            "TEMPLATE-DOLPHIN": templateDolphinDummyEn,
            "TEMPLATE-TIGER": templateTigerDummyEn,
            "TEMPLATE-EAGLE": templateEagleDummyEn,
            "TEMPLATE-PROFESSIONAL-1": templateProfessional1DummyEn,
            "TEMPLATE-PROFESSIONAL-2": templateProfessional2DummyEn,
            "TEMPLATE-PROFESSIONAL-3": templateProfessional3DummyEn,
            "TEMPLATE-PROFESSIONAL-4": templateProfessional4DummyEn,
            "TEMPLATE-HAVARD-1": templateHavard1DummyEn,
            "TEMPLATE-HAVARD-2": templateHavard2DummyEn,
          }
        : {
            "TEMPLATE-PANDA": templatePandaDummyVi,
            "TEMPLATE-RABBIT": templateRabbitDummyVi,
            "TEMPLATE-LION": templateLionDummyVi,
            "TEMPLATE-DOLPHIN": templateDolphinDummyVi,
            "TEMPLATE-TIGER": templateTigerDummyVi,
            "TEMPLATE-EAGLE": templateEagleDummyVi,
            "TEMPLATE-PROFESSIONAL-1": templateProfessional1DummyVi,
            "TEMPLATE-PROFESSIONAL-2": templateProfessional2DummyVi,
            "TEMPLATE-PROFESSIONAL-3": templateProfessional3DummyVi,
            "TEMPLATE-PROFESSIONAL-4": templateProfessional4DummyVi,
            "TEMPLATE-HAVARD-1": templateHavard1DummyVi,
            "TEMPLATE-HAVARD-2": templateHavard2DummyVi,
          };
    return dummyDataMap[templateType];
  };

  useEffect(() => {
    if (idParam) {
      return;
    }

    if (templateParam) {
      const uppercaseTemplate = templateParam.toUpperCase() as TemplateType;
      const validTemplates: TemplateType[] = [
        "TEMPLATE-PANDA",
        "TEMPLATE-RABBIT",
        "TEMPLATE-LION",
        "TEMPLATE-DOLPHIN",
        "TEMPLATE-TIGER",
        "TEMPLATE-EAGLE",
        "TEMPLATE-PROFESSIONAL-1",
        "TEMPLATE-PROFESSIONAL-2",
        "TEMPLATE-PROFESSIONAL-3",
        "TEMPLATE-PROFESSIONAL-4",
        "TEMPLATE-HAVARD-1",
        "TEMPLATE-HAVARD-2",
      ];
      if (validTemplates.includes(uppercaseTemplate)) {
        setTemplate(uppercaseTemplate);

        const lang = searchParams.get("lang") || "vi";
        const dummyData = getTemplateDummyData(uppercaseTemplate, lang);

        setResume({
          ...dummyData,
          basicInfo: {
            ...dummyData.basicInfo,
            profilePhoto: "/default-avatar.png",
          },
        });
      } else {
        navigate("/404", { replace: true });
      }
    } else {
      navigate("/templates-cv", { replace: true });
    }
  }, [templateParam, idParam, setTemplate, setResume, navigate, searchParams]);
  useEffect(() => {
    updateHeightTransformComponent(1300);
  }, [template]);

  const transformComponentRef = useRef<HTMLDivElement>(null);

  const [transformWrapperBgMode, setTransformWrapperBgMode] = useState<
    "light" | "dark"
  >("dark");
  const [scale, setScale] = useState(1);
  const [activeMobileTab, setActiveMobileTab] = useState<"editor" | "preview">(
    "editor"
  );

  const transformWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!transformWrapperRef.current) return;

      const wrapperWidth = transformWrapperRef.current.clientWidth;

      const padding = 32;
      const availableWidth = wrapperWidth - padding;

      const newScale = Math.min(availableWidth / 900, 1);

      setScale(newScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (transformWrapperRef.current) {
      observer.observe(transformWrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [contentHeight, setContentHeight] = useState(1273);

  const updateHeightTransformComponent = (newHeight: number) => {
    setContentHeight(newHeight);
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

  const {
    saveResume: saveResumeFromContext,
    isSaving: isSavingFromContext,
    validateResume,
    isLoading,
  } = useResume();

  const handleSaveFromHeader = async () => {
    if (!validateResume()) {
      return;
    }

    await saveResumeFromContext();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Header with CV name and action buttons */}
      <div
        className={cn(
          "fixed top-0 lg:top-[64px] left-0 right-0 lg:left-[320px] xl:left-[544px] lg:right-[44px] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-50 shadow-sm transition-all duration-300",
          activeMobileTab === "preview" ? "lg:flex hidden" : "flex"
        )}
      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder={t("resumeBuilder.toolbar.untitledResume")}
            className="text-lg lg:text-xl font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-cyan-600 focus:outline-none px-1 py-0.5 w-full lg:min-w-[200px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2 bg-cyan-950 hover:bg-cyan-700 whitespace-nowrap"
            onClick={handleSaveFromHeader}
            disabled={isSavingFromContext}
          >
            {isSavingFromContext ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isSavingFromContext
                ? t("common.loading")
                : t("resumeBuilder.toolbar.save")}
            </span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "transition-opacity duration-300",
          activeMobileTab === "preview" ? "hidden lg:block" : "block"
        )}
      >
        <LeftPanel />
        <RightPanel
          setTransformWrapperBgMode={setTransformWrapperBgMode}
          transformWrapperBgMode={transformWrapperBgMode}
        />
      </div>

      <div
        id="transform-wrapper"
        ref={transformWrapperRef}
        className={cn(
          "fixed bottom-0 overflow-auto pt-8 pb-20 lg:pb-8 px-4 transition-all duration-300",
          transformWrapperBgMode === "light" ? "bg-[#FAFAFA]" : "bg-[#414141]",

          "lg:top-[128px] lg:left-[320px] xl:left-[544px] lg:right-[44px]",

          "top-0 left-0 right-0 z-40",
          activeMobileTab === "editor" ? "hidden lg:block" : "block",

          "pb-32"
        )}
      >
        <div
          id="transform-component"
          ref={transformComponentRef}
          className="bg-white shadow-2xl [&_*]:!select-text [&_*]:!cursor-text mx-auto origin-top-left transition-all duration-200"
          style={{
            width: "900px",
            height: `${contentHeight}px`,
            minHeight: "1273px",
            userSelect: "text",
            cursor: "text",
            transform: `scale(${scale})`,
            fontFamily: getFontFamilyName(fontFamily),

            marginBottom: `-${contentHeight * (1 - scale)}px`,
            marginRight: `-${900 * (1 - scale)}px`,

            marginTop: window.innerWidth < 1024 ? "60px" : "0",
          }}
        >
          {isLoading ? (
            <TemplateSkeleton />
          ) : (
            <>
              {template === "TEMPLATE-PANDA" && (
                <TemplatePanda
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-RABBIT" && (
                <TemplateRabbit
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-LION" && (
                <TemplateLion
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-DOLPHIN" && (
                <TemplateDolphin
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-TIGER" && (
                <TemplateTiger
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-EAGLE" && (
                <TemplateEagle
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-PROFESSIONAL-1" && (
                <TemplateProfessional1
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-PROFESSIONAL-2" && (
                <TemplateProfessional2
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-PROFESSIONAL-3" && (
                <TemplateProfessional3
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-PROFESSIONAL-4" && (
                <TemplateProfessional4
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-HAVARD-1" && (
                <TemplateHavard1
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
              {template === "TEMPLATE-HAVARD-2" && (
                <TemplateHavard2
                  data={resume}
                  ref={templateRef}
                  onUpdateHeight={(value) =>
                    updateHeightTransformComponent(value)
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex lg:hidden z-50">
        <button
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            activeMobileTab === "editor"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-900"
          )}
          onClick={() => setActiveMobileTab("editor")}
        >
          <Edit3 className="w-5 h-5" />
          Editor
        </button>
        <button
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            activeMobileTab === "preview"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-900"
          )}
          onClick={() => setActiveMobileTab("preview")}
        >
          <Eye className="w-5 h-5" />
          Preview
        </button>
      </div>
    </div>
  );
}

function TemplateSkeleton() {
  return (
    <div
      className="w-full h-full p-8 space-y-8 bg-white"
      style={{ minHeight: "1300px" }}
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-4 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
