import { templateHavard2Dummy } from "@/templates/TemplateHavard2/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_HEIGHT = 1300;

function TemplateHavard2({
  data = templateHavard2Dummy,
  ref,
  onUpdateHeight,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
  onUpdateHeight?: (h: number) => void;
}) {
  const { t } = useTranslation();
  const {
    basicInfo,
    objective,
    skills,
    experience,
    education,
    projects,
    awards,
    certifications,
    references,
    interests,
    theme,
  } = data;

  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    if (!ref || !ref.current) return;
    const obs = new ResizeObserver(() => {
      const h = ref.current!.offsetHeight;
      setMinPageHeight(h);
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  useEffect(() => {
    if (onUpdateHeight) onUpdateHeight(minPageHeight);
  }, [minPageHeight, onUpdateHeight]);

  const skillsPerColumn = Math.ceil((skills || []).length / 2);
  const skillsCol1 = (skills || []).slice(0, skillsPerColumn);
  const skillsCol2 = (skills || []).slice(skillsPerColumn);

  return (
    <div
      id="page-1"
      ref={ref}
      className="w-[900px] min-h-[1300px] mx-auto bg-white shadow-lg select-none pointer-events-none"
      style={{
        color: "#333333",
        backgroundColor: theme.bgColor,
      }}
    >
      <div className="flex w-full">
        {/* Left sidebar */}
        <aside className="w-[26%] border-r border-gray-200 pr-6 pt-8 pb-8 flex flex-col items-end text-right">
          <div className="w-full">
            <div className="flex justify-end">
              <div
                style={{ backgroundColor: "#000000" }}
                className="w-14 h-14 flex items-center justify-center"
              >
                <span
                  style={{ color: theme.primaryColor }}
                  className="text-2xl font-bold"
                >
                  {basicInfo.fullName
                    .split(" ")
                    .pop()
                    ?.charAt(0)
                    .toUpperCase() || "J"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div
                className="text-xl font-bold"
                style={{ color: theme.primaryColor }}
              >
                <div>{basicInfo.fullName.split(" ")[0]}</div>
                <div>{basicInfo.fullName.split(" ").slice(1).join(" ")}</div>
              </div>

              {basicInfo.position && (
                <div
                  className="mt-1 text-sm font-medium"
                  style={{ color: theme.textColor }}
                >
                  {basicInfo.position}
                </div>
              )}

              <div className="mt-3 text-sm text-gray-700">
                <div>{basicInfo.phoneNumber}</div>
                <div className="mt-1">{basicInfo.email}</div>
                <div className="mt-1">{basicInfo.location}</div>
                {basicInfo.customFields &&
                  basicInfo.customFields.map((field, index) => {
                    const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-end gap-1 mt-1"
                      >
                        <span>{field.value}</span>
                        {Icon && (
                          <div className="w-3 h-3">
                            <Icon color={theme.primaryColor} />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right main content */}
        <main className="flex-1 pl-8 pr-10 py-8">
          {/* Summary */}
          <section className="mb-4">
            <h3
              className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
              style={{
                color: theme.primaryColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.objective")}
            </h3>
            {objective?.description && (
              <div
                className="text-sm text-justify"
                dangerouslySetInnerHTML={{ __html: objective.description }}
              />
            )}
          </section>

          {/* Skills */}
          {(skills || []).length > 0 && (
            <section className="mb-4">
              <h3 className="uppercase font-bold text-black text-sm mb-2">
                {t("resumeBuilder.pdfHeaders.skills")}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  {skillsCol1.map((s, i) => (
                    <li key={i} style={{ color: theme.textColor }}>
                      {s.name}
                      {s.description && (
                        <span className="text-xs text-gray-500 block">
                          {s.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  {skillsCol2.map((s, i) => (
                    <li key={i} style={{ color: theme.textColor }}>
                      {s.name}
                      {s.description && (
                        <span className="text-xs text-gray-500 block">
                          {s.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Experience */}
          {(experience || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.experience")}
              </h3>
              <div className="space-y-4 text-sm">
                {(experience || []).map((exp, idx) => (
                  <div key={idx}>
                    <div className="font-semibold">{exp.position}</div>
                    <div className="text-xs text-gray-600">
                      {basicInfo.location}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {exp.company} / {exp.startDate} to {exp.endDate}
                    </div>
                    {exp.description && (
                      <div
                        className="mt-2 prose prose-sm text-sm"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {(education || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h3>
              <div className="space-y-2 text-sm">
                {education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <div className="font-semibold">{edu.major}</div>
                      <div className="text-sm">{edu.name}</div>
                      {edu.score && (
                        <div className="text-xs text-gray-600">
                          GPA: {edu.score}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      {edu.startDate
                        ? `${edu.startDate} - ${edu.endDate}`
                        : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {(projects || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.projects")}
              </h3>
              <div className="space-y-4 text-sm">
                {projects?.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between">
                      <div className="font-semibold">{proj.title}</div>
                      <div className="text-sm text-gray-700">
                        {proj.startDate} - {proj.endDate}
                      </div>
                    </div>
                    {proj.description && (
                      <div
                        className="mt-1 ql-editor !p-0 text-sm"
                        dangerouslySetInnerHTML={{ __html: proj.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {(awards || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.awards")}
              </h3>
              <div className="space-y-2 text-sm">
                {awards?.map((aw, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="font-semibold">{aw.title}</div>
                    <div className="text-gray-700">{aw.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {(certifications || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h3>
              <div className="space-y-2 text-sm">
                {certifications?.map((cert, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-gray-700">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {(references || []).length > 0 && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h3>
              <div className="space-y-2 text-sm">
                {references?.map((ref, idx) => (
                  <div key={idx}>
                    <div className="font-semibold">{ref.information}</div>
                    {ref.description && (
                      <div
                        className="text-gray-600 prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: ref.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests?.description && (
            <section className="mb-4">
              <h3
                className="uppercase font-bold text-sm mb-2 border-b-2 pb-1"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.interests")}
              </h3>
              <div
                className="text-sm prose prose-sm"
                dangerouslySetInnerHTML={{ __html: interests.description }}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default TemplateHavard2;
