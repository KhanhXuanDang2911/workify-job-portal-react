import {
  Aperture,
  Edit3,
  MoonStar,
  Palette,
  Sun,
  Type,
  X,
  type LucideProps,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type RefObject,
  type SetStateAction,
} from "react";

import gsap from "gsap";
import CustomColorPicker from "@/components/CustomColorPicker";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import type {
  FontFamily,
  ResumeData,
  TemplateType,
  Theme,
} from "@/types/resume.type";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import { cn } from "@/lib/utils";
import { useResume } from "@/context/Resume/useResume";
import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { templateRabbitDummy } from "@/templates/TemplateRabbit/dummy";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import { templateLionDummy } from "@/templates/TemplateLion/dummy";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import { templateDolphinDummy } from "@/templates/TemplateDolphin/dummy";
import TemplateTiger from "@/templates/TemplateTiger/TemplateTiger";
import { templateTigerDummy } from "@/templates/TemplateTiger/dummy";
import TemplateEagle from "@/templates/TemplateEagle/TemplateEagle";
import { templateEagleDummy } from "@/templates/TemplateEagle/dummy";
import TemplateProfessional1 from "@/templates/TemplateProfessional1/TemplateProfessional1";
import { templateProfessional1Dummy } from "@/templates/TemplateProfessional1/dummy";
import TemplateProfessional2 from "@/templates/TemplateProfessional2/TemplateProfessional2";
import { templateProfessional2Dummy } from "@/templates/TemplateProfessional2/dummy";
import TemplateHavard1 from "@/templates/TemplateHavard1/TemplateHavard1";
import { templateHavard1Dummy } from "@/templates/TemplateHavard1/dummy";
import TemplateHavard2 from "@/templates/TemplateHavard2/TemplateHavard2";
import { templateHavard2Dummy } from "@/templates/TemplateHavard2/dummy";
import TemplateProfessional3 from "@/templates/TemplateProfessional3/TemplateProfessional3";
import { templateProfessional3Dummy } from "@/templates/TemplateProfessional3/dummy";
import TemplateProfessional4 from "@/templates/TemplateProfessional4/TemplateProfessional4";
import { templateProfessional4Dummy } from "@/templates/TemplateProfessional4/dummy";
import { useTranslation } from "@/hooks/useTranslation";

type TabKey = "template" | "theme" | "font";

const tabMapConfig: Record<
  TabKey,
  {
    labelKey: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }
> = {
  template: { labelKey: "resumeBuilder.tabs.template", icon: Aperture },
  theme: { labelKey: "resumeBuilder.tabs.theme", icon: Palette },
  font: { labelKey: "resumeBuilder.tabs.font", icon: Type },
};

function RightPanel({
  transformWrapperBgMode,
  setTransformWrapperBgMode,
}: {
  transformWrapperBgMode: "light" | "dark";
  setTransformWrapperBgMode: Dispatch<SetStateAction<"light" | "dark">>;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  return (
    <>
      <div className="fixed top-[64px] right-0 h-[calc(100dvh-64px)] lg:h-[calc(100vh-64px)] inline-flex z-50 lg:z-100">
        <DetailsPanelActions
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
        />
        <div className="w-16 bg-white shadow-2xl border-l border-gray-100 flex flex-col items-center justify-between py-6 gap-4 z-50">
          <div className="flex flex-col items-center gap-4">
            {Object.entries(tabMapConfig).map(
              ([key, { labelKey, icon: Icon }]) => (
                <div
                  key={key}
                  className={cn(
                    "relative group cursor-pointer p-3 rounded-xl transition-all duration-300 ease-out border-2",
                    activeTab === key
                      ? "bg-teal-600 text-white border-teal-600 shadow-lg ring-2 ring-teal-200 ring-offset-2 scale-110"
                      : "bg-teal-50 text-teal-600 border-teal-50 hover:border-teal-200 hover:shadow-md"
                  )}
                  onClick={() => setActiveTab(key as TabKey)}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={activeTab === key ? 2 : 1.5}
                  />
                  <div
                    className="
              absolute right-14 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              pointer-events-none
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center font-medium
              py-1.5 px-3 rounded-md whitespace-nowrap shadow-xl z-50
            "
                  >
                    {t(labelKey)}
                    {/* Arrow for tooltip */}
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                  </div>
                </div>
              )
            )}
          </div>

          <div
            className={cn(
              "relative group cursor-pointer p-3 rounded-xl transition-all duration-300 border-2",
              transformWrapperBgMode === "dark"
                ? "bg-slate-800 text-yellow-400 border-slate-800 shadow-md ring-2 ring-slate-200 ring-offset-2"
                : "bg-orange-50 text-orange-500 border-orange-50 hover:border-orange-200 hover:shadow-md"
            )}
            onClick={() =>
              setTransformWrapperBgMode(
                transformWrapperBgMode === "light" ? "dark" : "light"
              )
            }
          >
            {transformWrapperBgMode === "light" ? (
              <Sun className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <MoonStar className="w-5 h-5" strokeWidth={1.5} />
            )}
            <div
              className="
              absolute right-14 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              pointer-events-none
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center font-medium
              py-1.5 px-3 rounded-md whitespace-nowrap shadow-xl z-50
            "
            >
              {t("resumeBuilder.theme.toggleTheme")}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RightPanel;

interface DetailsPanelActionsProps {
  activeTab: TabKey | null;
  onClose: () => void;
}

function DetailsPanelActions({ activeTab, onClose }: DetailsPanelActionsProps) {
  const [isClosing, setIsClosing] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    gsap.to(elRef.current, {
      x: 400,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        onClose();
        setIsClosing(false);
      },
    });
  };

  useLayoutEffect(() => {
    if (!elRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }, elRef);

    return () => {
      ctx.revert();
    };
  }, [activeTab]);

  if (!activeTab) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "template":
        return <TemplateTab />;
      case "theme":
        return <ThemeTab />;
      case "font":
        return <FontTab />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={elRef}
      className="w-[calc(100vw-44px)] lg:w-[400px] bg-[#F1F2F6] rounded-sm "
    >
      {/* header-close */}
      <div className="sticky top-0 lg:top-[64px] bg-[#F1F2F6] border-b border-border rounded-t-sm px-6 h-[80px] flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {(() => {
            const TabIcon = tabMapConfig[activeTab].icon;
            return <TabIcon className="w-6 h-6" />;
          })()}
          {t(tabMapConfig[activeTab].labelKey)}
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-accent rounded-full bg-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* cv-settings */}
      <div
        className="p-6 h-[calc(100vh-144px)]
 overflow-y-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {renderTabContent()}
      </div>
    </div>
  );
}

type TemplateItem<P = any> = {
  id: string;
  name: string;
  component: React.FC<P>;
  type: TemplateType;
  dummyData: ResumeData;
};

const templates: TemplateItem<{
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
}>[] = [
  {
    id: "template-tiger",
    name: "Template Tiger",
    component: TemplateTiger,
    type: "TEMPLATE-TIGER",
    dummyData: templateTigerDummy,
  },
  {
    id: "template-eagle",
    name: "Template Eagle",
    component: TemplateEagle,
    type: "TEMPLATE-EAGLE",
    dummyData: templateEagleDummy,
  },
  {
    id: "template-panda",
    name: "Template Panda",
    component: TemplatePanda,
    type: "TEMPLATE-PANDA",
    dummyData: templatePandaDummy,
  },
  {
    id: "template-rabbit",
    name: "Template Rabbit",
    component: TemplateRabbit,
    type: "TEMPLATE-RABBIT",
    dummyData: templateRabbitDummy,
  },
  {
    id: "template-lion",
    name: "Template Lion",
    component: TemplateLion,
    type: "TEMPLATE-LION",
    dummyData: templateLionDummy,
  },
  {
    id: "template-dolphin",
    name: "Template Dolphin",
    component: TemplateDolphin,
    type: "TEMPLATE-DOLPHIN",
    dummyData: templateDolphinDummy,
  },
  {
    id: "template-professional-1",
    name: "Professional 1",
    component: TemplateProfessional1,
    type: "TEMPLATE-PROFESSIONAL-1",
    dummyData: templateProfessional1Dummy,
  },
  {
    id: "template-professional-2",
    name: "Professional 2",
    component: TemplateProfessional2,
    type: "TEMPLATE-PROFESSIONAL-2",
    dummyData: templateProfessional2Dummy,
  },
  {
    id: "template-professional-3",
    name: "Professional 3",
    component: TemplateProfessional3,
    type: "TEMPLATE-PROFESSIONAL-3",
    dummyData: templateProfessional3Dummy,
  },
  {
    id: "template-professional-4",
    name: "Professional 4",
    component: TemplateProfessional4,
    type: "TEMPLATE-PROFESSIONAL-4",
    dummyData: templateProfessional4Dummy,
  },
  {
    id: "template-havard-1",
    name: "Havard 1",
    component: TemplateHavard1,
    type: "TEMPLATE-HAVARD-1",
    dummyData: templateHavard1Dummy,
  },
  {
    id: "template-havard-2",
    name: "Havard 2",
    component: TemplateHavard2,
    type: "TEMPLATE-HAVARD-2",
    dummyData: templateHavard2Dummy,
  },
];

const TEMPLATE_WIDTH = 900;
const TEMPLATE_HEIGHT = 1300;

function TemplateTab() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>([]);
  const { template, setTemplate, setResume } = useResume();

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    containerRefs.current.forEach((container, index) => {
      if (!container) return;

      const observer = new ResizeObserver(() => {
        const containerWidth = container.clientWidth;
        const scale = containerWidth / TEMPLATE_WIDTH;
        setScales((prev) => {
          const newScales = [...prev];
          newScales[index] = scale > 1 ? 1 : scale;
          return newScales;
        });
      });

      observer.observe(container);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {templates.map((TemplateComp, idx) => (
        <div
          key={idx}
          ref={(el) => {
            containerRefs.current[idx] = el;
          }}
          className={cn(
            "aspect-2/3 shadow-md hover:shadow-lg rounded overflow-hidden border cursor-pointer relative ",
            template === TemplateComp.type &&
              "after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0 after:border-b-35 after:border-b-green-600 after:border-l-35 after:border-l-transparent  after:content-['✓'] after:text-white after:text-lg after:font-bold"
          )}
          onClick={() => {
            setTemplate(TemplateComp.type);
            setResume((prev) => ({
              ...prev,
              theme: { ...TemplateComp.dummyData.theme },
            }));
          }}
        >
          <div
            style={{
              width: TEMPLATE_WIDTH,
              height: TEMPLATE_HEIGHT,
              transform: `scale(${scales[idx] || 1})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0"
          >
            <TemplateComp.component />
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeTab() {
  const { resume, setResume } = useResume();
  const theme = resume.theme;

  const [selectedColor, setSelectedColor] = useState<string>(
    theme.primaryColor
  );
  const [type, setType] = useState<keyof Theme>("primaryColor");

  useEffect(() => {
    setSelectedColor(theme[type]);
  }, [type]);

  const handleActivate = (colorType: keyof Theme) => {
    setType(colorType);
    setSelectedColor(theme[colorType]);
  };

  const handleChange = (value: string) => {
    if (/^#([0-9A-Fa-f]{0,6})$/.test(value)) {
      setSelectedColor(value);

      setResume({
        ...resume,
        theme: {
          ...theme,
          [type]: value,
        },
      });
    }
  };

  return (
    <div>
      <CustomColorPicker color={selectedColor} setColor={handleChange} />

      <div className="space-y-4 mt-4">
        <ColorPickerItem
          label="Primary Color"
          color={theme.primaryColor}
          active={type === "primaryColor"}
          onActivate={() => handleActivate("primaryColor")}
          onChange={handleChange}
        />

        <ColorPickerItem
          label="Background Color"
          color={theme.bgColor}
          active={type === "bgColor"}
          onActivate={() => handleActivate("bgColor")}
          onChange={handleChange}
        />

        <ColorPickerItem
          label="Text Color"
          color={theme.textColor}
          active={type === "textColor"}
          onActivate={() => handleActivate("textColor")}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

const fontOptions: { value: FontFamily; label: string }[] = [
  { value: "PLUS_JAKARTA_SANS", label: "Plus Jakarta Sans" },
  { value: "ARIAL", label: "Arial" },
  { value: "BAI_JAMJUREE", label: "Bai Jamjuree" },
  { value: "BARLOW", label: "Barlow" },
  { value: "BE_VIETNAM_PRO", label: "Be Vietnam Pro" },
  { value: "INTER", label: "Inter" },
  { value: "LEXEND", label: "Lexend" },
  { value: "MAITREE", label: "Maitree" },
  { value: "MONTSERRAT", label: "Montserrat" },
  { value: "MONTSERRAT_ALTERNATES", label: "Montserrat Alternates" },
  { value: "MULISH", label: "Mulish" },
  { value: "RALEWAY", label: "Raleway" },
  { value: "ROBOTO", label: "Roboto" },
  { value: "ROBOTO_CONDENSED", label: "Roboto Condensed" },
  { value: "SOURCE_CODE_PRO", label: "Source Code Pro" },
];

function FontTab() {
  const { fontFamily, setFontFamily } = useResume();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {fontOptions.map((font) => (
          <div
            key={font.value}
            onClick={() => setFontFamily(font.value)}
            className={cn(
              "p-3 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer group hover:shadow-md",
              fontFamily === font.value
                ? "border-teal-500 bg-teal-50 shadow-sm ring-1 ring-teal-200"
                : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
            )}
            style={{ fontFamily: font.label }}
          >
            <span
              className={cn(
                "text-base",
                fontFamily === font.value
                  ? "text-teal-900 font-medium"
                  : "text-gray-700"
              )}
            >
              {font.label}
            </span>
            {fontFamily === font.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ColorPickerItemProps {
  label: string;
  color: string;
  active: boolean;
  onActivate: () => void;
  onChange: (value: string) => void;
}

function ColorPickerItem({
  label,
  color,
  active,
  onActivate,
  onChange,
}: ColorPickerItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="rounded-full border w-8 aspect-square box-border"
          style={{ backgroundColor: color }}
        ></div>

        <input
          type="text"
          value={color}
          className={`w-full border rounded px-3 py-2 text-sm ${active ? "border-gray-300" : "border-gray-200 bg-gray-100 opacity-50"}`}
          disabled={!active}
          onFocus={onActivate}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          onClick={onActivate}
          className="p-2 border rounded hover:bg-gray-200 transition"
        >
          <Edit3 size={16} />
        </button>
      </div>
    </div>
  );
}
