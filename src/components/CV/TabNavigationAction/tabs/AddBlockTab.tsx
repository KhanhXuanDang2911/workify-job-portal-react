import { Button } from "@/components/ui/button";
import { CVContext, useCV } from "@/context";
import { createDragFeedback } from "@/utils";
import {
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  GripVertical,
  Hand,
  Hash,
  Info,
  Medal,
  Pencil,
  ShieldCheck,
  SquareUser,
  Target,
  ThumbsUp,
  UserStar,
} from "lucide-react";
import { useMemo } from "react";

const unusedBlocks = [
  { id: "project", label: "Dự án", icon: FolderKanban },
  { id: "additional", label: "Thông tin thêm", icon: Hash },
];

const allBlocks = [
  { id: "project", label: "Dự án", icon: FolderKanban },
  { id: "additional", label: "Thông tin thêm", icon: Hash },
  { id: "intro", label: "Danh thiếp", icon: SquareUser },
  { id: "contact", label: "Thông tin liên hệ", icon: Info },
  { id: "career", label: "Mục tiêu nghề nghiệp", icon: Target },
  { id: "experience", label: "Kinh nghiệm làm việc", icon: BriefcaseBusiness },
  { id: "education", label: "Học vấn", icon: GraduationCap },
  { id: "skill", label: "Kỹ năng", icon: Pencil },
  { id: "prize", label: "Giải thưởng", icon: Medal },
  { id: "certificate", label: "Chứng chỉ", icon: ShieldCheck },
  { id: "activity", label: "Hoạt động", icon: Hand },
  { id: "reference_people", label: "Người tham chiếu", icon: UserStar },
  { id: "hobby", label: "Sở thích", icon: ThumbsUp },
];

function AddBlockTab() {
  const { usedBlocks } = useCV();
  const unusedBlocks = useMemo(
    () =>
      allBlocks.filter(
        (block) => !usedBlocks.some((used) => used.id === block.id)
      ),
    [usedBlocks]
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const blockId = (e.currentTarget as HTMLDivElement).getAttribute("data-id");
    if (blockId) {
      e.dataTransfer.setData("application/block-id", blockId);
      e.dataTransfer.effectAllowed = "move";
    }
    // const feedback = createDragFeedback()
  };

  return (
    <div className="space-y-6">
      {/* Unused Blocks */}
      <div>
        <h3 className="text-base font-semibold mb-2">Mục chưa sử dụng</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Kéo và thả mục bất kỳ vào vị trí bạn muốn thêm trên CV
        </p>
        <div className="space-y-2">
          {unusedBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.id}
                draggable="true"
                data-id={block.id}
                onDragStart={handleDragStart}
                className="flex group items-center gap-3 p-3 bg-accent rounded-lg cursor-move transition-colors hover:bg-green-100"
              >
                <Icon className="text-muted-foreground group-hover:text-green-500" />
                <span className="text-sm group-hover:text-green-500">
                  {block.label}
                </span>
                <div className="ml-auto">
                  <GripVertical className="group-hover:text-green-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Used blocks */}
      <div>
        <h3 className="text-base font-semibold mb-2">Mục đã sử dụng</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click để xem vị trí của mục trên CV
        </p>
        <div className="space-y-2">
          {usedBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <Button
                key={block.id}
                data-id={block.id}
                variant="outline"
                className="group w-full justify-start text-gray-500 gap-3 h-auto py-3 bg-gray-100"
              >
                <Icon className="w-6! h-6! text-muted-foreground group-hover:text-black" />
                <span className="text-sm">{block.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AddBlockTab;
