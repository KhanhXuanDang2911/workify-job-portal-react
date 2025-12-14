import { templateProfessional4Dummy } from "./dummy";
import { type ResumeData, CUSTOMFIELD_MAP_ICON } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateProfessional4Dummy;

function TemplateProfessional4({
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

  // Split name into first and last for different font weights
  const nameParts = basicInfo.fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Split skills into 2 columns
  const skillsPerColumn = Math.ceil(skills.length / 2);
  const skillsCol1 = skills.slice(0, skillsPerColumn);
  const skillsCol2 = skills.slice(skillsPerColumn);

  // Build contact info string with pipes
  const contactParts = [
    basicInfo.location,
    basicInfo.phoneNumber,
    basicInfo.email,
  ].filter(Boolean);

  // Add custom fields to contact
  const customFieldValues = basicInfo.customFields?.map((f) => f.value) || [];

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto shadow-lg relative pointer-events-none select-none"
      ref={ref}
      style={{
        backgroundColor: theme.bgColor,
      }}
    >
      {/* Main Content with Padding */}
      <div className="px-12 py-10">
        {/* Header Section */}
        <div className="mb-2">
          {/* Name - First name lighter, Last name bold */}
          <h1 className="text-5xl tracking-wide mb-2">
            <span className="font-light" style={{ color: theme.primaryColor }}>
              {firstName.toUpperCase()}
            </span>{" "}
            <span className="font-bold" style={{ color: theme.primaryColor }}>
              {lastName.toUpperCase()}
            </span>
          </h1>

          {/* Contact Info - separated by pipes */}
          <p className="text-sm text-gray-600 flex flex-wrap gap-2 items-center">
            {contactParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < contactParts.length - 1 && " | "}
              </span>
            ))}
            {customFieldValues.length > 0 && contactParts.length > 0 && " | "}
            <div className="flex gap-2">
              {basicInfo.customFields &&
                basicInfo.customFields.map((field, index) => {
                  const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                  if (!Icon) return null;
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-4 h-4 text-gray-600">
                        <Icon color="#4b5563" />
                      </div>
                      <span>{field.value}</span>
                      {index < (basicInfo.customFields?.length || 0) - 1 &&
                        " | "}
                    </div>
                  );
                })}
            </div>
          </p>
        </div>

        {/* OBJECTIVE Section */}
        {objective?.description && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
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

        {/* EDUCATION Section */}
        {education.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.education")}
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex gap-6">
                  {/* Left Column - Date */}
                  <div
                    className="w-36 shrink-0 text-sm"
                    style={{ color: theme.textColor }}
                  >
                    {edu.startDate ? `${edu.startDate} - ` : ""}
                    {edu.endDate}
                  </div>

                  {/* Right Column - Education Details */}
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: theme.textColor }}>
                      <span className="font-semibold">{edu.major}</span>
                      {edu.name && `, ${edu.name}`}
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

        {/* SKILLS Section - 2 Column Grid */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.skills")}
            </h2>
            <div className="grid grid-cols-2 gap-x-8 text-sm">
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
            </div>
          </div>
        )}

        {/* EXPERIENCE Section */}
        {experience.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.experience")}
            </h2>
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={idx} className="flex gap-6">
                  {/* Left Column - Date Range */}
                  <div
                    className="w-36 shrink-0 text-sm"
                    style={{ color: theme.textColor }}
                  >
                    {exp.startDate} - {exp.endDate}
                  </div>

                  {/* Right Column - Job Details */}
                  <div className="flex-1">
                    <h3
                      className="font-bold text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      className="text-sm mb-2"
                      style={{ color: theme.textColor }}
                    >
                      {exp.company}
                      {basicInfo.location && ` - ${basicInfo.location}`}
                    </p>
                    {exp.description && (
                      <div
                        className="ql-editor !p-0 text-sm leading-relaxed"
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

        {/* CERTIFICATIONS Section */}
        {certifications.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.certifications")}
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-6">
                  <div
                    className="w-36 shrink-0 text-sm"
                    style={{ color: theme.textColor }}
                  >
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

        {/* AWARDS Section */}
        {awards.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.awards")}
            </h2>
            <div className="space-y-2">
              {awards.map((award, idx) => (
                <div key={idx} className="flex gap-6">
                  <div
                    className="w-36 shrink-0 text-sm"
                    style={{ color: theme.textColor }}
                  >
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

        {/* PROJECTS Section */}
        {projects.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t("resumeBuilder.pdfHeaders.projects")}
            </h2>
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div key={idx} className="flex gap-6">
                  <div
                    className="w-36 shrink-0 text-sm"
                    style={{ color: theme.textColor }}
                  >
                    {project.startDate} - {project.endDate}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {project.title}
                    </h3>
                    {project.description && (
                      <div
                        className="ql-editor !p-0 text-sm mt-1"
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

        {/* REFERENCES Section */}
        {references.length > 0 && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
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
                      className="text-sm text-gray-600 ql-editor !p-0"
                      dangerouslySetInnerHTML={{ __html: ref.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERESTS Section */}
        {interests?.description && (
          <div className="mt-6">
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-3"
              style={{ color: theme.primaryColor }}
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

export default TemplateProfessional4;
