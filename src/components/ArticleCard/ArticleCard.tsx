import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes/routes.const";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

type Article = {
  id?: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  category: string;
};

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="relative bg-white shadow-md hover:shadow-xl transition-all duration-500 group border border-gray-100 overflow-hidden rounded-2xl hover:-translate-y-1">
      {/* nhạt, pastel border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-yellow-100 to-orange-100 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Image + Category */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 left-3 bg-blue-500 text-white shadow-md font-medium">
            {article.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              <Calendar className="w-3 h-3" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <User className="w-3 h-3" />
              <span className="text-blue-600 font-medium">
                By {article.author}
              </span>
            </div>
          </div>

          <Link
            to={article.id ? `/${routes.ARTICLES_DETAIL}/${article.id}` : `/${routes.ARTICLES_DETAIL}`}
            className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
          >
            {article.title}
          </Link>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tags badges */}
          {/* <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag, tagIndex) => {
              const colorClass = tagColors[tagIndex % tagColors.length];
              return (
                <Badge
                  key={tagIndex}
                  className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm transition-colors cursor-pointer ${colorClass}`}
                >
                  #{tag}
                </Badge>
              );
            })}
          </div> */}

          <Button
            variant="link"
            className="p-0 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Link to={article.id ? `/${routes.ARTICLES_DETAIL}/${article.id}` : `/${routes.ARTICLES_DETAIL}`}>
              Read More →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
