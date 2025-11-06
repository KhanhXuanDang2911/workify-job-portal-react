import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortButtonProps {
  isActive: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}

export default function SortButton({ isActive, direction, onClick }: SortButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="h-6 w-6 p-0 hover:bg-gray-200">
      {isActive ? (
        direction === "asc" ? (
          <ChevronUp size={16} className="text-blue-600" />
        ) : (
          <ChevronDown size={16} className="text-blue-600" />
        )
      ) : (
        <div className="flex flex-col gap-0.5">
          <ChevronUp size={12} className="text-gray-400" />
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      )}
    </Button>
  );
}