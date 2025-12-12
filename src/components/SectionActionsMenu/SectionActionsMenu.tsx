import type {
  SectionType,
  ResumeData,
  ExperienceItem,
  EducationItem,
  SkillItem,
  AwardItem,
  CertificationItem,
  ProjectItem,
  ReferenceItem,
  InterestItem,
} from "@/types/resume.type";
import { useResume } from "@/context/ResumeContext/useResume";
import { Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Sections that support isHidden according to API docs
// basicInfo, objective, additionalInformation do NOT have isHidden
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

// Default empty values for each section type (for clear functionality)
type ClearableSectionType = Exclude<SectionType, "basicInfo">;

const getDefaultValue = (
  section: ClearableSectionType
): ResumeData[ClearableSectionType] => {
  const defaults: Record<
    ClearableSectionType,
    ResumeData[ClearableSectionType]
  > = {
    objective: { description: "" },
    experience: [] as ExperienceItem[],
    education: [] as EducationItem[],
    skills: [] as SkillItem[],
    awards: [] as AwardItem[],
    certifications: [] as CertificationItem[],
    interests: { isHidden: false, description: "" } as InterestItem,
    projects: [] as ProjectItem[],
    references: [] as ReferenceItem[],
  };
  return defaults[section];
};

export default function SectionActionsMenu({
  section,
}: {
  section: SectionType;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { resume, setResume } = useResume();

  const isHideable = HIDEABLE_SECTIONS.includes(section as HideableSectionType);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHideSection = () => {
    if (!isHideable) return;

    const sectionData = resume[section as HideableSectionType];

    if (Array.isArray(sectionData)) {
      // For array sections (experience, education, skills, awards, certifications, projects, references)
      const hiddenItems = sectionData.map((item) => ({
        ...item,
        isHidden: true,
      }));
      setResume({
        ...resume,
        [section]: hiddenItems,
      });
    } else if (section === "interests") {
      // For interests (single object with isHidden)
      setResume({
        ...resume,
        interests: {
          ...resume.interests,
          isHidden: true,
        },
      });
    }

    setOpen(false);
  };

  const handleClearSection = () => {
    if (section === "basicInfo") return;

    setResume({
      ...resume,
      [section]: getDefaultValue(section as ClearableSectionType),
    });
    setOpen(false);
  };

  // Don't show menu for basicInfo and objective (objective is required, can't clear)
  if (section === "basicInfo" || section === "objective") return null;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded hover:bg-gray-100 transition"
      >
        <Menu className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50">
          {isHideable && (
            <div
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
              onClick={handleHideSection}
            >
              Hide
            </div>
          )}
          <div
            className="px-4 py-2 text-sm cursor-pointer transition text-red-500 hover:bg-red-50"
            onClick={handleClearSection}
          >
            Clear
          </div>
        </div>
      )}
    </div>
  );
}
