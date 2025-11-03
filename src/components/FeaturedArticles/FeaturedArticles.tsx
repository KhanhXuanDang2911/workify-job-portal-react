"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "../ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";

export default function FeaturedArticles() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch public posts
  const { data: apiResponse, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["public-posts"],
    queryFn: () => postService.getPublicPosts({ pageNumber: 1, pageSize: 6 }),
    staleTime: 5 * 60 * 1000,
  });

  const itemsFromApi: any[] = Array.isArray(apiResponse?.data?.items) ? apiResponse.data.items : [];

  const mapPostToArticle = (post: any) => ({
    title: post.title,
    author: post.author?.fullName || post.author?.email || "",
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "",
    excerpt: post.excerpt || post.contentText || "",
    image: post.thumbnailUrl || "/placeholder.svg",
    tags: typeof post.tags === "string" ? post.tags.split("|") : Array.isArray(post.tags) ? post.tags : [],
    category: post.category?.title || "",
  });

  const mappedArticles = itemsFromApi.map(mapPostToArticle);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(mappedArticles.length / 3 || 1));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + Math.ceil(mappedArticles.length / 3 || 1)) % Math.ceil(mappedArticles.length / 3 || 1)
    );
  };
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-25 to-indigo-50 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-20 h-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
        <div className="absolute bottom-10 left-10 w-16 h-1 bg-gradient-to-r from-purple-300 to-transparent"></div>
        <div className="absolute top-1/2 right-5 w-1 h-24 bg-gradient-to-b from-teal-300 to-transparent"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-12">
          <p className="text-[#1967d2] font-medium mb-2">Our Blogs</p>
          <h2 className="text-3xl font-bold text-gray-900">Latest Article</h2>
        </div>

        <div className="relative">
          <div className="overflow-x-hidden">
            {isLoading ? (
              <div className="py-12 text-center">Loading articles...</div>
            ) : isError ? (
              <div className="py-12 text-center text-red-600">Failed to load articles</div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.max(1, Math.ceil(mappedArticles.length / 3)) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-3 gap-8 pb-2">
                      {mappedArticles
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((article, index) => (
                          <ArticleCard key={index} article={article} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex space-x-2">
              {Array.from({ length: Math.max(1, Math.ceil(mappedArticles.length / 3)) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-[#1967d2]" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="border-[#1967d2] text-[#1967d2] hover:bg-[#1967d2] hover:text-white bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
