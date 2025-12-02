import { Badge } from "@/components/ui/badge";
import { routes } from "@/routes/routes.const";
import { Link } from "react-router-dom";

type Article = {
  id?: number;
  title: string;
  author: string;
  authorAvatar?: string | null;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  category: string;
  readingTime?: string;
};

// Fallback: generate initials from name
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function ArticleCard({ article }: { article: Article }) {
  const readingTime =
    article.readingTime || `${Math.floor(Math.random() * 4) + 6} mins to read`;

  return (
    <Link
      to={
        article.id
          ? `/${routes.ARTICLES_DETAIL}/${article.id}`
          : `/${routes.ARTICLES_DETAIL}`
      }
      className="block group"
    >
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl shadow-sm">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category Badge */}
          <Badge className="bg-blue-100/80 text-[#4a6cf7] hover:bg-blue-100 font-medium border-0 mb-4">
            {article.category || "News"}
          </Badge>

          {/* Title */}
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4 line-clamp-2 group-hover:text-[#4a6cf7] transition-colors duration-300 leading-tight">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-base text-[#66789c] mb-6 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-3">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                {getInitials(article.author || "?")}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1e3a5f]">
                {article.author}
              </p>
              <p className="text-xs text-[#66789c]">{article.date}</p>
            </div>
            <span className="text-xs text-[#66789c]">{readingTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
