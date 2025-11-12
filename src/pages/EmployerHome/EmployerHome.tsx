import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Zap, BarChart3 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function EmployerHome() {
  const { t } = useTranslation();
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative h-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #e8f1fc 0%, #e8eef7 50%, #e0e7f1 100%)",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large blur shape top right */}
          <div
            className="absolute -top-32 -right-32 w-[800px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(185, 212, 250, 0.4) 0%, transparent 70%)",
              animation: "float-slow 20s ease-in-out infinite",
            }}
          ></div>

          {/* Medium blur shape bottom left */}
          <div
            className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200, 220, 255, 0.3) 0%, transparent 70%)",
              animation: "float-slow 25s ease-in-out infinite 2s",
            }}
          ></div>

          {/* Decorative dots grid - top right area */}
          <div
            className="absolute top-[20%] right-[8%] w-32 h-32 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
              backgroundSize: "16px 16px",
              animation: "float-slow 15s ease-in-out infinite",
            }}
          ></div>

          {/* Decorative dots grid - bottom left area */}
          <div
            className="absolute bottom-[25%] left-[5%] w-24 h-24 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
              backgroundSize: "14px 14px",
              animation: "float-slow 18s ease-in-out infinite 3s",
            }}
          ></div>
        </div>

        <div className="main-layout relative z-10 h-full flex items-center pt-2 pb-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
            {/* Hero Content */}
            <div className="space-y-7">
              <div
                className="space-y-5"
                style={{
                  animation: "fadeInUp 0.8s ease-out",
                }}
              >
                <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.15]">
                  <span className="text-[#1e3a5f]">
                    {t("employer.hero.titlePart1")}{" "}
                  </span>
                  <span className="text-[#4a6cf7]">
                    {t("employer.hero.titlePart2")}
                  </span>
                  <br />
                  <span className="text-[#1e3a5f]">
                    {t("employer.hero.titlePart3")}
                  </span>
                </h1>

                <p className="text-[17px] text-[#66789c] leading-relaxed max-w-[520px]">
                  {t("employer.hero.description")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.2s both",
                }}
              >
                <Button
                  size="lg"
                  className="bg-[#4a6cf7] hover:bg-[#3d5ce6] text-white font-semibold px-10 py-7 h-16 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl group"
                >
                  {t("employer.hero.postJob")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#4a6cf7] text-[#4a6cf7] hover:bg-[#4a6cf7] hover:text-white font-semibold px-10 py-7 h-16 text-lg transition-all duration-200 rounded-xl bg-white group"
                >
                  {t("employer.hero.learnMore")}
                </Button>
              </div>

              {/* Benefits Grid */}
              <div
                className="grid grid-cols-3 gap-4"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center mb-2.5 group-hover:bg-[#4a6cf7] transition-colors duration-300">
                    <Users className="w-5 h-5 text-[#4a6cf7] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                    3M+
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t("employer.hero.candidates")}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center mb-2.5 group-hover:bg-green-500 transition-colors duration-300">
                    <Zap className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                    60%
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t("employer.hero.fasterHire")}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mb-2.5 group-hover:bg-purple-500 transition-colors duration-300">
                    <BarChart3 className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                    95%
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t("employer.hero.matchRate")}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div
              className="relative hidden lg:block"
              style={{
                animation: "fadeInRight 1s ease-out 0.2s both",
              }}
            >
              <div className="relative">
                {/* Top Image */}
                <div
                  className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-[#4a6cf7] z-10"
                  style={{
                    animation: "float-simple 6s ease-in-out infinite",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=90"
                    alt="Recruitment team"
                    className="w-full h-[280px] object-cover"
                  />
                </div>

                {/* Bottom Image - overlapping */}
                <div
                  className="absolute top-[220px] left-12 rounded-[32px] overflow-hidden shadow-xl border-4 border-[#4a6cf7]"
                  style={{
                    animation: "float-simple 6s ease-in-out infinite 0.5s",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=90"
                    alt="Job interview"
                    className="w-[420px] h-[280px] object-cover"
                  />
                </div>

                {/* Decorative dots grid - right side */}
                <div
                  className="absolute top-[40%] -right-8 w-28 h-28 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #5b8fd7 3px, transparent 3px)",
                    backgroundSize: "16px 16px",
                    animation: "float-slow 12s ease-in-out infinite",
                  }}
                ></div>

                {/* Decorative dots grid - bottom */}
                <div
                  className="absolute bottom-4 left-[45%] w-20 h-20 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #5b8fd7 2px, transparent 2px)",
                    backgroundSize: "14px 14px",
                    animation: "float-slow 10s ease-in-out infinite 1s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
