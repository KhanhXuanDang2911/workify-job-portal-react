import React, { useEffect, useRef, useState, type RefObject } from "react";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import {
  templatePandaDummyVi,
  templatePandaDummyEn,
} from "@/templates/TemplatePanda/dummy";
import {
  templateRabbitDummyVi,
  templateRabbitDummyEn,
} from "@/templates/TemplateRabbit/dummy";
import { useResume } from "@/context/ResumeContext/useResume";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/context/user-auth/useUserAuth";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import {
  templateLionDummyVi,
  templateLionDummyEn,
} from "@/templates/TemplateLion/dummy";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import {
  templateDolphinDummyVi,
  templateDolphinDummyEn,
} from "@/templates/TemplateDolphin/dummy";
import TemplateTiger from "@/templates/TemplateTiger/TemplateTiger";
import {
  templateTigerDummyVi,
  templateTigerDummyEn,
} from "@/templates/TemplateTiger/dummy";
import TemplateEagle from "@/templates/TemplateEagle/TemplateEagle";
import {
  templateEagleDummyVi,
  templateEagleDummyEn,
} from "@/templates/TemplateEagle/dummy";
import TemplateProfessional1 from "@/templates/TemplateProfessional1/TemplateProfessional1";
import {
  templateProfessional1DummyVi,
  templateProfessional1DummyEn,
} from "@/templates/TemplateProfessional1/dummy";
import TemplateProfessional2 from "@/templates/TemplateProfessional2/TemplateProfessional2";
import {
  templateProfessional2DummyVi,
  templateProfessional2DummyEn,
} from "@/templates/TemplateProfessional2/dummy";
import TemplateProfessional3 from "@/templates/TemplateProfessional3/TemplateProfessional3";
import {
  templateProfessional3DummyVi,
  templateProfessional3DummyEn,
} from "@/templates/TemplateProfessional3/dummy";
import TemplateProfessional4 from "../../templates/TemplateProfessional4/TemplateProfessional4";
import {
  templateProfessional4DummyVi,
  templateProfessional4DummyEn,
} from "../../templates/TemplateProfessional4/dummy";
import TemplateHavard1 from "@/templates/TemplateHavard1/TemplateHavard1";
import {
  templateHavard1DummyVi,
  templateHavard1DummyEn,
} from "@/templates/TemplateHavard1/dummy";
import TemplateHavard2 from "@/templates/TemplateHavard2/TemplateHavard2";
import {
  templateHavard2DummyVi,
  templateHavard2DummyEn,
} from "@/templates/TemplateHavard2/dummy";
import { useTranslation } from "react-i18next";
import { Sparkles, FileText, Filter } from "lucide-react";
import LoginRequiredModal from "@/components/LoginRequiredModal/LoginRequiredModal";

type TemplateItem<P = any> = {
  id: string;
  name: string;
  component: React.FC<P>;
  type: TemplateType;
  dummyDataVi: ResumeData;
  dummyDataEn: ResumeData;
  categories: string[];
};

// Reordered templates: Havard -> Professional -> Animal (Creative)
const templates: TemplateItem<{
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
}>[] = [
  // Harvard Series
  {
    id: "template-havard-1",
    name: "Havard 1 (Classic)",
    component: TemplateHavard1,
    type: "TEMPLATE-HAVARD-1",
    dummyDataVi: templateHavard1DummyVi,
    dummyDataEn: templateHavard1DummyEn,
    categories: ["havard", "no-avatar"],
  },
  {
    id: "template-havard-2",
    name: "Havard 2 (Sidebar)",
    component: TemplateHavard2,
    type: "TEMPLATE-HAVARD-2",
    dummyDataVi: templateHavard2DummyVi,
    dummyDataEn: templateHavard2DummyEn,
    categories: ["havard", "no-avatar"],
  },

  // Professional Series
  {
    id: "template-professional-1",
    name: "Professional 1",
    component: TemplateProfessional1,
    type: "TEMPLATE-PROFESSIONAL-1",
    dummyDataVi: templateProfessional1DummyVi,
    dummyDataEn: templateProfessional1DummyEn,
    categories: ["professional", "avatar"],
  },
  {
    id: "template-professional-2",
    name: "Professional 2",
    component: TemplateProfessional2,
    type: "TEMPLATE-PROFESSIONAL-2",
    dummyDataVi: templateProfessional2DummyVi,
    dummyDataEn: templateProfessional2DummyEn,
    categories: ["professional", "avatar"],
  },
  {
    id: "template-professional-3",
    name: "Professional 3",
    component: TemplateProfessional3,
    type: "TEMPLATE-PROFESSIONAL-3",
    dummyDataVi: templateProfessional3DummyVi,
    dummyDataEn: templateProfessional3DummyEn,
    categories: ["professional", "avatar"],
  },
  {
    id: "template-professional-4",
    name: "Professional 4",
    component: TemplateProfessional4,
    type: "TEMPLATE-PROFESSIONAL-4",
    dummyDataVi: templateProfessional4DummyVi,
    dummyDataEn: templateProfessional4DummyEn,
    categories: ["professional", "no-avatar"],
  },

  // Animal / Creative Series (Moved to bottom)
  {
    id: "template-tiger",
    name: "Template Tiger",
    component: TemplateTiger,
    type: "TEMPLATE-TIGER",
    dummyDataVi: templateTigerDummyVi,
    dummyDataEn: templateTigerDummyEn,
    categories: ["creative", "avatar"],
  },
  {
    id: "template-eagle",
    name: "Template Eagle",
    component: TemplateEagle,
    type: "TEMPLATE-EAGLE",
    dummyDataVi: templateEagleDummyVi,
    dummyDataEn: templateEagleDummyEn,
    categories: ["creative", "avatar"],
  },
  {
    id: "template-panda",
    name: "Template Panda",
    component: TemplatePanda,
    type: "TEMPLATE-PANDA",
    dummyDataVi: templatePandaDummyVi,
    dummyDataEn: templatePandaDummyEn,
    categories: ["creative", "avatar"],
  },
  {
    id: "template-rabbit",
    name: "Template Rabbit",
    component: TemplateRabbit,
    type: "TEMPLATE-RABBIT",
    dummyDataVi: templateRabbitDummyVi,
    dummyDataEn: templateRabbitDummyEn,
    categories: ["creative", "avatar"],
  },
  {
    id: "template-lion",
    name: "Template Lion",
    component: TemplateLion,
    type: "TEMPLATE-LION",
    dummyDataVi: templateLionDummyVi,
    dummyDataEn: templateLionDummyEn,
    categories: ["creative", "avatar"],
  },
  {
    id: "template-dolphin",
    name: "Template Dolphin",
    component: TemplateDolphin,
    type: "TEMPLATE-DOLPHIN",
    dummyDataVi: templateDolphinDummyVi,
    dummyDataEn: templateDolphinDummyEn,
    categories: ["creative", "avatar"],
  },
];

const TEMPLATE_WIDTH = 900; // chiều rộng gốc của template

export default function TemplatesCV() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>([]);
  const { setTemplate, setResume } = useResume();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { state } = useUserAuth();
  const { isAuthenticated } = state;

  // Get current language
  const currentLang = i18n.language;

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    containerRefs.current.forEach((container, index) => {
      if (!container) return;

      const observer = new ResizeObserver(() => {
        const containerWidth = container.clientWidth;
        const scale = containerWidth / TEMPLATE_WIDTH;
        setScales((prev) => {
          const newScales = [...prev];
          newScales[index] = scale > 1 ? 1 : scale;
          return newScales;
        });
      });

      observer.observe(container);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [containerRefs, templates]); // Re-run when templates list could theoretically change, though it's static here

  const filters = [
    { id: "all", label: t("resume.filters.all") },
    { id: "professional", label: t("resume.filters.professional") },
    { id: "havard", label: t("resume.filters.havard") },
    { id: "creative", label: t("resume.filters.creative") },
    { id: "avatar", label: t("resume.filters.avatar") },
    { id: "no-avatar", label: t("resume.filters.noAvatar") },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    if (activeFilter === "all") return true;
    return tpl.categories.includes(activeFilter);
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-50">
      {/* Modern minimal gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        {/* Soft ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/50 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 mb-4 md:mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-gray-500">
              {t("resume.hero.badge")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight py-2">
            {t("resume.hero.title")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4 leading-relaxed">
            {t("resume.hero.description")}
          </p>
        </div>

        {/* Sticky Filter Toolbar */}
        <div className="sticky top-4 z-30 mb-8 md:mb-12 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-2">
            <div className="flex flex-wrap justify-center gap-2 max-w-full mx-auto px-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeFilter === filter.id
                      ? "bg-gray-900 text-white shadow-md transform scale-105"
                      : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6 md:mb-8 px-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              {activeFilter === "all"
                ? t("resume.selectTemplate")
                : `${filters.find((f) => f.id === activeFilter)?.label} Templates`}
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({filteredTemplates.length})
              </span>
            </h2>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No templates found for this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTemplates.map((tpl, idx) => {
                const Component = tpl.component;
                const isEnglish = currentLang.startsWith("en");
                const dummyData = isEnglish ? tpl.dummyDataEn : tpl.dummyDataVi;
                // Use a unique key based on filter to re-trigger animations if needed, or simple index
                // Using tpl.id is best for React reconciliation
                return (
                  <div
                    key={tpl.id}
                    className="group bg-white rounded-2xl p-3 sm:p-4 transition-all duration-300 border border-gray-100 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp flex flex-col"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className="aspect-[210/297] overflow-hidden border border-gray-200 rounded-xl relative bg-white group-hover:border-blue-200 transition-colors w-full"
                      ref={(el) => {
                        // Find the index in the ORIGINAL templates array to map the ref correctly if needed
                        // But here we are rendering filtered lists.
                        // The resizing logic uses containerRefs by index.
                        // We need to manage refs dynamically.
                        // Simplified approach: Just assign to a new ref array based on current render index.
                        if (el) containerRefs.current[idx] = el;
                      }}
                    >
                      <div
                        style={{
                          width: 900,
                          height: 1300,
                          transform: `scale(${scales[idx] || 0.4})`, // Default scale to avoid jump
                          transformOrigin: "top left",
                        }}
                        className="absolute top-0 left-0 pointer-events-none select-none"
                      >
                        <Component data={dummyData} />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          className="bg-white/90 backdrop-blur text-gray-900 font-semibold py-2 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                          onClick={() => {
                            setSelectedTemplate(tpl);
                          }}
                        >
                          {t("resume.preview")}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                          {tpl.name}
                        </h3>
                        {tpl.categories.includes("professional") && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                            Pro
                          </span>
                        )}
                        {tpl.categories.includes("creative") && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                            Creative
                          </span>
                        )}
                        {tpl.categories.includes("havard") && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-red-50 text-red-600 px-2 py-1 rounded-md">
                            Havard
                          </span>
                        )}
                      </div>

                      <button
                        className="w-full mt-auto py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                        onClick={() => {
                          if (!isAuthenticated) {
                            setShowLoginModal(true);
                            return;
                          }
                          setTemplate(tpl.type);
                          setResume(dummyData);
                          const templateSlug = tpl.type.toLowerCase();
                          navigate(
                            `/resume/create/${templateSlug}?lang=${currentLang}`
                          );
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        {t("resume.useTemplate")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTemplate(null)}
          ></div>

          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedTemplate.name}
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={t("common.close")}
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700">
                  ✕
                </div>
              </button>
            </div>

            {/* Modal Content - Scrollable Preview */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 flex justify-center">
              <div
                className="bg-white shadow-2xl origin-top border-2 border-gray-300 overflow-hidden"
                style={{
                  width: TEMPLATE_WIDTH,
                  minHeight: "fit-content",
                  transform: "scale(0.8)", // Slight scale down to fit better by default if needed, or controlled via CSS
                  transformOrigin: "top center",
                }}
              >
                {/* Dynamically Render the selected component */}
                <selectedTemplate.component
                  data={
                    currentLang.startsWith("en")
                      ? selectedTemplate.dummyDataEn
                      : selectedTemplate.dummyDataVi
                  }
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {t("common.close")}
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginModal(true);
                    return;
                  }

                  setTemplate(selectedTemplate.type);
                  // Determine dummy data based on language logic (copied from grid item)
                  const isEnglish = currentLang.startsWith("en");
                  const dummyData = isEnglish
                    ? selectedTemplate.dummyDataEn
                    : selectedTemplate.dummyDataVi;
                  setResume(dummyData);
                  const templateSlug = selectedTemplate.type.toLowerCase();
                  navigate(
                    `/resume/create/${templateSlug}?lang=${currentLang}`
                  );
                }}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {t("resume.useTemplate")}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title={t("loginRequired.createCVTitle")}
        description={t("loginRequired.createCVDescription")}
      />
    </div>
  );
}
