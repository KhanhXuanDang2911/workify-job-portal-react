import { templateProfessional1Dummy } from "@/templates/TemplateProfessional1/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Mail, Phone, MapPin } from "lucide-react";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateProfessional1Dummy;

function TemplateProfessional1({
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

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto shadow-lg relative pointer-events-none select-none"
      ref={ref}
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Top Header Section */}
      <div className="flex">
        {/* Left Header - Blue with Name & Contact */}
        <div
          className="w-[280px] px-6 py-6"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <h1 className="text-2xl font-bold text-white leading-tight mb-1">
            {basicInfo.fullName}
          </h1>
          <p className="text-sm text-white opacity-90 mb-4">
            {basicInfo.position}
          </p>

          {/* Contact Info */}
          <div className="space-y-2 text-white text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 opacity-80 shrink-0" />
              <span className="break-all">{basicInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 opacity-80 shrink-0" />
              <span>{basicInfo.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-80 shrink-0" />
              <span>{basicInfo.location}</span>
            </div>
            {basicInfo.customFields &&
              basicInfo.customFields.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                if (!Icon) return null;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 opacity-80 shrink-0">
                      <Icon color="#ffffff" />
                    </div>
                    <span className="break-all">{field.value}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Header - Summary */}
        <div
          className="flex-1 px-6 py-6"
          style={{ backgroundColor: "#D9E4ED" }}
        >
          <h2
            className="text-base font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: theme.textColor, borderColor: theme.textColor }}
          >
            {t("resumeBuilder.pdfHeaders.objective")}
          </h2>
          {objective &&
            objective.description &&
            objective.description !== "<p><br></p>" && (
              <div
                className="ql-editor !p-0 text-sm leading-relaxed italic"
                dangerouslySetInnerHTML={{ __html: objective.description }}
                style={{ color: theme.textColor }}
              />
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Column */}
        <div className="w-[280px] px-6 py-6">
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-3 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.skills")}
              </h2>
              <div className="space-y-1">
                {skills.map((skill, index) => (
                  <div key={index} style={{ color: theme.textColor }}>
                    <span className="font-semibold text-sm">{skill.name}</span>
                    {skill.description && (
                      <span className="text-xs text-gray-600">
                        : {skill.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-3 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} style={{ color: theme.textColor }}>
                    <p className="font-medium text-sm">{cert.name}</p>
                    {cert.date && (
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-3 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.awards")}
              </h2>
              <div className="space-y-2">
                {awards.map((award, index) => (
                  <div key={index} style={{ color: theme.textColor }}>
                    <p className="font-medium text-sm">{award.title}</p>
                    {award.date && (
                      <p className="text-xs text-gray-500">{award.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-3 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
              <div className="space-y-2">
                {references.map((refItem, index) => (
                  <div key={index} style={{ color: theme.textColor }}>
                    <p className="font-medium text-sm">{refItem.information}</p>
                    {refItem.description && (
                      <div
                        className="text-xs text-gray-600 ql-editor !p-0"
                        dangerouslySetInnerHTML={{
                          __html: refItem.description,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests &&
            interests.description &&
            interests.description !== "<p><br></p>" && (
              <div className="mb-6">
                <h2
                  className="text-base font-semibold uppercase tracking-wider mb-3 pb-1 border-b"
                  style={{
                    color: theme.primaryColor,
                    borderColor: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.interests")}
                </h2>
                <div
                  className="ql-editor !p-0 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: interests.description }}
                  style={{ color: theme.textColor }}
                />
              </div>
            )}
        </div>

        {/* Vertical Divider */}
        <div
          className="w-[1px]"
          style={{ backgroundColor: theme.primaryColor }}
        />

        {/* Right Column - Experience */}
        <div className="flex-1 px-6 py-6">
          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-4 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="space-y-5">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3
                      className="font-semibold text-base"
                      style={{ color: theme.textColor }}
                    >
                      {edu.name}
                    </h3>
                    <p
                      className="text-sm italic mb-1"
                      style={{ color: theme.primaryColor }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <div className="text-sm" style={{ color: theme.textColor }}>
                      <span className="font-medium">{edu.major}</span>
                    </div>
                    {edu.score && (
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.textColor }}
                      >
                        Score: {edu.score}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-4 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
              <div className="space-y-5">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <h3
                      className="font-semibold text-base"
                      style={{ color: theme.textColor }}
                    >
                      {exp.position} - {exp.company}
                    </h3>
                    <p
                      className="text-sm italic mb-2"
                      style={{ color: theme.primaryColor }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </p>
                    {exp.description && (
                      <div
                        className="ql-editor !p-0 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                        style={{ color: theme.textColor }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-base font-semibold uppercase tracking-wider mb-4 pb-1 border-b"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3
                        className="font-semibold text-base"
                        style={{ color: theme.textColor }}
                      >
                        {project.title}
                      </h3>
                      <span
                        className="text-sm italic"
                        style={{ color: theme.primaryColor }}
                      >
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    {project.description && (
                      <div
                        className="ql-editor !p-0 text-sm leading-relaxed mt-1"
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                        style={{ color: theme.textColor }}
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

export default TemplateProfessional1;
