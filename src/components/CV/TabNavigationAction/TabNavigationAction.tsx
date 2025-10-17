import DesignFontTab from "./tabs/DesignFontTab";
import AddBlockTab from "./tabs/AddBlockTab";
import ChangeLayoutTab from "./tabs/ChangeLayoutTab";
import ChangeTemplateTab from "./tabs/ChangeTemplateTab";
import SuggestTab from "./tabs/SuggestTab";
import CVSampleTab from "./tabs/CVSampleTab";
import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface TabNavigationActionProps {
  activeTab: string;
  onClose: () => void;
}

const tabTitles: Record<string, string> = {
  design_and_font: "Thiết kế & Font",
  add_block: "Thêm mục",
  change_layout: "Bố cục CV",
  change_template: "Mẫu CV",
  suggest: "Gợi ý viết",
  cv_sample: "Thư viện CV",
};

export default function TabNavigationAction({ activeTab, onClose }: TabNavigationActionProps) {
  const [isClosing, setIsClosing] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    console.log(elRef.current);
    gsap.to(elRef.current, {
      x: -400, 
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
     gsap.fromTo(elRef.current, { x: -400, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.out" });
   }, elRef);

   return () => {
     ctx.revert();
   };
 }, []); 

  if (!activeTab) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "design_and_font":
        return <DesignFontTab />;
      case "add_block":
        return <AddBlockTab />;
      case "change_layout":
        return <ChangeLayoutTab />;
      case "change_template":
        return <ChangeTemplateTab />;
      case "suggest":
        return <SuggestTab />;
      case "cv_sample":
        return <CVSampleTab />;
      default:
        return null;
    }
  };

  return (
    <div ref={elRef} className="w-[400px] bg-white rounded-sm">
      {/* header-close */}
      <div className="sticky top-0 bg-background border-b border-border rounded-t-sm px-6 py-3 flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold">{tabTitles[activeTab]}</h2>
        <button onClick={handleClose} className="p-2 hover:bg-accent rounded-full bg-gray-300 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* cv-settings */}
      <div className="p-6 h-[486px] overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
