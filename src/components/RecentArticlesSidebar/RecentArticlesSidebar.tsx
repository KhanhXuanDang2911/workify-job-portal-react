interface RecentArticle {
  title: string;
  date: string;
  image: string;
}

interface RecentArticlesSidebarProps {
  articles: RecentArticle[];
  onArticleClick?: (article: RecentArticle) => void;
}

export default function RecentArticlesSidebar({
  articles,
  onArticleClick,
}: RecentArticlesSidebarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
        Recent Article
      </h3>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="flex gap-3 cursor-pointer"
            onClick={() => onArticleClick?.(article)}
          >
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-16 h-16 object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-xs text-[#1967d2] mb-1">{article.date}</p>
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#1967d2] transition-colors">
                {article.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
