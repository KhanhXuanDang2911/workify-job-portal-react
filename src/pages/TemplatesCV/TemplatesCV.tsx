import React, { useEffect, useRef, useState, type RefObject } from "react";
import TemplatePanda from "@/templates/TemplatePanda/TemplatePanda";
import TemplateRabbit from "@/templates/TemplateRabbit/TemplateRabbit";
import type { ResumeData, TemplateType } from "@/types/resume.type";
import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { templateRabbitDummy } from "@/templates/TemplateRabbit/dummy";
import { useResume } from "@/context/ResumeContext/useResume";
import { useNavigate } from "react-router-dom";
import TemplateLion from "@/templates/TemplateLion/TemplateLion";
import { templateLionDummy } from "@/templates/TemplateLion/dummy";
import TemplateDolphin from "@/templates/TemplateDolphin/TemplateDolphin";
import { templateDolphinDummy } from "@/templates/TemplateDolphin/dummy";

type TemplateItem<P = any> = {
  id: string;
  name: string;
  component: React.FC<P>;
  type: TemplateType;
  dummyData: ResumeData;
};

const templates: TemplateItem<{
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
}>[] = [
  {
    id: "template-panda",
    name: "Template Panda",
    component: TemplatePanda,
    type: "TEMPLATE-PANDA",
    dummyData: templatePandaDummy,
  },
  {
    id: "template-rabbit",
    name: "Template Rabbit",
    component: TemplateRabbit,
    type: "TEMPLATE-RABBIT",
    dummyData: templateRabbitDummy,
  },
  {
    id: "template-lion",
    name: "Template Lion",
    component: TemplateLion,
    type: "TEMPLATE-LION",
    dummyData: templateLionDummy,
  },
  {
    id: "template-dolphin",
    name: "Template Dolphin",
    component: TemplateDolphin,
    type: "TEMPLATE-DOLPHIN",
    dummyData: templateDolphinDummy,
  },
];

const TEMPLATE_WIDTH = 900; // chiều rộng gốc của template
const TEMPLATE_HEIGHT = 1300; // chiều cao gốc của template

export default function TemplatesCV() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>([]);
  const { template, setTemplate, setResume } = useResume();
  const navigate = useNavigate();

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
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 px-[164px]">
      <h1 className="text-2xl font-bold mb-6 text-center">Chọn Mẫu CV</h1>

      <div className="grid grid-cols-2 gap-16 justify-center max-w-5xl mx-auto">
        {templates.map((tpl, idx) => {
          const Component = tpl.component;
          return (
            <div
              key={tpl.id}
              className="bg-white shadow rounded-xl p-4  transition border hover:outline-1 hover:outline-blue-500 hover:scale-105"
            >
              <div
                className="aspect-[3/4] overflow-hidden border rounded-lg relative"
                ref={(el) => {
                  containerRefs.current[idx] = el;
                }}
              >
                <div
                  style={{
                    width: 900,
                    height: 1300,
                    transform: `scale(${scales[idx] || 1})`,
                    transformOrigin: "top left",
                  }}
                  className="absolute top-0 left-0"
                >
                  <Component data={tpl.dummyData} />
                </div>
              </div>

              <p className="text-center mt-3 font-semibold">{tpl.name}</p>

              <button
                className="w-full mt-3 py-2 bg-[#1967d2] text-white rounded-sm hover:bg-[#4286e5]"
                onClick={() => {
                  setTemplate(tpl.type);
                  setResume(tpl.dummyData);
                  // Navigate with template in URL
                  const templateSlug = tpl.type.toLowerCase();
                  navigate(`/create-resume/template/${templateSlug}`);
                }}
              >
                Dùng mẫu
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
