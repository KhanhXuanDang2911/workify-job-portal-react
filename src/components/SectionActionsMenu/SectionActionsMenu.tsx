import type { SectionType } from "@/types/resume.type";
import { Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SectionActionsMenu({
  section,
}: {
  section: SectionType;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    // Implement hide section logic here

    setOpen(false);
  };

  const handleClearSection = () => {
    // Implement clear section logic here
    setOpen(false);
  };

  if (section === "basicInfo") return null;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded hover:bg-gray-100 transition"
      >
        <Menu className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50">
          <div
            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
            onClick={handleHideSection}
          >
            Hide
          </div>
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
