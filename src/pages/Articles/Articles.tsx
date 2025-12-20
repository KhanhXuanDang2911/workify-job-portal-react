import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { routes } from "@/routes/routes.const";
import type { PostResponse, PostCategory } from "@/types/post.type";
import { useTranslation } from "@/hooks/useTranslation";
import PageTitle from "@/components/PageTitle/PageTitle";

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
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const keywordFromUrl = searchParams.get("keyword") || "";
  const categoryIdFromUrl = searchParams.get("categoryId");
  const pageFromUrl = searchParams.get("page");

  const [appliedKeyword, setAppliedKeyword] = useState(keywordFromUrl);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryIdFromUrl ? Number(categoryIdFromUrl) : null
  );
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number(pageFromUrl) : 1
  );

  const [tempSearchTerm, setTempSearchTerm] = useState(keywordFromUrl);

  const pageSize = 4;

  useEffect(() => {
    const params = new URLSearchParams();

    if (appliedKeyword) {
      params.set("keyword", appliedKeyword);
    }

    if (selectedCategoryId) {
      params.set("categoryId", selectedCategoryId.toString());
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    setSearchParams(params, { replace: true });
  }, [appliedKeyword, selectedCategoryId, currentPage, setSearchParams]);

  useEffect(() => {
    const keywordParam = searchParams.get("keyword") || "";
    const categoryIdParam = searchParams.get("categoryId");
    const pageParam = searchParams.get("page");

    setAppliedKeyword(keywordParam);
    setSelectedCategoryId(categoryIdParam ? Number(categoryIdParam) : null);
    setCurrentPage(pageParam ? Number(pageParam) : 1);
    setTempSearchTerm(keywordParam);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedKeyword, selectedCategoryId]);

  const { data: categoriesResponse } = useQuery({
    queryKey: ["post-categories"],
    queryFn: () => postService.getAllCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const categories: PostCategory[] = categoriesResponse?.data || [];

  const {
    data: latestPostsResponse,
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
    error: errorRecent,
  } = useQuery({
    queryKey: ["latest-public-posts", 6],
    queryFn: () => postService.getLatestPublicPosts(6),
    staleTime: 5 * 60 * 1000,

    refetchOnMount: "always",
  });

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "public-posts",
      currentPage,
      pageSize,
      appliedKeyword,
      selectedCategoryId,
    ],
    queryFn: () =>
      postService.getPublicPosts({
        pageNumber: currentPage,
        pageSize: pageSize,
        sorts: "createdAt:desc",
        ...(appliedKeyword && { keyword: appliedKeyword }),
        ...(selectedCategoryId && { categoryId: selectedCategoryId }),
      }),
    staleTime: 5 * 60 * 1000,

    refetchOnMount: "always",
  });

  const mapPostToArticle = (post: PostResponse): Article => ({
    id: post.id,
    title: post.title,
    author:
      post.userAuthor?.fullName ||
      post.userAuthor?.email ||
      post.employerAuthor?.companyName ||
      post.employerAuthor?.email ||
      "",
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

  const allArticles: Article[] = Array.isArray(apiResponse?.data?.items)
    ? apiResponse.data.items.map(mapPostToArticle)
    : [];

  const totalPages = apiResponse?.data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedKeyword(tempSearchTerm);
    setCurrentPage(1);
  };

  const recentArticles = Array.isArray(latestPostsResponse?.data)
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
      <PageTitle title={t("pageTitles.articles")} />
      <div
        className="w-full h-[450px] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(#00000080, #00000080), url('/work1.jpg')",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="text-center px-4">
          <h1
            className="text-white drop-shadow-lg"
            style={{
              marginBottom: 0,
              fontWeight: 500,
              lineHeight: "60px",
              fontSize: "40px",
            }}
          >
            {t("articles.heroTitle")}
          </h1>
          <p
            className="text-white mt-4"
            style={{
              color: "#fff",
              fontSize: "18px",
              lineHeight: "28px",
              fontWeight: 400,
              opacity: 0.95,
            }}
          >
            {t("articles.heroDescription")}
          </p>
        </div>
      </div>

      <div className="main-layout relative z-10 pt-20 pb-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading variant="spinner" size="lg" />
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600">
                  {t("articles.loadArticlesError")}
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
                    <p className="text-gray-600">{t("articles.noArticles")}</p>
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
                  placeholder={t("articles.searchPlaceholder")}
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="pl-10 border-gray-200"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                {t("articles.categories")}
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                <div
                  className={`text-sm cursor-pointer transition-colors ${
                    selectedCategoryId === null
                      ? "text-[#1967d2] font-medium"
                      : "text-gray-600 hover:text-[#1967d2]"
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  {t("articles.allCategories")}
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
                {t("articles.recentArticle")}
              </h3>
              {isLoadingRecent ? (
                <div className="flex items-center justify-center py-8">
                  <Loading variant="spinner" size="md" />
                </div>
              ) : isErrorRecent ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm">
                    {(errorRecent as any)?.message ||
                      t("articles.loadPostError")}
                  </p>
                </div>
              ) : recentArticles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">
                    {t("articles.noArticles")}
                  </p>
                </div>
              ) : (
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
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#1967d2] mb-1">
                            {article.date}
                          </p>
                          <h4 className="text-sm font-medium text-gray-900 hover:text-[#1967d2] transition-colors h-10 overflow-hidden line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
