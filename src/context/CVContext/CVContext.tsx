import { createContext } from "react";

export interface BlockItem {
  id: string;
  label: string;
  icon: any;
}

interface CVContextType {
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineSpacing: number;
  setLineSpacing: (spacing: number) => void;
  color: string;
  setColor: (color: string) => void;
  background: string;
  setBackground: (bg: string) => void;
  usedBlocks: BlockItem[];
  setUsedBlocks: React.Dispatch<React.SetStateAction<BlockItem[]>>;
}

export const CVContext = createContext<CVContextType | undefined>(undefined);
