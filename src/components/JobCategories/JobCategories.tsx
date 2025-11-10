import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Briefcase,
  Palette,
  Laptop,
  Building2,
  Stethoscope,
  GraduationCap,
  TrendingUp,
  Wrench,
  Camera,
  Music,
  UtensilsCrossed,
  Car,
  Plane,
  ShoppingBag,
  Heart,
  Gamepad2,
  DollarSign,
  Users,
  BarChart3,
  FileText,
  Zap,
  Shield,
  Globe,
  Factory,
  Landmark,
  Microscope,
  Beaker,
  PenTool,
  Video,
  Radio,
  ChefHat,
  Dumbbell,
  BookOpen,
  School,
  Hospital,
  Syringe,
  Pill,
  Scissors,
  Hammer,
  Paintbrush,
  Lightbulb,
  Rocket,
  Target,
  Award,
  Scale,
  type LucideIcon,
} from "lucide-react";
import CategoryCard from "../CategoryCard";
import Loading from "../Loading";
import { jobService } from "@/services";
import type { CategoryJobResponse } from "@/types";

export default function JobCategories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 8;

  // Fetch categories from API
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories-job-count"],
    queryFn: () => jobService.getCategoriesWithJobCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Function to get icon based on category name (supports both Vietnamese and English)
  // Maps to actual categories from database
  const getCategoryIcon = (name: string, engName: string): LucideIcon => {
    const searchText = `${name.toLowerCase()} ${engName.toLowerCase()}`;
    
    // IT - Công nghệ thông tin / IT - Information Technology
    if (searchText.includes("it") || searchText.includes("công nghệ thông tin") || 
        searchText.includes("information technology") || searchText.includes("cntt") ||
        searchText.includes("phần mềm") || searchText.includes("software") ||
        searchText.includes("phần cứng") || searchText.includes("hardware") ||
        searchText.includes("mạng") || searchText.includes("networking")) {
      return Code;
    }
    
    // Xây dựng / Bất động sản / Construction / Real Estate
    if (searchText.includes("xây dựng") || searchText.includes("construction") ||
        searchText.includes("bất động sản") || searchText.includes("real estate") ||
        searchText.includes("kiến trúc") || searchText.includes("architecture") ||
        searchText.includes("nội thất") || searchText.includes("interior") ||
        searchText.includes("ngoại thất") || searchText.includes("exterior")) {
      return Building2;
    }
    
    // Truyền thông / Media / Communication
    if (searchText.includes("truyền thông") || searchText.includes("media") ||
        searchText.includes("báo chí") || searchText.includes("journalism") ||
        searchText.includes("biên tập") || searchText.includes("editing") ||
        searchText.includes("xuất bản") || searchText.includes("publishing") ||
        searchText.includes("viễn thông") || searchText.includes("telecommunications")) {
      return Camera;
    }
    
    // Dịch vụ / Services
    if (searchText.includes("dịch vụ") && !searchText.includes("tài chính") && 
        !searchText.includes("khách hàng") && !searchText.includes("ăn uống")) {
      // Check for specific services
      if (searchText.includes("an ninh") || searchText.includes("bảo vệ") || 
          searchText.includes("security") || searchText.includes("guard")) {
        return Shield;
      }
      if (searchText.includes("chăm sóc sức khỏe") || searchText.includes("y tế") ||
          searchText.includes("healthcare") || searchText.includes("medical")) {
        return Stethoscope;
      }
      if (searchText.includes("giáo dục") || searchText.includes("đào tạo") ||
          searchText.includes("education") || searchText.includes("training") ||
          searchText.includes("thư viện") || searchText.includes("library")) {
        return GraduationCap;
      }
      if (searchText.includes("phi chính phủ") || searchText.includes("phi lợi nhuận") ||
          searchText.includes("non-governmental") || searchText.includes("non-profit")) {
        return Heart;
      }
      if (searchText.includes("bán lẻ") || searchText.includes("bán sỉ") ||
          searchText.includes("retail") || searchText.includes("wholesale")) {
        return ShoppingBag;
      }
      return Users; // General services
    }
    
    // Dịch vụ tài chính / Financial Services
    if (searchText.includes("dịch vụ tài chính") || searchText.includes("financial services") ||
        searchText.includes("tài chính") || searchText.includes("finance") ||
        searchText.includes("đầu tư") || searchText.includes("investment") ||
        searchText.includes("ngân hàng") || searchText.includes("banking") ||
        searchText.includes("chứng khoán") || searchText.includes("securities") ||
        searchText.includes("kế toán") || searchText.includes("accounting") ||
        searchText.includes("kiểm toán") || searchText.includes("auditing") ||
        searchText.includes("bảo hiểm") || searchText.includes("insurance")) {
      return DollarSign;
    }
    
    // Giao dịch khách hàng / Customer Transactions
    if (searchText.includes("giao dịch khách hàng") || searchText.includes("customer transactions") ||
        searchText.includes("bán hàng") || searchText.includes("sales") ||
        searchText.includes("kinh doanh") || searchText.includes("business development") ||
        searchText.includes("tiếp thị") || searchText.includes("marketing") ||
        searchText.includes("quảng cáo") || searchText.includes("advertising") ||
        searchText.includes("khuyến mãi") || searchText.includes("promotion") ||
        searchText.includes("đối ngoại") || searchText.includes("public relations") ||
        searchText.includes("thời trang") || searchText.includes("fashion") ||
        searchText.includes("tư vấn dịch vụ khách hàng") || searchText.includes("customer service consulting")) {
      return TrendingUp;
    }
    
    // Khách sạn / Du lịch / Hotel / Tourism
    if (searchText.includes("khách sạn") || searchText.includes("hotel") ||
        searchText.includes("du lịch") || searchText.includes("tourism") ||
        searchText.includes("nhà hàng") || searchText.includes("restaurant") ||
        searchText.includes("dịch vụ ăn uống") || searchText.includes("food service")) {
      return UtensilsCrossed;
    }
    
    // Tư vấn chuyên môn / Professional Consulting
    if (searchText.includes("tư vấn chuyên môn") || searchText.includes("professional consulting") ||
        searchText.includes("tư vấn kỹ thuật") || searchText.includes("technical consulting") ||
        searchText.includes("tư vấn logistics") || searchText.includes("logistics consulting") ||
        searchText.includes("tư vấn marketing") || searchText.includes("marketing consulting") ||
        searchText.includes("tư vấn thương mại") || searchText.includes("trade consulting") ||
        searchText.includes("tư vấn quản trị") || searchText.includes("management consulting") ||
        searchText.includes("tư vấn pháp lý") || searchText.includes("legal consulting") ||
        searchText.includes("tư vấn nhân sự") || searchText.includes("hr consulting")) {
      return Briefcase;
    }
    
    // Kỹ thuật / Engineering / Technical
    if (searchText.includes("kỹ thuật") || searchText.includes("engineering") ||
        searchText.includes("bảo trì") || searchText.includes("maintenance") ||
        searchText.includes("sửa chữa") || searchText.includes("repair") ||
        searchText.includes("điện lạnh") || searchText.includes("refrigeration") ||
        searchText.includes("nhiệt lạnh") || searchText.includes("hvac") ||
        searchText.includes("dược") || searchText.includes("pharmaceutical") ||
        searchText.includes("sinh học") || searchText.includes("biology") ||
        searchText.includes("điện") || searchText.includes("electrical") ||
        searchText.includes("điện tử") || searchText.includes("electronics") ||
        searchText.includes("cơ khí") || searchText.includes("mechanical") ||
        searchText.includes("môi trường") || searchText.includes("environment") ||
        searchText.includes("xử lý chất thải") || searchText.includes("waste treatment")) {
      return Wrench;
    }
    
    // Sản xuất / Manufacturing / Production
    if (searchText.includes("sản xuất") || searchText.includes("manufacturing") ||
        searchText.includes("production") || searchText.includes("vận hành sản xuất") ||
        searchText.includes("production operation") ||
        searchText.includes("an toàn lao động") || searchText.includes("occupational safety") ||
        searchText.includes("dầu khí") || searchText.includes("oil") ||
        searchText.includes("khoáng sản") || searchText.includes("mining") ||
        searchText.includes("dệt may") || searchText.includes("textile") ||
        searchText.includes("da giày") || searchText.includes("footwear") ||
        searchText.includes("đồ gỗ") || searchText.includes("woodwork") ||
        searchText.includes("furniture") ||
        searchText.includes("hóa chất") || searchText.includes("chemical") ||
        searchText.includes("thực phẩm") || searchText.includes("food") ||
        searchText.includes("nông nghiệp") || searchText.includes("agriculture") ||
        searchText.includes("lâm nghiệp") || searchText.includes("forestry") ||
        searchText.includes("ô tô") || searchText.includes("automotive") ||
        searchText.includes("thủy hải sản") || searchText.includes("fisheries") ||
        searchText.includes("aquaculture")) {
      return Factory;
    }
    
    // Hỗ trợ sản xuất / Production Support
    if (searchText.includes("hỗ trợ sản xuất") || searchText.includes("production support") ||
        searchText.includes("quản lý chất lượng") || searchText.includes("quality assurance") ||
        searchText.includes("quality control") || searchText.includes("qa") || searchText.includes("qc") ||
        searchText.includes("vận chuyển") || searchText.includes("transportation") ||
        searchText.includes("giao thông") || searchText.includes("traffic") ||
        searchText.includes("kho bãi") || searchText.includes("warehouse") ||
        searchText.includes("vật tư") || searchText.includes("procurement") ||
        searchText.includes("thu mua") || searchText.includes("purchasing") ||
        searchText.includes("xuất nhập khẩu") || searchText.includes("import") ||
        searchText.includes("export") || searchText.includes("ngoại thương") ||
        searchText.includes("international trade")) {
      return Car;
    }
    
    // Bộ phận hỗ trợ / Support Department
    if (searchText.includes("bộ phận hỗ trợ") || searchText.includes("support department") ||
        searchText.includes("biên phiên dịch") || searchText.includes("translation") ||
        searchText.includes("thông dịch viên") || searchText.includes("interpretation") ||
        searchText.includes("tiếng nhật") || searchText.includes("japanese language") ||
        searchText.includes("pháp lý") || searchText.includes("legal") ||
        searchText.includes("luật") || searchText.includes("law") ||
        searchText.includes("thư ký") || searchText.includes("secretary") ||
        searchText.includes("hành chính") || searchText.includes("administration")) {
      return FileText;
    }
    
    // Theo đối tượng / By Target Audience
    if (searchText.includes("theo đối tượng") || searchText.includes("by target audience") ||
        searchText.includes("lao động phổ thông") || searchText.includes("manual labor") ||
        searchText.includes("mới tốt nghiệp") || searchText.includes("fresh graduate") ||
        searchText.includes("thực tập") || searchText.includes("internship") ||
        searchText.includes("người nước ngoài") || searchText.includes("foreigners") ||
        searchText.includes("quản lý điều hành") || searchText.includes("management") ||
        searchText.includes("executive")) {
      return Users;
    }
    
    // Nghệ thuật / Thiết kế / Giải trí / Art / Design / Entertainment
    if (searchText.includes("nghệ thuật") || searchText.includes("art") ||
        searchText.includes("thiết kế") || searchText.includes("design") ||
        searchText.includes("giải trí") || searchText.includes("entertainment") ||
        searchText.includes("music") || searchText.includes("âm nhạc")) {
      return Palette;
    }
    
    // Khác / Others
    if (searchText.includes("khác") || searchText.includes("others") ||
        searchText.includes("other")) {
      return Briefcase;
    }
    
    // Default fallback
    return Briefcase;
  };

  const colorSchemes = [
    { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", hoverBg: "hover:bg-blue-100" },
    { color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200", hoverBg: "hover:bg-purple-100" },
    { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", hoverBg: "hover:bg-green-100" },
    { color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", hoverBg: "hover:bg-orange-100" },
    { color: "text-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200", hoverBg: "hover:bg-pink-100" },
    { color: "text-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-200", hoverBg: "hover:bg-indigo-100" },
    { color: "text-teal-600", bgColor: "bg-teal-50", borderColor: "border-teal-200", hoverBg: "hover:bg-teal-100" },
    { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", hoverBg: "hover:bg-red-100" },
  ];

  // Transform API data to component format
  const categories = useMemo(() => {
    if (!categoriesResponse?.data) return [];

    return categoriesResponse.data.map((category: CategoryJobResponse, index: number) => {
      // Calculate total jobs by summing jobCount from all industries
      const totalJobs = category.industries.reduce(
        (sum, industry) => sum + (industry.jobCount || 0),
        0
      );

      // Format jobs count with comma separator
      const formattedJobs = totalJobs.toLocaleString("en-US");

      // Get icon based on category name (both Vietnamese and English)
      const icon = getCategoryIcon(category.name, category.engName || "");
      
      // Get color scheme based on index for variety
      const colorIndex = index % colorSchemes.length;
      const scheme = colorSchemes[colorIndex];

      return {
        name: category.name,
        jobs: `${formattedJobs} Jobs`,
        icon: icon,
        color: scheme.color,
        bgColor: scheme.bgColor,
        borderColor: scheme.borderColor,
        hoverBg: scheme.hoverBg,
      };
    });
  }, [categoriesResponse?.data]);

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Reset slide to 0 when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setCurrentSlide(0);
    }
  }, [categories.length]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="main-layout">
          <div className="flex items-center justify-center py-20">
            <Loading variant="spinner" size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="main-layout">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="main-layout relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#1967d2] rounded-full animate-pulse"></span>
            <p className="text-[#1967d2] font-semibold text-sm">
              Explore Opportunities
            </p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Browse Jobs by{" "}
            <span className="bg-gradient-to-r from-[#1967d2] to-[#1557b8] bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of opportunities across various industries. Find the perfect match for your skills and career goals.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide
                      )
                      .map((category, index) => (
                        <CategoryCard key={`${slideIndex}-${index}`} category={category} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
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
                {Array.from({ length: totalSlides }).map((_, index) => (
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
          )}

          {/* <div className="text-center mt-8">
            <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
              All Categories
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
