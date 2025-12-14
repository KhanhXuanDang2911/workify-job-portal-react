import { templateRabbitDummy } from "@/templates/TemplateRabbit/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const dummyData: ResumeData = templateRabbitDummy;

const PAGE_HEIGHT = 1300;

function TemplateRabbit({
  data = dummyData,
  ref,
  onUpdateHeight,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
  onUpdateHeight?: (newHeight: number) => void;
}) {
  const { t } = useTranslation();
  const { basicInfo, objective } = data;

  // Filter hidden items
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

  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const observer = new ResizeObserver(() => {
      const h = ref.current!.offsetHeight;
      setMinPageHeight(h);
      setMinPageHeight(h);
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (onUpdateHeight) {
      onUpdateHeight(minPageHeight);
    }
  }, [minPageHeight, onUpdateHeight]);

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto shadow-2xl relative flex flex-row pointer-events-none select-none bg-white"
      ref={ref}
      style={{ backgroundColor: data.theme.bgColor }}
    >
      {/* Left Sidebar */}
      <div
        className="w-[320px] shrink-0 min-h-full flex flex-col pt-16 pb-12 px-8 gap-10 text-white relative"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        {/* Avatar Area */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border-4 border-white/20 p-1 shadow-xl mb-6">
            <img
              src={basicInfo.profilePhoto || "/default-avatar.png"}
              alt={basicInfo.fullName}
              className="w-full h-full rounded-full object-cover shadow-inner"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
            {t("resumeBuilder.pdfHeaders.contact")}
          </h3>
          <div className="space-y-4 text-sm font-medium">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <span className="break-all opacity-95">{basicInfo.email}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="break-all opacity-95">
                {basicInfo.phoneNumber}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="break-all opacity-95">{basicInfo.location}</span>
            </div>

            {data.basicInfo.customFields &&
              data.basicInfo.customFields.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 opacity-80 w-5 h-5">
                      <Icon color="#ffffff" />
                    </div>
                    <span className="break-all opacity-95">{field.value}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-6">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.skills")}
            </h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Dot className="shrink-0" />
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div className="text-xs opacity-80 pl-6 mt-1">
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="space-y-6">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.awards")}
            </h3>
            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div key={idx}>
                  <div className="font-bold text-sm">{award.title}</div>
                  {award.date && (
                    <div className="text-xs opacity-75 mt-0.5">
                      {award.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="space-y-6">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.certifications")}
            </h3>
            <div className="space-y-4">
              {certifications.map((certification, idx) => (
                <div key={idx}>
                  <div className="font-bold text-sm">{certification.name}</div>
                  {certification.date && (
                    <div className="text-xs opacity-75 mt-0.5">
                      {certification.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.description !== "<p><br></p>" && (
          <div className="space-y-6">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.interests")}
            </h3>
            <div
              className="ql-editor !p-0 text-sm opacity-90"
              dangerouslySetInnerHTML={{ __html: interests.description }}
            />
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col py-16 px-12 bg-white">
        {/* Header */}
        <div
          className="mb-12 border-l-8 pl-8"
          style={{ borderColor: data.theme.primaryColor }}
        >
          <h1
            className="text-5xl font-extrabold uppercase tracking-wide leading-tight mb-2"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.fullName}
          </h1>
          <p className="text-2xl uppercase font-semibold text-gray-500 tracking-wider">
            {basicInfo.position}
          </p>
        </div>

        <div className="space-y-10">
          {/* Objective */}
          {objective && objective.description !== "<p><br></p>" && (
            <div className="space-y-4">
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                <div className="p-1.5 rounded bg-gray-100 text-current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {t("resumeBuilder.pdfHeaders.objective")}
              </h2>
              <div
                className="ql-editor !p-0 text-sm leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: objective.description }}
              />
            </div>
          )}

          {/* Education - Moved to Main Column */}
          {education && education.length > 0 && (
            <div className="space-y-6">
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase tracking-wide border-b-2 pb-2"
                style={{
                  color: data.theme.primaryColor,
                  borderColor: "#f3f4f6",
                }}
              >
                <div className="p-1.5 rounded bg-gray-100 text-current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="grid gap-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-1.5 rounded-full bg-gray-200 shrink-0 mt-1.5"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {edu.major}
                        </h3>
                        <span className="text-sm font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 whitespace-nowrap">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      <p className="text-base font-medium text-gray-600 mb-1">
                        {edu.name}
                      </p>
                      {edu.score && (
                        <p className="text-sm text-gray-500 font-medium">
                          GPA: {edu.score}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div className="space-y-6">
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase tracking-wide border-b-2 pb-2"
                style={{
                  color: data.theme.primaryColor,
                  borderColor: "#f3f4f6",
                }}
              >
                <div className="p-1.5 rounded bg-gray-100 text-current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
              <div className="space-y-8">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 border-l-2 border-gray-100"
                  >
                    <div
                      className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    ></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className="text-xl font-bold text-gray-800 uppercase"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {exp.position}
                      </h3>
                      <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-600 mb-3 italic">
                      {exp.company}
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: exp.description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="space-y-6">
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase tracking-wide border-b-2 pb-2"
                style={{
                  color: data.theme.primaryColor,
                  borderColor: "#f3f4f6",
                }}
              >
                <div className="p-1.5 rounded bg-gray-100 text-current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1h-4a2 2 0 01-2-2V5H4v11h5v2H4a2 2 0 01-2-2V5zm16 4 1.586-1.586a2 2 0 012.828 0l2.172 2.172a2 2 0 010 2.828L20.586 16H6v-7h10zM7.707 14.707a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 010-1.414l5-5a1 1 0 011.414 0l2.5 2.5a1 1 0 010 1.414l-5 5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="grid gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50/50 p-5 rounded-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3
                        className="text-lg font-bold text-gray-800"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {project.title}
                      </h3>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-gray-200 text-gray-600">
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: project.description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="space-y-6">
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase tracking-wide border-b-2 pb-2"
                style={{
                  color: data.theme.primaryColor,
                  borderColor: "#f3f4f6",
                }}
              >
                <div className="p-1.5 rounded bg-gray-100 text-current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {references.map((reference, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="font-bold text-sm text-gray-900 mb-1">
                      {reference.information}
                    </div>
                    {reference.description && (
                      <div
                        className="ql-editor !p-0 text-xs text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: reference.description,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateRabbit;
