import { BriefcaseBusiness, GraduationCap, Hand,  Info, Medal, Pencil, ShieldCheck, SquareUser, Target, ThumbsUp, UserStar } from "lucide-react";
import { CVContext, type BlockItem } from "./CVContext";
import { useState, type ReactNode } from "react";

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState("times");
  const [fontSize, setFontSize] = useState(3);
  const [lineSpacing, setLineSpacing] = useState(3);
  const [color, setColor] = useState("#000000");
  const [background, setBackground] = useState("bg0");
  const [usedBlocks, setUsedBlocks] = useState<BlockItem[]>([
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
  ]);

  return (
    <CVContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        lineSpacing,
        setLineSpacing,
        color,
        setColor,
        background,
        setBackground,
        usedBlocks,
        setUsedBlocks,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};
