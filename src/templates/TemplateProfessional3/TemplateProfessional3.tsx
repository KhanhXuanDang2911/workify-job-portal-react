import { templateProfessional3Dummy } from "./dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateProfessional3Dummy;

function TemplateProfessional3({
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
    if (onUpdateHeight) {
      onUpdateHeight(minPageHeight);
    }
  }, [minPageHeight, onUpdateHeight]);

  // Split skills into 3 columns
  const skillsPerColumn = Math.ceil(skills.length / 3);
  const skillsCol1 = skills.slice(0, skillsPerColumn);
  const skillsCol2 = skills.slice(skillsPerColumn, skillsPerColumn * 2);
  const skillsCol3 = skills.slice(skillsPerColumn * 2);

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto font-sans shadow-lg relative pointer-events-none select-none"
      ref={ref}
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Header Section - Light Blue Background */}
      <div className="px-10 py-8" style={{ backgroundColor: "#d4e5f7" }}>
        <h1
          className="text-4xl font-bold tracking-wide"
          style={{ color: theme.primaryColor }}
        >
          {basicInfo.fullName.toUpperCase()}
        </h1>
      </div>

      {/* Contact Bar - Dark Blue */}
      <div
        className="px-10 py-3 flex items-center justify-between text-white text-sm"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{basicInfo.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{basicInfo.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{basicInfo.location}</span>
        </div>
        {basicInfo.customFields?.map((field, index) => {
          const Icon = CUSTOMFIELD_MAP_ICON[field.type];
          if (!Icon) return null;
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4">
                <Icon color="#ffffff" />
              </div>
              <span>{field.value}</span>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="px-10 py-6">
        {/* Objective Section */}
        {objective?.description && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.objective")}
            </h2>
            <div
              className="ql-editor !p-0 text-sm leading-relaxed"
              style={{ color: theme.textColor }}
              dangerouslySetInnerHTML={{ __html: objective.description }}
            />
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.skills")}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <ul className="space-y-1">
                {skillsCol1.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <div className="flex flex-col">
                      <span style={{ color: theme.textColor }}>
                        {skill.name}
                      </span>
                      {skill.description && (
                        <span className="text-xs text-gray-500">
                          {skill.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {skillsCol2.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <div className="flex flex-col">
                      <span style={{ color: theme.textColor }}>
                        {skill.name}
                      </span>
                      {skill.description && (
                        <span className="text-xs text-gray-500">
                          {skill.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {skillsCol3.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <div className="flex flex-col">
                      <span style={{ color: theme.textColor }}>
                        {skill.name}
                      </span>
                      {skill.description && (
                        <span className="text-xs text-gray-500">
                          {skill.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.experience")}
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 shrink-0 text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: theme.textColor }}
                    >
                      <span className="italic">{exp.position}</span>,{" "}
                      {exp.company}
                    </h3>
                    {exp.description && (
                      <div
                        className="mt-1 ql-editor !p-0 text-sm leading-relaxed"
                        style={{ color: theme.textColor }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education and Training Section */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.education")}
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 shrink-0 text-sm text-gray-600">
                    {edu.startDate ? `${edu.startDate} - ` : ""}
                    {edu.endDate}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm italic"
                      style={{ color: theme.textColor }}
                    >
                      {edu.major}, {edu.name}
                    </p>
                    {edu.score && (
                      <p className="text-sm text-gray-600">GPA: {edu.score}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.certifications")}
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 shrink-0 text-sm text-gray-600">
                    {cert.date}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: theme.textColor }}>
                      {cert.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.awards")}
            </h2>
            <div className="space-y-2">
              {awards.map((award, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 shrink-0 text-sm text-gray-600">
                    {award.date}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: theme.textColor }}>
                      {award.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.projects")}
            </h2>
            <div className="space-y-3">
              {projects.map((project, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-32 shrink-0 text-sm text-gray-600">
                    {project.startDate} - {project.endDate}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {project.title}
                    </h3>
                    {project.description && (
                      <div
                        className="mt-1 ql-editor !p-0 text-sm"
                        style={{ color: theme.textColor }}
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References Section */}
        {references.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.references")}
            </h2>
            <div className="space-y-2">
              {references.map((ref, idx) => (
                <div key={idx}>
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textColor }}
                  >
                    {ref.information}
                  </p>
                  {ref.description && (
                    <div
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: ref.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {interests?.description && (
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-wide mb-3 pb-1 border-b-2 uppercase"
              style={{
                color: theme.textColor,
                borderColor: theme.primaryColor,
              }}
            >
              {t("resumeBuilder.pdfHeaders.interests")}
            </h2>
            <div
              className="text-sm prose prose-sm max-w-none"
              style={{ color: theme.textColor }}
              dangerouslySetInnerHTML={{ __html: interests.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateProfessional3;
