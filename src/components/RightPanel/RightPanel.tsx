import {
  Aperture,
  Edit3,
  MoonStar,
  Palette,
  Sun,
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
import type { ResumeData, TemplateType, Theme } from "@/types/resume.type";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import { cn } from "@/lib/utils";
import { useResume } from "@/context/ResumeContext/useResume";

type TabKey = "template" | "theme";

const tabMap: Record<
  TabKey,
  {
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }
> = {
  template: { label: "Template", icon: Aperture },
  theme: { label: "Theme", icon: Palette },
};

function RightPanel({
  transformWrapperBgMode,
  setTransformWrapperBgMode,
}: {
  transformWrapperBgMode: "light" | "dark";
  setTransformWrapperBgMode: Dispatch<SetStateAction<"light" | "dark">>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  return (
    <>
      <div className="fixed top-[64px] right-0 h-[calc(100vh-64px)] inline-flex z-100">
        <DetailsPanelActions
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
        />
        <div className="w-11 bg-[#eaeaec] flex flex-col items-center justify-between py-4 gap-3 z-50">
          <div className="flex flex-col items-center gap-3">
            {Object.entries(tabMap).map(([key, { label, icon: Icon }]) => (
              <div
                key={key}
                className="relative group cursor-pointer hover:bg-gray-300 p-2 rounded-full"
                onClick={() => setActiveTab(key as TabKey)}
              >
                <Icon className=" w-4 h-4" strokeWidth={1} />
                <div
                  className="
              absolute right-11 top-1/2 -translate-y-1/2
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
          </div>

          <div
            className="relative group cursor-pointer hover:bg-gray-300 p-2 rounded-full"
            onClick={() =>
              setTransformWrapperBgMode(
                transformWrapperBgMode === "light" ? "dark" : "light"
              )
            }
          >
            {transformWrapperBgMode === "light" ? (
              <Sun className=" w-4 h-4" strokeWidth={1} />
            ) : (
              <MoonStar className=" w-4 h-4" strokeWidth={1} />
            )}
            <div
              className="
              absolute right-11 top-1/2 -translate-y-1/2
              opacity-0 translate-x-[-10px]
              group-hover:opacity-100
              pointer-events-none
              group-hover:translate-x-0
              transition-all duration-200 ease-out
              bg-gray-900 text-white text-sm text-center
              py-1 px-3 rounded-sm whitespace-nowrap shadow-lg
            "
            >
              Toggle Theme
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
      default:
        return null;
    }
  };

  return (
    <div ref={elRef} className="w-[400px] bg-[#F1F2F6] rounded-sm ">
      {/* header-close */}
      <div className="sticky top-[64px] bg-[#F1F2F6] border-b border-border rounded-t-sm px-6 h-[80px] flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {(() => {
            const TabIcon = tabMap[activeTab].icon;
            return <TabIcon className="w-6 h-6" />;
          })()}
          {tabMap[activeTab].label}
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
  component: React.FC<P>;
  type: TemplateType;
};

const templates: TemplateItem<{
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
}>[] = [
  { component: TemplatePanda, type: "TEMPLATE-PANDA" },
  { component: TemplateRabbit, type: "TEMPLATE-RABBIT" },
];

const TEMPLATE_WIDTH = 900; // chiều rộng gốc của template
const TEMPLATE_HEIGHT = 1300; // chiều cao gốc của template

function TemplateTab() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>([]);
  const { template, setTemplate } = useResume();

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
          ref={(el) => (containerRefs.current[idx] = el)}
          className={cn(
            "aspect-2/3 shadow-md hover:shadow-lg rounded overflow-hidden border cursor-pointer relative ",
            template === TemplateComp.type &&
              "after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0 after:border-b-35 after:border-b-green-600 after:border-l-35 after:border-l-transparent  after:content-['✓'] after:text-white after:text-lg after:font-bold"
          )}
          onClick={() => setTemplate(TemplateComp.type)}
        >
          <div className=""></div>
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

  // Sync nếu context thay đổi từ bên ngoài
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
