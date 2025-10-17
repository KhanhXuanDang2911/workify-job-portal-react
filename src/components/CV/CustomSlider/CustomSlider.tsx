import { cn } from "@/lib/utils";
import React, { useRef } from "react";

interface CustomSliderProps {
  steps: number;
  filledValue: number;
  setFilledValue: (value: number) => void;
  fillColor?: string;
}

function CustomSlider({ steps = 6, filledValue = 3, setFilledValue, fillColor = "bg-green-600" }: CustomSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // phần trăm tiến trình (để tô màu phần slider filled)
  const percentage = ((filledValue - 1) / (steps - 1)) * 100;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left; //tính vị trí click so với slider (giá trị clickX nằm trong khoảng từ 0 đến rect.width)
    const stepWidth = rect.width / (steps - 1); //tính chiều rộng 1 step

    // tính step gần nhất
    const clickedStep = Math.round(clickX / stepWidth) + 1;

    // giới hạn trong phạm vi
    const newValue = Math.min(Math.max(clickedStep, 1), steps);
    setFilledValue(newValue);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Thanh slider chính */}
      <div ref={sliderRef} onClick={handleClick} className="relative w-full h-3 bg-gray-300 rounded-full cursor-pointer">
        {/* Slider filled */}
        <div className={cn("absolute h-3 rounded-full transition-all duration-300", fillColor)} style={{ width: `${percentage}%` }}></div>

        {/* Các mốc (steps) */}
        <div className="absolute top-1/2 z-10 left-0 w-full flex justify-between -translate-y-1/2">
          {Array.from({ length: steps }).map((_, i) => (
            <div
              key={i}
              className={cn("w-2 h-2 rounded-full transition-all", i >= filledValue - 1 ? "bg-gray-400" : "bg-white", (i === 0 || i === steps - 1) && "bg-transparent")}
            ></div>
          ))}
        </div>

        {/* Slider thumb */}
        <div className="absolute top-1/2 z-20 -translate-y-1/2 transition-all duration-300" style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}>
          <div className={cn("w-6 h-6 rounded-full shadow-lg", fillColor)}></div>
        </div>
      </div>
    </div>
  );
}

export default CustomSlider;
