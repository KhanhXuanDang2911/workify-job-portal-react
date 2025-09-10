"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

type Article = {
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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100">
            <div className="relative overflow-hidden rounded-t-xl">
                <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className="absolute top-3 left-3 bg-[#1967d2] text-white">{article.category}</Badge>
            </div>
            <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span className="text-[#1967d2] font-medium">By {article.author}</span>
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1967d2] transition-colors">{article.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button variant="link" className="p-0 text-[#1967d2] hover:text-[#1557b8] font-medium">Read More →</Button>
            </div>
        </div>
    );
}


