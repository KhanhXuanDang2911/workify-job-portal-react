interface Category {
  name: string;
  count: number;
}

interface CategoriesSidebarProps {
  categories: Category[];
  onCategoryClick?: (category: string) => void;
}

export default function CategoriesSidebar({
  categories,
  onCategoryClick,
}: CategoriesSidebarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-[#1967d2] mb-4">Categories</h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className="text-sm"
          >
            <span
              className="text-gray-600 hover:text-[#1967d2] cursor-pointer transition-colors"
              onClick={() => onCategoryClick?.(category.name)}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
