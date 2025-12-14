import { templateHavard1Dummy } from "@/templates/TemplateHavard1/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateHavard1Dummy;

function TemplateHavard1({
  data = dummyData,
  ref,
  onUpdateHeight,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
  onUpdateHeight?: (newHeight: number) => void;
}) {
  const { t } = useTranslation();
  const { basicInfo, objective, theme } = data;

  const experience = (data.experience || []).filter((item) => !item.isHidden);
  const education = (data.education || []).filter((item) => !item.isHidden);
  const skills = (data.skills || []).filter((item) => !item.isHidden);
  const awards = (data.awards || []).filter((item) => !item.isHidden);
  const certifications = (data.certifications || []).filter(
    (item) => !item.isHidden
  );
  const projects = (data.projects || []).filter((item) => !item.isHidden);
  const references = (data.references || []).filter((item) => !item.isHidden);
  const interests = data.interests?.isHidden ? null : data.interests;

  const halfLength = Math.ceil(skills.length / 2);
  const skillsCol1 = skills.slice(0, halfLength);
  const skillsCol2 = skills.slice(halfLength);

  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const observer = new ResizeObserver(() => {
      const h = ref.current!.offsetHeight;
      setMinPageHeight(h);
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (onUpdateHeight) onUpdateHeight(minPageHeight);
  }, [minPageHeight, onUpdateHeight]);

  const nameParts = basicInfo.fullName.split(" ");

  return (
    <div
      ref={ref}
      className="p-10 min-h-[1300px] text-gray-800 bg-white"
      style={{
        minHeight: minPageHeight,
      }}
    >
      <div>
        {/* Header */}
        <header className="mb-6 text-center">
          <h1
            className="text-4xl font-bold uppercase tracking-widest mb-2"
            style={{ color: theme.primaryColor }}
          >
            <span className="font-light">{nameParts[0]}</span>{" "}
            <span className="font-black">{nameParts.slice(1).join(" ")}</span>
          </h1>
          <div className="flex justify-center items-center flex-wrap gap-3 text-sm font-medium text-gray-600">
            {basicInfo.email && <span>{basicInfo.email}</span>}
            {basicInfo.phoneNumber && (
              <>
                <span className="text-gray-400">•</span>
                <span>{basicInfo.phoneNumber}</span>
              </>
            )}
            {basicInfo.location && (
              <>
                <span className="text-gray-400">•</span>
                <span>{basicInfo.location}</span>
              </>
            )}
            {basicInfo.customFields?.map((field, idx) => {
              const Icon = CUSTOMFIELD_MAP_ICON[field.type];
              return (
                <div key={idx} className="flex items-center">
                  <span className="text-gray-400 mr-2">•</span>
                  {Icon && (
                    <div className="w-4 h-4 mr-1">
                      <Icon color="#374151" />
                    </div>
                  )}
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline ml-1"
                  >
                    {field.value.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              );
            })}
          </div>
        </header>

        {/* Objective */}
        {objective?.description && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.objective")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>
            <div
              className="mt-2 text-sm"
              dangerouslySetInnerHTML={{ __html: objective.description }}
            />
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{ color: theme.primaryColor }}
                >
                  {t("resumeBuilder.pdfHeaders.education")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <div className="mt-2 space-y-2 text-sm">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <div className="font-semibold">{edu.major}</div>
                    <div className="text-sm">
                      {edu.name}
                      {edu.score && <span> - GPA: {edu.score}</span>}
                    </div>
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

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.skills")}
                </span>
              </div>
              <div className="border-t border-gray-300" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
              <ul className="list-disc list-inside space-y-0.5">
                {skillsCol1.map((s, i) => (
                  <li key={i} style={{ color: theme.textColor }}>
                    <span className="font-semibold">{s.name}</span>
                    {s.description && (
                      <span className="font-normal">: {s.description}</span>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="list-disc list-inside space-y-1">
                {skillsCol2.map((s, i) => (
                  <li key={i} style={{ color: theme.textColor }}>
                    <span className="font-semibold">{s.name}</span>
                    {s.description && (
                      <span className="font-normal">: {s.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.experience")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>
            <div className="mt-2 space-y-3 text-sm">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <div
                      className="font-bold"
                      style={{
                        color: theme.textColor,
                      }}
                    >
                      {exp.position}
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.primaryColor,
                      }}
                    >
                      {exp.startDate} to {exp.endDate}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div
                      className="font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      {exp.company}
                    </div>
                    <div style={{ color: theme.textColor }}>
                      {basicInfo.location}
                    </div>
                  </div>

                  {exp.description && (
                    <div
                      className="mt-1 ql-editor !p-0 text-sm"
                      style={{ lineHeight: 1.04 }}
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.projects")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <div className="mt-2 space-y-3 text-sm">
              {projects.map((p, idx) => (
                <div key={idx}>
                  <div
                    className="font-bold"
                    style={{
                      color: theme.textColor,
                    }}
                  >
                    {p.title}
                  </div>
                  <div className="text-sm text-gray-700">
                    {p.startDate
                      ? `${p.startDate} - ${p.endDate || ""}`
                      : p.endDate}
                  </div>
                  {p.description && (
                    <div
                      className="mt-1 ql-editor !p-0 text-sm"
                      style={{ lineHeight: 1.04 }}
                      dangerouslySetInnerHTML={{ __html: p.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.awards")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <ul className="mt-2 list-disc list-inside text-sm">
              {awards.map((a, idx) => (
                <li key={idx} style={{ color: theme.textColor }}>
                  {a.title} {a.date ? `- ${a.date}` : null}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.certifications")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <ul className="mt-2 list-disc list-inside text-sm">
              {certifications.map((c, idx) => (
                <li key={idx} style={{ color: theme.textColor }}>
                  {c.name} {c.date ? `- ${c.date}` : null}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{ color: theme.primaryColor }}
                >
                  {t("resumeBuilder.pdfHeaders.references")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <div className="mt-2 text-sm space-y-1">
              {references.map((r, i) => (
                <div key={i} className="text-sm">
                  <div
                    className="font-medium"
                    style={{ color: theme.textColor }}
                  >
                    {r.information}
                  </div>
                  {r.description && (
                    <div
                      className="text-gray-700 ql-editor !p-0"
                      dangerouslySetInnerHTML={{ __html: r.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests?.description && (
          <section className="mb-2">
            <div className="text-center py-1">
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
              <div className="inline-block px-3 py-1">
                <span
                  className="font-extrabold"
                  style={{ color: theme.primaryColor }}
                >
                  {t("resumeBuilder.pdfHeaders.interests")}
                </span>
              </div>
              <div style={{ borderTop: `1px solid ${theme.primaryColor}` }} />
            </div>

            <div
              className="mt-2 text-sm ql-editor !p-0"
              dangerouslySetInnerHTML={{ __html: interests.description }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default TemplateHavard1;
