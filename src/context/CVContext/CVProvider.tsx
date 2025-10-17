import { FolderKanban, Hash } from "lucide-react";
import { CVContext, type BlockItem } from "./CVContext";
import { useState, type ReactNode } from "react";

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState("times");
  const [fontSize, setFontSize] = useState(3);
  const [lineSpacing, setLineSpacing] = useState(3);
  const [color, setColor] = useState("#000000");
  const [background, setBackground] = useState("bg0");
  const [usedBlocks, setUsedBlocks] = useState<BlockItem[]>([
    { id: "project", label: "Dự án", icon: FolderKanban },
    { id: "additional", label: "Thông tin thêm", icon: Hash },
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
