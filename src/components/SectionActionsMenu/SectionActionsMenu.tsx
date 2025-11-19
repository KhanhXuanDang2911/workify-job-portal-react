import { Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function MenuItem({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition ${className}`}
    >
      {label}
    </div>
  );
}

export default function SectionActionsMenu() {
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
          <MenuItem label="Add a new item" />
          <MenuItem label="Separate Links" />

          <div className="border-t my-2" />

          <MenuItem label="Hide" />
          <MenuItem label="Rename >" />
          <MenuItem label="Columns >" />

          <div className="border-t my-2" />

          <MenuItem label="Reset" />

          <MenuItem label="Remove" className="text-red-500 hover:bg-red-50" />
        </div>
      )}
    </div>
  );
}
