import { type LucideIcon } from "lucide-react";

type Category = {
  name: string;
  jobs: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor?: string;
  hoverBg?: string;
};

export default function CategoryCard({ category }: { category: Category }) {
  const IconComponent = category.icon;
  const borderColor = category.borderColor || "border-gray-200";
  const hoverBg = category.hoverBg || "hover:bg-blue-100";

  return (
    <div
      className={`${category.bgColor} ${borderColor} ${hoverBg} p-6 rounded-2xl transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-gray-200/50 transform hover:-translate-y-1 border-2 relative overflow-hidden`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-transparent transition-all duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md border ${borderColor}`}>
            <IconComponent className={`w-7 h-7 ${category.color} transition-transform duration-300 group-hover:scale-110`} />
          </div>
          <span className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            {category.jobs}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-base group-hover:text-gray-800 transition-colors duration-300">
          {category.name}
        </h3>
      </div>
    </div>
  );
}
