import {
  BadgeCheck,
  Briefcase,
  ChevronRight,
  Eye,
  FolderGit2,
  Gamepad2,
  GraduationCap,
  Home,
  Plus,
  Target,
  Trophy,
  User,
  Users,
  Wrench,
} from "lucide-react";

import { useRef } from "react";
import BasicInformationSection from "@/components/sections/BasicInformationSection";
import ObjectiveSection from "@/components/sections/ObjectiveSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AwardsSection from "@/components/sections/AwardsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import InterestsSection from "@/components/sections/InterestsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ReferencesSection from "@/components/sections/ReferencesSection";
import SectionActionsMenu from "@/components/SectionActionsMenu";
import ExperienceSection from "@/components/sections/ExperienceSection";
import type { SectionType } from "@/types/resume.type";
import { useTranslation } from "@/hooks/useTranslation";
import { useResume } from "@/context/Resume/useResume";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sections: {
  id: SectionType;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  labelKey: string;
  component: React.ComponentType;
}[] = [
  {
    id: "basicInfo",
    icon: User,
    labelKey: "resumeBuilder.sections.basicInfo",
    component: BasicInformationSection,
  },
  {
    id: "objective",
    icon: Target,
    labelKey: "resumeBuilder.sections.objective",
    component: ObjectiveSection,
  },
  {
    id: "experience",
    icon: Briefcase,
    labelKey: "resumeBuilder.sections.experience",
    component: ExperienceSection,
  },
  {
    id: "education",
    icon: GraduationCap,
    labelKey: "resumeBuilder.sections.education",
    component: EducationSection,
  },
  {
    id: "skills",
    icon: Wrench,
    labelKey: "resumeBuilder.sections.skills",
    component: SkillsSection,
  },
  {
    id: "awards",
    icon: Trophy,
    labelKey: "resumeBuilder.sections.awards",
    component: AwardsSection,
  },
  {
    id: "certifications",
    icon: BadgeCheck,
    labelKey: "resumeBuilder.sections.certifications",
    component: CertificationsSection,
  },
  {
    id: "interests",
    icon: Gamepad2,
    labelKey: "resumeBuilder.sections.interests",
    component: InterestsSection,
  },
  {
    id: "projects",
    icon: FolderGit2,
    labelKey: "resumeBuilder.sections.projects",
    component: ProjectsSection,
  },
  {
    id: "references",
    icon: Users,
    labelKey: "resumeBuilder.sections.references",
    component: ReferencesSection,
  },
];

type HideableSectionType =
  | "experience"
  | "education"
  | "skills"
  | "awards"
  | "certifications"
  | "projects"
  | "references"
  | "interests";

const HIDEABLE_SECTIONS: HideableSectionType[] = [
  "experience",
  "education",
  "skills",
  "awards",
  "certifications",
  "projects",
  "references",
  "interests",
];

function LeftPanel() {
  const { t } = useTranslation();
  const { resumeId, resume, setResume } = useResume();
  const isEditMode = !!resumeId;

  const detailRefs = useRef<Record<string, HTMLDetailsElement | null>>({});

  sections.forEach(({ id }) => {
    detailRefs.current[id] = detailRefs.current[id] || null;
  });

  const openAndScrollToSection = (id: string) => {
    const detailEl = detailRefs.current[id];
    if (!detailEl) return;

    if (!detailEl.open) {
      detailEl.open = true;
    }

    detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isSectionHidden = (sectionId: SectionType): boolean => {
    if (!HIDEABLE_SECTIONS.includes(sectionId as HideableSectionType)) {
      return false;
    }

    const sectionData = resume[sectionId as HideableSectionType];

    if (sectionId === "interests") {
      return resume.interests?.isHidden ?? false;
    }

    if (Array.isArray(sectionData)) {
      if (sectionData.length === 0) return false;
      return sectionData.every((item) => item.isHidden);
    }

    return false;
  };

  const unhideSection = (sectionId: SectionType) => {
    if (!HIDEABLE_SECTIONS.includes(sectionId as HideableSectionType)) return;

    const sectionData = resume[sectionId as HideableSectionType];

    if (sectionId === "interests") {
      setResume({
        ...resume,
        interests: {
          ...resume.interests,
          isHidden: false,
        },
      });
      return;
    }

    if (Array.isArray(sectionData)) {
      const unhiddenItems = sectionData.map((item) => ({
        ...item,
        isHidden: false,
      }));
      setResume({
        ...resume,
        [sectionId]: unhiddenItems,
      });
    }
  };

  return (
    <div
      className="h-[calc(100dvh-64px)] lg:h-[calc(100vh-64px)] 
 flex lg:fixed lg:top-[64px] top-[64px] lg:left-0 left-0 w-full lg:w-auto z-40 bg-white lg:bg-transparent pr-11 lg:pr-0"
    >
      <div className="w-11 bg-[#eaeaec] flex flex-col items-center py-4 gap-3 z-50 h-full border-r lg:border-none">
        <div className="relative group cursor-pointer hover:bg-gray-300 p-2 rounded-full">
          <Home className=" w-4 h-4" strokeWidth={1} />
          <div
            className="
              absolute left-11 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              pointer-events-none
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center
              py-1 px-3 rounded-sm whitespace-nowrap shadow-lg
              z-50
            "
          >
            Home
          </div>
        </div>

        {sections.map(({ id, icon: Icon, labelKey }) => (
          <div
            key={id}
            className="relative group cursor-pointer hover:bg-gray-300 p-2 rounded-full"
            onClick={() => openAndScrollToSection(id)}
          >
            <Icon className=" w-4 h-4" strokeWidth={1} />
            <div
              className="
              absolute left-11 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              pointer-events-none
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center
              py-1 px-3 rounded-sm whitespace-nowrap shadow-lg
               z-50
            "
            >
              {t(labelKey)}
            </div>
          </div>
        ))}
        <div className="relative group cursor-pointer hover:bg-gray-300 p-2 rounded-full border border-gray-500">
          <Plus className=" w-4 h-4" strokeWidth={1} />
          <div
            className="
              absolute left-11 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center
              py-1 px-3 rounded-sm whitespace-nowrap shadow-lg
               z-50
            "
          >
            Additional information
          </div>
        </div>
      </div>

      <div
        id="panel-details"
        className="h-full
 overflow-y-auto p-4 xl:p-6 space-y-6 xl:space-y-8 bg-[#F1F2F6] relative
            [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-200
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  flex-1 w-0 min-w-0 lg:w-[276px] xl:w-[500px]"
      >
        {sections.map(({ id, labelKey, icon: Icon, component: Component }) => {
          const isHidden = isSectionHidden(id);

          return (
            <details
              key={id}
              className={cn(
                "group border-b border-gray-400 pb-4 open:pb-6",
                isHidden && "opacity-60"
              )}
              ref={(el) => {
                detailRefs.current[id] = el;
              }}
              open={isEditMode}
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                  <Icon
                    className={cn("w-5 h-5", isHidden && "text-gray-400")}
                  />
                  <h2
                    className={cn(
                      "text-lg font-semibold",
                      isHidden && "text-gray-400 line-through"
                    )}
                  >
                    {t(labelKey)}
                  </h2>
                  {isHidden && (
                    <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">
                      {t("resumeBuilder.sections.hidden")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {isHidden && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        unhideSection(id);
                      }}
                      className="h-8 px-2 text-xs hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t("resumeBuilder.actions.show")}
                    </Button>
                  )}
                  <SectionActionsMenu section={id} />
                </div>
              </summary>
              <div
                className={cn(
                  "mt-4",
                  isHidden && "pointer-events-none opacity-50"
                )}
              >
                <Component />
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

export default LeftPanel;
