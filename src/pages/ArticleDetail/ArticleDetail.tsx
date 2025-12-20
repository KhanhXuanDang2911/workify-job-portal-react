import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  Clock,
  User,
} from "lucide-react";
import TagsSidebar from "../../components/TagsSidebar";
import SuggestedJobs from "../../components/SuggestedJob";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { jobService } from "@/services/job.service";
import { routes } from "@/routes/routes.const";
import type { PostResponse, PostCategory } from "@/types/post.type";
import type { JobResponse } from "@/types/job.type";
import { JobTypeLabelVN } from "@/constants/job.constant";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserAuth } from "@/context/UserAuth";
import PageTitle from "@/components/PageTitle/PageTitle";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleDetail() {
  const { t } = useTranslation();
  const { state: userAuth } = useUserAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  const {
    data: articleResponse,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPostById(Number(id)),
    enabled: !!id,
  });

  const articleData: PostResponse | undefined = articleResponse?.data;

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
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
  });

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId) {
      navigate(`/${routes.ARTICLES}?categoryId=${categoryId}`);
    } else {
      navigate(`/${routes.ARTICLES}`);
    }
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

  const formatSalary = (job: JobResponse): string => {
    try {
      if (job.salaryType === "RANGE") {
        const min =
          job.minSalary != null ? Number(job.minSalary).toLocaleString() : null;
        const max =
          job.maxSalary != null ? Number(job.maxSalary).toLocaleString() : null;
        return `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} ${job.salaryUnit ?? ""}`.trim();
      }
      if (job.salaryType === "GREATER_THAN" && job.minSalary != null) {
        return `${Number(job.minSalary).toLocaleString()} ${job.salaryUnit ?? ""}`;
      }
      if (job.salaryType === "NEGOTIABLE") return t("jobDetail.negotiable");
      if (job.minSalary != null)
        return `${Number(job.minSalary).toLocaleString()} ${job.salaryUnit ?? ""}`;
      return t("jobDetail.negotiable");
    } catch (e) {
      return t("jobDetail.negotiable");
    }
  };

  const mapTypeColor = (jobType?: string): string => {
    if (!jobType) return "bg-gray-400";
    if (jobType.includes("FULL") || jobType.includes("TEMPORARY_FULL"))
      return "bg-green-500";
    if (jobType.includes("PART")) return "bg-orange-500";
    if (jobType.includes("CONTRACT")) return "bg-purple-500";
    return "bg-blue-500";
  };

  const userIndustryId = userAuth?.user?.industry?.id;

  const {
    data: topAttractiveResponse,
    isLoading: isLoadingJobs,
    isError: isErrorJobs,
    error: errorJobs,
  } = useQuery({
    queryKey: ["top-attractive-jobs", 4, userIndustryId ?? null],
    queryFn: () =>
      jobService.getTopAttractiveJobs(
        4,
        userIndustryId ? { industryId: Number(userIndustryId) } : undefined
      ),
    staleTime: 5 * 60 * 1000,
  });

  const suggestedJobs = useMemo(() => {
    if (!topAttractiveResponse?.data) return [];
    return topAttractiveResponse.data.map((job) => {
      return {
        id: job.id,
        title: job.jobTitle || "",
        company: job.companyName || job.author?.companyName || "",
        salary: formatSalary(job),
        type:
          JobTypeLabelVN[job.jobType as keyof typeof JobTypeLabelVN] ||
          job.jobType,
        typeColor: mapTypeColor(job.jobType),
        logo:
          job.author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/previews/008/214/517/large_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
      };
    });
  }, [topAttractiveResponse]);

  const tags =
    articleData?.tags && typeof articleData.tags === "string"
      ? articleData.tags.split("|").filter((tag) => tag.trim())
      : [];

  const processedContent = articleData?.content
    ? (() => {
        let headingIndex = 0;
        return articleData.content.replace(/(<h[1-6])>/g, (_match, tag) => {
          const id = `heading-${headingIndex}`;
          headingIndex++;
          return `${tag} id="${id}">`;
        });
      })()
    : "";

  useEffect(() => {
    if (!processedContent) return;

    const timer = setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(processedContent, "text/html");
      const headings = doc.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
      );

      const items: TOCItem[] = Array.from(headings).map((heading) => {
        const id = heading.id || "";
        const level = Number.parseInt(heading.tagName.charAt(1));
        return {
          id,
          text: heading.textContent || "",
          level,
        };
      });

      setTocItems(items);
    }, 100);

    return () => clearTimeout(timer);
  }, [processedContent]);

  const handleTOCClick = (id: string) => {
    const scrollToHeading = () => {
      const element = document.getElementById(id);
      if (element) {
        const elementTop =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offset = 100;
        const targetPosition = elementTop - offset;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        });
        setActiveSection(id);
        return true;
      }
      return false;
    };

    if (!scrollToHeading()) {
      setTimeout(() => {
        if (!scrollToHeading()) {
          setTimeout(scrollToHeading, 300);
        }
      }, 100);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const article = articleData
    ? {
        title: articleData.title,
        author:
          articleData.userAuthor?.fullName ||
          articleData.userAuthor?.email ||
          articleData.employerAuthor?.companyName ||
          articleData.employerAuthor?.email ||
          "",
        date: articleData.createdAt
          ? new Date(articleData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
        readTime: `${articleData.readingTimeMinutes || 0} ${t("articleDetail.minRead")}`,
        tags: tags,
        category: articleData.category?.title || "",
        content: articleData.content || "",
      }
    : null;

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  if (isErrorArticle || !articleData || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {isErrorArticle
              ? t("articleDetail.loadError")
              : t("articleDetail.notFound")}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(`/${routes.ARTICLES}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("articleDetail.backToArticles")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {article && <PageTitle title={article.title} />}
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
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-[#1967d2] text-white">
                  {article.category}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {article.author}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {t("articleDetail.postedOn")}: {article.date}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                    {t("articleDetail.copyLink")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {tocItems.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 mb-8 border border-blue-200 shadow-sm">
                  <h3 className="text-xl font-bold text-[#1967d2] mb-4 text-center flex items-center justify-center gap-2">
                    <div className="w-8 h-1 bg-[#1967d2] rounded"></div>
                    {t("articleDetail.tableOfContents")}
                    <div className="w-8 h-1 bg-[#1967d2] rounded"></div>
                  </h3>
                  <div className="space-y-0.5">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTOCClick(item.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                          activeSection === item.id
                            ? "text-white bg-[#1967d2] shadow-md"
                            : "text-gray-700 hover:text-[#1967d2] hover:bg-white hover:shadow-sm"
                        }`}
                        style={{
                          paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <style>{`
                .prose img {
                  display: block;
                  margin: 2rem auto;
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
              `}</style>

              {/* Article content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                {t("articleDetail.categories")}
              </h3>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-8">
                  <Loading variant="spinner" size="md" />
                </div>
              ) : isErrorCategories ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm">
                    {(errorCategories as any)?.message ||
                      t("articleDetail.loadCategoriesError")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  <div
                    className="text-sm cursor-pointer transition-colors text-gray-600 hover:text-[#1967d2]"
                    onClick={() => handleCategoryClick(null)}
                  >
                    {t("articleDetail.allCategories")}
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="text-sm cursor-pointer transition-colors text-gray-600 hover:text-[#1967d2]"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                {t("articleDetail.recentArticle")}
              </h3>
              {isLoadingRecent ? (
                <div className="flex items-center justify-center py-8">
                  <Loading variant="spinner" size="md" />
                </div>
              ) : isErrorRecent ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm">
                    {(errorRecent as any)?.message ||
                      t("articleDetail.loadPostsError")}
                  </p>
                </div>
              ) : recentArticles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">
                    {t("articleDetail.noArticles")}
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

            {tags.length > 0 && <TagsSidebar tags={tags} />}

            <div>
              {isLoadingJobs ? (
                <div className="flex items-center justify-center py-8">
                  <Loading variant="spinner" size="md" />
                </div>
              ) : isErrorJobs ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm">
                    {(errorJobs as any)?.message ||
                      t("articleDetail.loadJobsError")}
                  </p>
                </div>
              ) : suggestedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">
                    {t("articleDetail.noJobs")}
                  </p>
                </div>
              ) : (
                <SuggestedJobs
                  jobs={suggestedJobs}
                  onViewAll={() => navigate(`/${routes.JOB_SEARCH}`)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
