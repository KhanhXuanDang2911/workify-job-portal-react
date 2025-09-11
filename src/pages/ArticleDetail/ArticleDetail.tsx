import { useState, useEffect } from "react";
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
import CategoriesSidebar from "../../components/CategoriesSidebar";
import RecentArticlesSidebar from "../../components/RecentArticlesSidebar";
import TagsSidebar from "../../components/TagsSidebar";
import SuggestedJobs from "../../components/SuggestedJob";
import ArticleCard from "../../components/ArticleCard";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleDetail() {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Sample article data with HTML content including images
  const article = {
    title: "5 things to know about the March 2023 jobs report",
    author: "David Wish",
    date: "March 05, 2023",
    readTime: "5 min read",
    tags: ["Report", "Analysis", "Jobs", "Market"],
    category: "Market Insights",
    content: `
      <h1>Life Coach là gì?</h1>
      <p>Life Coach là một chuyên gia hỗ trợ cá nhân phát triển bản thân, đạt được mục tiêu và cải thiện chất lượng cuộc sống. Họ không đưa ra lời khuyên trực tiếp mà giúp khách hàng tự khám phá và tìm ra giải pháp phù hợp.</p>
      
      <img src="https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg" alt="Life Coach consultation" />
      
      <h2>Nghề Life Coach: Nguồn gốc và sự phát triển</h2>
      <p>Nghề Life Coach xuất hiện từ những năm 1980 tại Mỹ và nhanh chóng lan rộng ra toàn thế giới. Ngành này phát triển mạnh mẽ nhờ nhu cầu ngày càng tăng về phát triển cá nhân và cải thiện chất lượng cuộc sống.</p>
      
      <h2>Vai trò và lợi ích của Life Coach</h2>
      <p>Life Coach đóng vai trò như một người đồng hành, giúp khách hàng:</p>
      <ul>
        <li>Xác định mục tiêu rõ ràng</li>
        <li>Phát triển kế hoạch hành động</li>
        <li>Vượt qua các rào cản tâm lý</li>
        <li>Tăng cường động lực và tự tin</li>
      </ul>
      
      <img src="https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg" alt="Professional coaching session" />
      
      <h2>Quy trình Life Coaching và khi nào nên tìm Life Coach</h2>
      <p>Quy trình Life Coaching thường bao gồm các bước: đánh giá hiện trạng, xác định mục tiêu, lập kế hoạch, thực hiện và theo dõi tiến độ. Bạn nên tìm Life Coach khi cảm thấy bế tắc trong cuộc sống hoặc muốn đạt được những mục tiêu lớn.</p>
      
      <h2>Phân loại Life Coach theo lĩnh vực chuyên môn</h2>
      <p>Life Coach có thể chuyên về nhiều lĩnh vực khác nhau như:</p>
      <ul>
        <li>Career Coach - Phát triển sự nghiệp</li>
        <li>Relationship Coach - Cải thiện mối quan hệ</li>
        <li>Health Coach - Sức khỏe và lối sống</li>
        <li>Business Coach - Phát triển kinh doanh</li>
      </ul>
      
      <img src="https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg" alt="Business coaching meeting" />
      
      <h2>Kỹ năng và chứng chỉ cần có của một Life Coach</h2>
      <p>Một Life Coach chuyên nghiệp cần có các kỹ năng: lắng nghe tích cực, đặt câu hỏi hiệu quả, giao tiếp xuất sắc, và khả năng tạo động lực. Các chứng chỉ từ ICF (International Coach Federation) được đánh giá cao trong ngành.</p>
      
      <h2>Nghề Life Coach: Cơ hội và thách thức</h2>
      <p>Nghề Life Coach mang lại nhiều cơ hội phát triển và thu nhập hấp dẫn, tuy nhiên cũng đối mặt với thách thức về việc xây dựng uy tín và tìm kiếm khách hàng trong thị trường cạnh tranh.</p>
      
      <h2>Câu hỏi thường gặp về Life Coach</h2>
      <p>Một số câu hỏi phổ biến về Life Coach bao gồm: chi phí dịch vụ, thời gian cần thiết để thấy kết quả, và sự khác biệt giữa Life Coach và tâm lý trị liệu.</p>
    `,
  };

  // Sample data for sidebars
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

  const authorArticles = [
    {
      title: "How to convince recruiters and get your dream job",
      author: "David Wish",
      date: "February 28, 2023",
      excerpt:
        "Learn the essential strategies to stand out in the competitive job market.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
      tags: ["Career", "Tips"],
      category: "Career Advice",
    },
    {
      title: "Advanced Service Functions by Air Transport",
      author: "David Wish",
      date: "February 15, 2023",
      excerpt:
        "Exploring the latest innovations in air transport service delivery.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg",
      tags: ["Transport", "Innovation"],
      category: "Industry News",
    },
    {
      title: "The Future of Remote Work in 2023",
      author: "David Wish",
      date: "January 20, 2023",
      excerpt:
        "Analyzing trends and predictions for remote work opportunities.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
      tags: ["Remote", "Future"],
      category: "Market Insights",
    },
  ];

  const relatedArticles = [
    {
      title: "Job Board is the most important sector in the world",
      author: "Mike Doe",
      date: "March 10, 2023",
      excerpt:
        "Understanding the critical role of job boards in modern recruitment.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg1.jpg",
      tags: ["Industry", "Growth"],
      category: "Industry News",
    },
    {
      title: "Equipment you can count on. People you can trust.",
      author: "Mark Petter",
      date: "March 08, 2023",
      excerpt: "Building reliable partnerships in the business world.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg2.jpg",
      tags: ["Business", "Trust"],
      category: "Business",
    },
    {
      title: "Proper arrangement for keeping the goods in the warehouse",
      author: "Sarah Johnson",
      date: "March 01, 2023",
      excerpt:
        "Best practices for efficient warehouse management and organization.",
      image:
        "https://thewebmax.org/react/jobzilla/assets/images/blog/latest/bg3.jpg",
      tags: ["Warehouse", "Management"],
      category: "Operations",
    },
  ];

  // Generate table of contents from HTML content
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`;
      const level = Number.parseInt(heading.tagName.charAt(1));
      return {
        id,
        text: heading.textContent || "",
        level,
      };
    });

    setTocItems(items);
  }, [article.content]);

  const handleTOCClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // 100px above the heading

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // Copy link functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Process HTML content to add IDs to headings
  const processedContent = article.content.replace(
    /<(h[1-6])>/g,
    (match, tag, offset) => {
      const index = (
        article.content.substring(0, offset).match(/<h[1-6]>/g) || []
      ).length;
      return `<${tag} id="heading-${index}">`;
    }
  );

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
            Back to Articles
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Article header - removed hero image */}
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

            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-[#1967d2] mb-6">
                Bài Viết Mới Nhất Của Tác Giả
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorArticles.map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1967d2] mb-6">
                Có Thể Bạn Quan Tâm
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CategoriesSidebar categories={categories} />
            <RecentArticlesSidebar articles={recentArticles} />
            <TagsSidebar tags={tags} />

            <div>
              <h3 className="text-lg font-semibold text-[#1967d2] mb-4">
                Việc Làm Hấp Dẫn
              </h3>
              <SuggestedJobs
                jobs={suggestedJobs}
                onViewAll={() => (window.location.href = "/job-search")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
