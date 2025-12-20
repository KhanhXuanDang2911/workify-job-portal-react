import { Badge } from "@/components/ui/badge";

interface TagsSidebarProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function TagsSidebar({ tags, onTagClick }: TagsSidebarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-[#1967d2] mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-[#1967d2] hover:text-white transition-colors"
            onClick={() => onTagClick?.(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
