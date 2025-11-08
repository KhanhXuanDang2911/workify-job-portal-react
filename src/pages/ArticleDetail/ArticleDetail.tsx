import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import RecentArticlesSidebar from "../../components/RecentArticlesSidebar";
import TagsSidebar from "../../components/TagsSidebar";
import SuggestedJobs from "../../components/SuggestedJob";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { routes } from "@/routes/routes.const";
import type { PostResponse, PostCategory } from "@/types/post.type";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Fetch article by ID
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

  const handleCategoryClick = (categoryId: number | null) => {
    // Navigate to articles page with category filter
    if (categoryId) {
      navigate(`/${routes.ARTICLES}?categoryId=${categoryId}`);
    } else {
      navigate(`/${routes.ARTICLES}`);
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

  const suggestedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc",
      salary: "$5,000",
      type: "Full-time",
      typeColor: "bg-green-500",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Agency",
      salary: "$4,200",
      type: "Remote",
      typeColor: "bg-blue-500",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartUp Co",
      salary: "$6,000",
      type: "Hybrid",
      typeColor: "bg-purple-500",
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Analytics Pro",
      salary: "$3,800",
      type: "Part-time",
      typeColor: "bg-orange-500",
    },
  ];

  // Parse tags from string
  const tags =
    articleData?.tags && typeof articleData.tags === "string"
      ? articleData.tags.split("|").filter((tag) => tag.trim())
      : [];

  // Process HTML content to add IDs to headings and generate TOC
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

  // Generate table of contents from processed HTML content
  useEffect(() => {
    if (!processedContent) return;

    // Wait for content to be rendered in DOM
    const timer = setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(processedContent, "text/html");
      const headings = doc.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");

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
    // Prevent default if it's a button click
    const scrollToHeading = () => {
      const element = document.getElementById(id);
      if (element) {
        // Calculate position with offset
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offset = 100; // 100px above the heading
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

    // Try immediately first
    if (!scrollToHeading()) {
      // If element not found, wait for DOM to update
      setTimeout(() => {
        if (!scrollToHeading()) {
          // Last retry after longer delay
          setTimeout(scrollToHeading, 300);
        }
      }, 100);
    }
  };

  // Copy link functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Format article data
  const article = articleData
    ? {
        title: articleData.title,
        author: articleData.author?.fullName || articleData.author?.email || "",
        date: articleData.createdAt
          ? new Date(articleData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
        readTime: `${articleData.readingTimeMinutes || 0} min read`,
        tags: tags,
        category: articleData.category?.title || "",
        content: articleData.content || "",
      }
    : null;

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (isErrorArticle || !articleData || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {isErrorArticle
              ? "Error loading article. Please try again later."
              : "Article not found."}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/articles")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/articles")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </div> */}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Article header */}
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

              {/* Author info and social sharing */}
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
                      <span>Đăng ngày: {article.date}</span>
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
                    Copy link
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
                    Mục Lục
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
                Categories
              </h3>
              <div className="space-y-3">
                <div
                  className="text-sm cursor-pointer transition-colors text-gray-600 hover:text-[#1967d2]"
                  onClick={() => handleCategoryClick(null)}
                >
                  All Categories
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
            </div>

            <RecentArticlesSidebar articles={recentArticles} />
            <TagsSidebar tags={tags} />

            <div>
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Việc Làm Hấp Dẫn
              </h3>
              <SuggestedJobs
                jobs={suggestedJobs}
                onViewAll={() => navigate("/job-search")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
