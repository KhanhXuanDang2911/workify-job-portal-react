import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Users,
  Heart,
  Car,
  Briefcase,
  Palette,
  Camera,
  Headphones,
} from "lucide-react";
import CategoryCard from "../CategoryCard";

export default function JobCategories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 8;

  const categories = [
    {
      name: "Web Development",
      jobs: "1,500 Jobs",
      icon: Code,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Human Resource",
      jobs: "9,185 Jobs",
      icon: Users,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Health and Care",
      jobs: "3,205 Jobs",
      icon: Heart,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Automotive Jobs",
      jobs: "2,100 Jobs",
      icon: Car,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Business Development",
      jobs: "1,800 Jobs",
      icon: Briefcase,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Design & Creative",
      jobs: "2,400 Jobs",
      icon: Palette,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Photography",
      jobs: "950 Jobs",
      icon: Camera,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Music & Audio",
      jobs: "750 Jobs",
      icon: Headphones,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Marketing",
      jobs: "1,200 Jobs",
      icon: Briefcase,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Education",
      jobs: "800 Jobs",
      icon: Users,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Finance",
      jobs: "1,600 Jobs",
      icon: Briefcase,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
    {
      name: "Technology",
      jobs: "2,800 Jobs",
      icon: Code,
      color: "text-[#1967d2]",
      bgColor: "bg-blue-50",
    },
  ];

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="py-20 bg-white">
      <div className="main-layout">
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="text-[#1967d2] font-semibold mb-3 text-lg">
              Jobs by Categories
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              Choose Your Desire Category
            </h2>
          </div>
          <div className="hidden lg:block">
            <p className="text-gray-600 max-w-md leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry the standard dummy text ever since the when an printer
              took.
            </p>
          </div>
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
                      .map((category, index) => {
                        const IconComponent = category.icon;
                        return <CategoryCard category={category} />;
                      })}
                  </div>
                </div>
              ))}
            </div>
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

          <div className="text-center mt-8">
            <Button className="bg-[#1967d2] hover:bg-[#1557b8] text-white px-8 py-3">
              All Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
