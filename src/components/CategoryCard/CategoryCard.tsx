import { type LucideIcon } from "lucide-react";

type Category = {
  name: string;
  jobs: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
};

export default function CategoryCard({ category }: { category: Category }) {
  const IconComponent = category.icon;
  return (
    <div
      className={`${category.bgColor} p-6 rounded-2xl transition-all duration-500 cursor-pointer group hover:shadow-xl transform hover:-translate-y-2 hover:bg-blue-100 border border-transparent hover:border-[#1967d2]/20`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <IconComponent className={`w-7 h-7 ${category.color}`} />
        </div>
        <span className="bg-[#1967d2] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category.jobs}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-[#1967d2] transition-colors duration-300">
        {category.name}
      </h3>
    </div>
  );
}
