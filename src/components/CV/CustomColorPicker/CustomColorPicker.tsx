import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";

function CustomColorPicker({ color, setColor, className }: { className?: string; color: string; setColor: (color: string) => void }) {
  
  return (
    <div className={cn("custom-layout", className)}>
      <HexColorPicker color={color} onChange={setColor} />
      <div className="flex flex-row gap-4 h-[55px] pt-3">
        <div className="w-[80px] h-full rounded-sm bg-green-500" style={{ backgroundColor: color }}></div>
        <input
          type="text"
          className="h-full flex-1 bg-gray-100 outline-none rounded-sm text-center"
          value={color}
          onChange={(e) => {
            const value = e.target.value;
            if (/^#([0-9A-Fa-f]{0,6})$/.test(value)) {
              setColor(value);
            }
          }}
        />
      </div>
    </div>
  );
}

export default CustomColorPicker;
