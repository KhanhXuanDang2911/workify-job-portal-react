import {
  BadgeCheck,
  Briefcase,
  ChevronRight,
  FolderGit2,
  Gamepad2,
  GraduationCap,
  Home,
  MoveHorizontal,
  Plus,
  Target,
  Trophy,
  User,
  Users,
  Wrench,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
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

const sections = [
  {
    id: "basic-information",
    icon: User,
    label: "Basic Information",
    component: BasicInformationSection,
  },
  {
    id: "objective",
    icon: Target,
    label: "Objective",
    component: ObjectiveSection,
  },
  {
    id: "experience",
    icon: Briefcase,
    label: "Experience",
    component: ExperienceSection,
  },
  {
    id: "education",
    icon: GraduationCap,
    label: "Education",
    component: EducationSection,
  },
  { id: "skills", icon: Wrench, label: "Skills", component: SkillsSection },
  { id: "awards", icon: Trophy, label: "Awards", component: AwardsSection },
  {
    id: "certifications",
    icon: BadgeCheck,
    label: "Certifications",
    component: CertificationsSection,
  },
  {
    id: "interests",
    icon: Gamepad2,
    label: "Interests",
    component: InterestsSection,
  },
  {
    id: "projects",
    icon: FolderGit2,
    label: "Projects",
    component: ProjectsSection,
  },
  {
    id: "references",
    icon: Users,
    label: "References",
    component: ReferencesSection,
  },
];

function LeftPanel() {
  const [panelWidth, setPanelWidth] = useState(500);
  const isResizingRef = useRef(false);
  const moveRef = useRef<HTMLDivElement>(null);

  const detailRefs = useRef<Record<string, HTMLDetailsElement | null>>({});

  // eslint-disable-next-line react-hooks/refs
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

  const handleMouseDownOnMove = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(260, Math.min(e.clientX - 44, 500));
    setPanelWidth(newWidth);
    moveRef.current!.style.backgroundColor = "rgb(14 165 233)";
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    moveRef.current!.style.backgroundColor = "rgb(243 244 246)";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="h-[calc(100vh-64px)]
 inline-flex fixed top-[64px] left-0 z-100"
    >
      <div className="w-11 bg-[#eaeaec] flex flex-col items-center py-4 gap-3 z-100">
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
            "
          >
            Home
          </div>
        </div>

        {sections.map(({ id, icon: Icon, label }) => (
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
            "
            >
              {label}
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
            "
          >
            Additional information
          </div>
        </div>
      </div>

      <div
        id="panel-details"
        className="h-[calc(100vh-64px)]
 overflow-y-auto p-6 space-y-8 bg-[#F1F2F6] relative
            [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-200
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
        style={{ width: `${panelWidth}px` }}
      >
        {sections.map(({ id, label, icon: Icon, component: Component }) => (
          <details
            key={id}
            className="group border-b border-gray-400 pb-4 open:pb-6"
            ref={(el) => (detailRefs.current[id] = el)}
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                <Icon className="w-5 h-5" />
                <h2 className="text-lg font-semibold">{label}</h2>
              </div>
              <SectionActionsMenu />
            </summary>
            <div className="mt-4">
              <Component />
            </div>
          </details>
        ))}
      </div>

      <div
        ref={moveRef}
        onMouseDown={handleMouseDownOnMove}
        className={cn(
          "absolute top-1/2 -right-3 w-8 h-8 z-50 cursor-grab flex items-center justify-center bg-gray-100 rounded-full"
        )}
      >
        <MoveHorizontal strokeWidth={1} />
      </div>
    </div>
  );
}

export default LeftPanel;
