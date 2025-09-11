import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

export default function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const articlesPerPage = 6;

  const allArticles = [
    {
      title: "How to convince recruiters and get your dream job",
      author: "Mark Petter",
      date: "March 05, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
      tags: ["Career", "Tips"],
      category: "Career Advice",
    },
    {
      title: "5 things to know about the March 2023 jobs report",
      author: "David Wish",
      date: "March 05, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
      tags: ["Report", "Analysis"],
      category: "Market Insights",
    },
    {
      title: "Job Board is the most important sector in the world",
      author: "Mike Doe",
      date: "March 05, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg",
      tags: ["Industry", "Growth"],
      category: "Industry News",
    },
    {
      title: "How to convince recruiters and get your dream job",
      author: "Mark Petter",
      date: "March 05, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
      tags: ["Career", "Tips"],
      category: "Career Advice",
    },
    {
      title: "Advanced Service Functions by Air Transport",
      author: "David Wish",
      date: "April 12, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
      tags: ["Transport", "Service"],
      category: "Information",
    },
    {
      title: "Proper arrangement for keeping the goods in the warehouse",
      author: "Mike Doe",
      date: "April 15, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg",
      tags: ["Warehouse", "Management"],
      category: "Learn",
    },
    {
      title: "Equipment you can count on. People you can trust.",
      author: "Mark Petter",
      date: "April 08, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
      tags: ["Equipment", "Trust"],
      category: "Jobs",
    },
    {
      title: "Proper arrangement for keeping the goods in the warehouse",
      author: "David Wish",
      date: "April 20, 2023",
      excerpt:
        "New chip traps clusters of migrating tumor cells asperiores, blanditiis odit.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
      tags: ["Warehouse", "Goods"],
      category: "Skill",
    },
  ];

  const categories = [
    { name: "Categories", count: 68 },
    { name: "Education", count: 12 },
    { name: "Information", count: 15 },
    { name: "Jobs", count: 25 },
    { name: "Learn", count: 36 },
    { name: "Skill", count: 12 },
  ];

  const recentArticles = [
    {
      title: "Equipment you can count on. People you can trust.",
      date: "April 08, 2023",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
    },
    {
      title: "Advanced Service Functions by Air Transport",
      date: "April 12, 2023",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
    },
    {
      title: "Proper arrangement for keeping the goods in the warehouse",
      date: "April 15, 2023",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg",
    },
    {
      title: "Equipment you can count on. People you can trust.",
      date: "April 18, 2023",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
    },
    {
      title: "Proper arrangement for keeping the goods in the warehouse",
      date: "April 20, 2023",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
    },
  ];

  const tags = [
    "General",
    "Jobs",
    "Payment",
    "Application",
    "Work",
    "Recruiting",
    "Employer",
    "Income",
    "Tips",
  ];

  const filteredArticles = allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Articles
              </h1>
              <p className="text-gray-600">
                Discover the latest insights and tips for your career journey
              </p>
            </div>

            {/* Articles grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {currentArticles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 hover:text-[#1967d2] cursor-pointer transition-colors">
                      {category.name}
                    </span>
                    <span className="text-gray-400">{category.count}</span>
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
                {recentArticles.map((article, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-16 h-16 object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-[#1967d2] mb-1">
                        {article.date}
                      </p>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#1967d2] cursor-pointer transition-colors">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-[#1967d2] hover:text-white transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
