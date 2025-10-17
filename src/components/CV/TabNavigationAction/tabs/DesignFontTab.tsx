import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomSlider from "@/components/CV/CustomSlider/CustomSlider";
import CustomColorPicker from "@/components/CV/CustomColorPicker";
import { Check } from "lucide-react";
import { useCV } from "@/context";

const backgroundOptions = [
  { id: "bg0", label: "Không có", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/white.png" },
  { id: "bg1", label: "Gradient 1", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/rm218batch4-ning-34.png" },
  { id: "bg2", label: "Gradient 2", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/rm309-adj-03.png" },
  { id: "bg3", label: "Gradient 3", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/SL_042620_30310_19.png" },
  { id: "bg4", label: "Gradient 4", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/SL_042620_30310_36.png" },
  { id: "bg5", label: "Gradient 5", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/SL-060521-43530-07.png" },
  { id: "bg6", label: "Gradient 6", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/v960-ning-11.png" },
  { id: "bg7", label: "Gradient 7", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/vivid-blurred-colorful-background.png" },
  { id: "bg8", label: "Gradient 8", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/vivid-blurred-colorful-wallpaper-background.png" },
  { id: "bg9", label: "Gradient 9", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/passion_bg_1.png" },
  { id: "bg10", label: "Gradient 10", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/passion_bg_2.png" },
  { id: "bg11", label: "Gradient 11", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/passion_bg_3.png" },
  { id: "bg12", label: "Gradient 12", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/passion_bg_4.png" },
  { id: "bg13", label: "Gradient 13", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/passion_bg_5.png" },
  { id: "bg14", label: "Gradient 14", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/basic_5_F1F2FF.png" },
  { id: "bg15", label: "Gradient 15", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/basic_5_F2FBFD.png" },
  { id: "bg16", label: "Gradient 16", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/basic_5_F5FBF8.png" },
  { id: "bg17", label: "Gradient 17", imageSrc: "https://static.topcv.vn/cv-builder/assets/background/basic_5_FFF8F5.png" },
];


export default function DesignFontTab  ()  {
const { font, setFont, fontSize, setFontSize, lineSpacing, setLineSpacing, color, setColor, background, setBackground } = useCV();
  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">Font chữ</label>
        <Select value={font} onValueChange={setFont}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn font chữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="times">Times New Roman</SelectItem>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="helvetica">Helvetica</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">Cỡ chữ</label>
        <CustomSlider steps={6} filledValue={fontSize} setFilledValue={setFontSize} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Nhỏ</span>
          <span>Trung bình</span>
          <span>Siêu lớn</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">Khoảng cách dòng</label>
        <CustomSlider steps={8} filledValue={lineSpacing} setFilledValue={setLineSpacing} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>1.0</span>
          <span>2.0</span>
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">Màu chủ đề</label>
        <div className="space-y-3">
          <CustomColorPicker color={color} setColor={setColor} />
        </div>
      </div>

      {/* CV Background */}
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase mb-3 block">Hình nền CV</label>
        <div className="grid grid-cols-5 gap-3">
          {backgroundOptions.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackground(bg.id)}
              className="relative aspect-[3/4] rounded-sm border-2 transition-all hover:scale-105"
              style={{
                background: `url(${bg.imageSrc}) center/cover no-repeat`,
                borderColor: `${background === bg.id ? "#10b981" : "#e5e7eb"}`,
              }}
            >
              {background === bg.id && (
                <div className="absolute inset-0 flex items-center justify-center">       
                    <Check className="w-5 h-5 text-[#10b981]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
