import { ChevronUp, ChevronDown, X, ChevronDownIcon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface SortButtonProps {
  direction?: "asc" | "desc" | null;
  onChange: (newDirection: "asc" | "desc" | null) => void;
}

export default function MultiSortButton({ direction, onChange }: SortButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title={direction === "asc" ? "Sắp xếp tăng dần" : direction === "desc" ? "Sắp xếp giảm dần" : "Không sắp xếp"}
        >
          {direction === "asc" ? (
            <div className="flex items-center">
              <ListFilter size={16} className="text-teal-400" />
              <ChevronUp size={16} className="text-blue-600" />
            </div>
          ) : direction === "desc" ? (
            <div className="flex items-center">
              <ListFilter size={16} className="text-teal-400" />
              <ChevronDown size={16} className="text-blue-600" />
            </div>
          ) : (
            <ListFilter size={16} className="text-teal-400" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onChange("asc")} className={direction === "asc" ? "text-blue-600 font-medium" : ""}>
          <ChevronUp size={14} className="mr-2" />
          Tăng dần
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("desc")} className={direction === "desc" ? "text-blue-600 font-medium" : ""}>
          <ChevronDown size={14} className="mr-2" />
          Giảm dần
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange(null)} className={!direction ? "text-blue-600 font-medium" : ""}>
          <X size={14} className="mr-2" />
          Hủy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
