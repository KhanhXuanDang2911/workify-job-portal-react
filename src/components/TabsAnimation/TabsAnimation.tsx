import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { LucideProps } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

interface TabsAnimationProps {
  tabs: { id: string; label: string; icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>|null }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  indicatorClassName?: string;
  tabsBoxClassName?: string;
  tabClassName?: string;
  tabsBoxPadding?: string;
}
function TabsAnimation({ tabs, activeTab, setActiveTab, indicatorClassName, tabsBoxClassName, tabClassName, tabsBoxPadding }: TabsAnimationProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabIndicatorRef = useRef<HTMLDivElement>(null); //flag giữ chỗ

  const moveIndicatorTo = (tabId: string, duration = 0.3) => {
    const btn = tabRefs.current.find((el) => el?.dataset.id === tabId);
    if (!btn || !tabIndicatorRef.current) return;
    gsap.to(tabIndicatorRef.current, {
      x: btn.offsetLeft - (tabsBoxPadding ? parseFloat(tabsBoxPadding) : 0),
      width: btn.offsetWidth,
      duration,
      ease: "power2.out",
    });
  };

  useLayoutEffect(() => {
    moveIndicatorTo(activeTab, 0.4);
  }, [activeTab]);

  const handleHover = (tabId: string) => {
    moveIndicatorTo(tabId, 0.25);
  };

  const handleMouseLeave = () => {
    moveIndicatorTo(activeTab, 0.4);
  };

  return (
    <div onMouseLeave={handleMouseLeave} className={cn(tabsBoxClassName, "relative inline-flex gap-5 items-center border border-[#1967d2] rounded-2xl p-1 isolate")}>
      <div ref={tabIndicatorRef} className={cn(indicatorClassName, "absolute top-1 bottom-1 bg-green-400 rounded-2xl")}></div>

      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          data-id={tab.id}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          onClick={() => setActiveTab(tab.id)}
          onMouseEnter={() => handleHover(tab.id)}
          className={cn(
            tabClassName,
            "relative z-10 px-4 py-2 rounded-2xl font-medium transition-colors text-center",
            activeTab === tab.id ? "text-[#1967d2] " : "text-gray-700 hover:text-[#1967d2]"
          )}
        >
          {tab.icon && <tab.icon className="w-4 h-4 inline-block mr-2" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabsAnimation;
