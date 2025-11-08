import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import useDebounce from "@/hooks/useDebounce";
import { routes } from "@/routes/routes.const";
import type { PostResponse, PostCategory } from "@/types/post.type";

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

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get categoryId from URL params
  const categoryIdFromUrl = searchParams.get("categoryId");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryIdFromUrl ? Number(categoryIdFromUrl) : null
  );
  const pageSize = 6;

  const debouncedKeyword = useDebounce(searchTerm, 500);

  // Update selectedCategoryId when URL params change
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      setSelectedCategoryId(Number(categoryId));
    } else {
      setSelectedCategoryId(null);
    }
  }, [searchParams]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, selectedCategoryId]);

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["post-categories"],
    queryFn: () => postService.getAllCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const categories: PostCategory[] = categoriesResponse?.data || [];

  // Fetch latest articles for Recent Articles section
  const { data: latestPostsResponse } = useQuery({
    queryKey: ["latest-public-posts"],
    queryFn: () => postService.getLatestPublicPosts(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch articles from API
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ["public-posts", currentPage, pageSize, debouncedKeyword, selectedCategoryId],
    queryFn: () =>
      postService.getPublicPosts({
        pageNumber: currentPage,
        pageSize: pageSize,
        sorts: "createdAt:desc",
        ...(debouncedKeyword && { keyword: debouncedKeyword }),
        ...(selectedCategoryId && { categoryId: selectedCategoryId }),
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Map PostResponse to Article format
  const mapPostToArticle = (post: PostResponse): Article => ({
    id: post.id,
    title: post.title,
    author: post.author?.fullName || post.author?.email || "",
    date: post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    excerpt: post.excerpt || post.contentText || "",
    image: post.thumbnailUrl || "/placeholder.svg",
    tags:
      typeof post.tags === "string"
        ? post.tags.split("|").filter((tag) => tag.trim())
        : Array.isArray(post.tags)
        ? post.tags
        : [],
    category: post.category?.title || "",
  });

  const allArticles: Article[] =
    Array.isArray(apiResponse?.data?.items)
      ? apiResponse.data.items.map(mapPostToArticle)
      : [];

  const totalPages = apiResponse?.data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    // Update URL params
    if (categoryId) {
      setSearchParams({ categoryId: categoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  // Map latest posts to recent articles format
  const recentArticles =
    Array.isArray(latestPostsResponse?.data)
      ? latestPostsResponse.data.map((post: PostResponse) => ({
          id: post.id,
          title: post.title,
          date: post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "",
          image: post.thumbnailUrl || "/placeholder.svg",
        }))
      : [];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-10 right-10 w-20 h-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
        <div className="absolute bottom-10 left-10 w-16 h-1 bg-gradient-to-r from-purple-300 to-transparent"></div>
        <div className="absolute top-1/2 right-5 w-1 h-24 bg-gradient-to-b from-teal-300 to-transparent"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="main-layout relative z-10 py-8">
        {/* Header with back button */}
        {/* <div className="flex items-center mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div> */}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Page title */}
            {/* <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Articles
              </h1>
              <p className="text-gray-600">
                Discover the latest insights and tips for your career journey
              </p>
            </div> */}

            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading articles...</p>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600">
                  Error loading articles. Please try again later.
              </p>
            </div>
            )}

            {/* Articles grid */}
            {!isLoading && !isError && (
              <>
                {allArticles.length > 0 ? (
                  <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {allArticles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>

            {/* Pagination */}
                    {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      No articles found. Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Categories
              </h3>
              <div className="space-y-3">
                <div
                  className={`text-sm cursor-pointer transition-colors ${
                    selectedCategoryId === null
                      ? "text-[#1967d2] font-medium"
                      : "text-gray-600 hover:text-[#1967d2]"
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Categories
                </div>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`text-sm cursor-pointer transition-colors ${
                      selectedCategoryId === category.id
                        ? "text-[#1967d2] font-medium"
                        : "text-gray-600 hover:text-[#1967d2]"
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Recent Article
              </h3>
              <div className="space-y-4">
                {recentArticles.map((article, index) => {
                  const linkTo = article.id
                    ? `/${routes.ARTICLES_DETAIL}/${article.id}`
                    : "#";

                  return (
                    <Link
                      key={index}
                      to={linkTo}
                      className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-16 h-16 object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-[#1967d2] mb-1">
                          {article.date}
                        </p>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#1967d2] transition-colors">
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
