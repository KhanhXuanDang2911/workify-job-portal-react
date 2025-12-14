import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const dummyData: ResumeData = templatePandaDummy;

const PAGE_HEIGHT = 1300;

function TemplatePanda({
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
  const colRightRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMinPageHeight = () => {
      if (colLeftRef.current) {
        const leftHeight = colLeftRef.current.offsetHeight;
        // Chọn max giữa PAGE_HEIGHT cứng và height colLeft
        setMinPageHeight(Math.max(PAGE_HEIGHT, leftHeight + 68));
      }
      if (topRef.current && colRightRef.current) {
        const topHeight = topRef.current.offsetHeight;
        colRightRef.current.style.paddingTop = `${topHeight}px`;
      }
    };

    updateMinPageHeight();

    const resizeObserver = new ResizeObserver(updateMinPageHeight);
    if (colLeftRef.current) resizeObserver.observe(colLeftRef.current);
    if (topRef.current) resizeObserver.observe(topRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (onUpdateHeight) {
      onUpdateHeight(minPageHeight);
    }
  }, [minPageHeight, onUpdateHeight]);

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto shadow-2xl relative flex"
      style={{ backgroundColor: data.theme.bgColor }}
      ref={ref}
    >
      {/* Left Sidebar */}
      <div
        className="w-[300px] shrink-0 min-h-full flex flex-col py-10 px-6 gap-8"
        style={{ backgroundColor: "#F5F7FF" }}
      >
        {/* Avatar */}
        <div className="w-48 h-48 mx-auto -mt-2 mb-2 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={basicInfo.profilePhoto || "/default-avatar.png"}
            alt={basicInfo.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2
            className="uppercase text-xl font-bold tracking-wider border-b-2 pb-2"
            style={{
              color: data.theme.primaryColor,
              borderColor: `${data.theme.primaryColor}40`,
            }}
          >
            {t("resumeBuilder.pdfHeaders.contact")}
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 p-1.5 rounded-full bg-white shadow-sm shrink-0"
                style={{ color: data.theme.primaryColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <span
                className="font-medium break-all"
                style={{ color: data.theme.textColor }}
              >
                {basicInfo.email}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 p-1.5 rounded-full bg-white shadow-sm shrink-0"
                style={{ color: data.theme.primaryColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="font-medium break-all"
                style={{ color: data.theme.textColor }}
              >
                {basicInfo.phoneNumber}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 p-1.5 rounded-full bg-white shadow-sm shrink-0"
                style={{ color: data.theme.primaryColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="font-medium break-all"
                style={{ color: data.theme.textColor }}
              >
                {basicInfo.location}
              </span>
            </div>

            {data.basicInfo.customFields &&
              data.basicInfo.customFields.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 p-1.5 rounded-full bg-white shadow-sm shrink-0"
                      style={{ color: data.theme.primaryColor }}
                    >
                      <Icon className="w-3.5 h-3.5" color="currentColor" />
                    </div>
                    <span
                      className="font-medium break-all"
                      style={{ color: data.theme.textColor }}
                    >
                      {field.value}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Education */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <h2
              className="uppercase text-xl font-bold tracking-wider border-b-2 pb-2"
              style={{
                color: data.theme.primaryColor,
                borderColor: `${data.theme.primaryColor}40`,
              }}
            >
              {t("resumeBuilder.pdfHeaders.education")}
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} style={{ color: data.theme.textColor }}>
                  <div className="font-bold text-sm leading-tight">
                    {edu.major}
                  </div>
                  <div className="text-sm font-medium mt-0.5">{edu.name}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.score && (
                    <div className="text-xs font-semibold mt-1">
                      GPA: {edu.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-4">
            <h2
              className="uppercase text-xl font-bold tracking-wider border-b-2 pb-2"
              style={{
                color: data.theme.primaryColor,
                borderColor: `${data.theme.primaryColor}40`,
              }}
            >
              {t("resumeBuilder.pdfHeaders.skills")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg px-3 py-2 shadow-sm text-sm w-full"
                >
                  <div
                    className="font-bold flex items-center gap-2"
                    style={{ color: data.theme.primaryColor }}
                  >
                    <Dot size={16} strokeWidth={8} />
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div
                      className="text-xs mt-1 pl-6 opacity-90"
                      style={{ color: data.theme.textColor }}
                    >
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
          <div className="space-y-4">
            <h2
              className="uppercase text-xl font-bold tracking-wider border-b-2 pb-2"
              style={{
                color: data.theme.primaryColor,
                borderColor: `${data.theme.primaryColor}40`,
              }}
            >
              {t("resumeBuilder.pdfHeaders.awards")}
            </h2>
            <div className="space-y-3">
              {awards.map((award, idx) => (
                <div key={idx} style={{ color: data.theme.textColor }}>
                  <div className="font-bold text-sm">{award.title}</div>
                  {award.date && (
                    <div className="text-xs opacity-80 mt-0.5">
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
          <div className="space-y-4">
            <h2
              className="uppercase text-xl font-bold tracking-wider border-b-2 pb-2"
              style={{
                color: data.theme.primaryColor,
                borderColor: `${data.theme.primaryColor}40`,
              }}
            >
              {t("resumeBuilder.pdfHeaders.certifications")}
            </h2>
            <div className="space-y-3">
              {certifications.map((certification, idx) => (
                <div
                  key={idx}
                  style={{ color: data.theme.textColor }}
                  className="bg-white/50 p-2 rounded"
                >
                  <div className="font-bold text-sm">{certification.name}</div>
                  {certification.date && (
                    <div className="text-xs opacity-80 mt-0.5">
                      {certification.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-h-full">
        {/* Header */}
        <div
          className="py-12 px-10 flex flex-col justify-center"
          style={{ backgroundColor: "#DCE1F5" }}
        >
          <h1
            className="text-5xl font-bold uppercase tracking-wide leading-tight mb-3"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo?.fullName}
          </h1>
          <p
            className="text-xl tracking-widest uppercase font-medium opacity-90"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.position}
          </p>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-10 space-y-8 bg-white">
          {/* Objective */}
          {objective && objective.description !== "<p><br></p>" && (
            <div>
              <div
                className="ql-editor !p-0 text-sm leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: objective.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase mb-6"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="w-8 h-1 bg-current rounded-full opacity-50"></span>
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>

              <div className="space-y-8">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 border-l-2"
                    style={{
                      color: data.theme.textColor,
                      borderColor: `${data.theme.primaryColor}30`,
                    }}
                  >
                    <div
                      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white"
                      style={{ borderColor: data.theme.primaryColor }}
                    ></div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3
                        className="text-lg font-bold uppercase"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {exp.position}
                      </h3>
                      <span className="text-sm font-medium opacity-75 shrink-0 ml-4">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="text-base font-semibold mb-2 opacity-90">
                      {exp.company}
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed"
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
            <div>
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase mb-6"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="w-8 h-1 bg-current rounded-full opacity-50"></span>
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="grid gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-5 rounded-xl border border-gray-100"
                    style={{ color: data.theme.textColor }}
                  >
                    <div className="flex justify-between items-start mb-3 border-b pb-3 border-gray-200">
                      <h3
                        className="text-lg font-bold uppercase"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {project.title}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700">
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed"
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
            <div>
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase mb-6"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="w-8 h-1 bg-current rounded-full opacity-50"></span>
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {references.map((reference, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    style={{ color: data.theme.textColor }}
                  >
                    <div
                      className="font-bold text-sm mb-2"
                      style={{ color: data.theme.primaryColor }}
                    >
                      {reference.information}
                    </div>
                    <div
                      className="ql-editor !p-0 text-xs leading-relaxed opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: reference.description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests && interests.description !== "<p><br></p>" && (
            <div>
              <h2
                className="flex items-center gap-3 text-2xl font-bold uppercase mb-6"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="w-8 h-1 bg-current rounded-full opacity-50"></span>
                {t("resumeBuilder.pdfHeaders.interests")}
              </h2>
              <div
                className="ql-editor !p-0 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: interests.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default TemplatePanda;
