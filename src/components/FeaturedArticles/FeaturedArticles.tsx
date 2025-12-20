import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "../ArticleCard";
import Loading from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

export default function FeaturedArticles() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const {
    data: apiResponse,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["latest-posts", 9],
    queryFn: () => postService.getLatestPosts(9),
    staleTime: 5 * 60 * 1000,
  });

  const itemsFromApi: any[] = Array.isArray(apiResponse?.data)
    ? apiResponse.data
    : [];

  const mapPostToArticle = (post: any) => ({
    id: post.id,
    title: post.title,
    author:
      post.userAuthor?.fullName ||
      post.userAuthor?.email ||
      post.employerAuthor?.companyName ||
      post.employerAuthor?.email ||
      "",
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "",
    excerpt: post.excerpt || post.contentText || "",
    image: post.thumbnailUrl || "/placeholder.svg",
    tags:
      typeof post.tags === "string"
        ? post.tags.split("|")
        : Array.isArray(post.tags)
          ? post.tags
          : [],
    category: post.category?.title || "",
  });

  const mappedArticles = itemsFromApi.map(mapPostToArticle);
  const totalSlides = Math.max(
    1,
    Math.ceil(mappedArticles.length / itemsPerSlide)
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (mappedArticles.length > 0) {
      setCurrentSlide(0);
    }
  }, [mappedArticles.length]);
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="main-layout relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-3">
              {t("featuredArticles.title")}
            </h2>
            <p className="text-lg text-[#66789c]">
              {t("featuredArticles.description")}
            </p>
          </div>

          {/* Navigation arrows - only show if more than 1 slide */}
          {totalSlides > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-blue-50 hover:bg-[#4a6cf7] rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group border border-blue-100"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-5 h-5 text-[#4a6cf7] group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-blue-50 hover:bg-[#4a6cf7] rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group border border-blue-100"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-5 h-5 text-[#4a6cf7] group-hover:text-white transition-colors" />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="overflow-x-hidden">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center">
                <Loading variant="spinner" size="lg" />
              </div>
            ) : isError ? (
              <div className="py-12 text-center text-red-600">
                {(queryError as any)?.message ||
                  t("featuredArticles.loadArticlesError")}
              </div>
            ) : mappedArticles.length === 0 ? (
              <div className="py-12 text-center text-gray-600">
                {t("featuredArticles.noArticles")}
              </div>
            ) : (
              <>
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-3 gap-8 pb-2">
                        {mappedArticles
                          .slice(
                            slideIndex * itemsPerSlide,
                            slideIndex * itemsPerSlide + itemsPerSlide
                          )
                          .map((article, index) => (
                            <ArticleCard
                              key={`${slideIndex}-${index}`}
                              article={article}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              className="bg-[#1e3a5f] hover:bg-[#152a45] text-white px-8 py-6 h-auto text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link
                to={`/${routes.ARTICLES}`}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t("featuredArticles.loadMorePosts")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
