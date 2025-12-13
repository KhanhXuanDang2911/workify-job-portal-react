import { templateProfessional2Dummy } from "@/templates/TemplateProfessional2/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lightbulb,
  TrendingUp,
  Award,
} from "lucide-react";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateProfessional2Dummy;

function TemplateProfessional2({
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

  // Achievement icons for the awards section
  const achievementIcons = [Lightbulb, TrendingUp, Award];

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto font-sans shadow-lg relative pointer-events-none select-none"
      ref={ref}
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Header Section */}
      <div
        className="px-8 py-6 flex items-center justify-between"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white tracking-wide mb-1">
            {basicInfo.fullName}
          </h1>
          <p className="text-lg text-white opacity-90">{basicInfo.position}</p>

          {/* Contact Info Row */}
          <div className="flex flex-wrap gap-4 mt-3 text-white text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{basicInfo.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{basicInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{basicInfo.location}</span>
            </div>
            {basicInfo.customFields &&
              basicInfo.customFields.map((field, index) => {
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
        </div>

        {/* Avatar */}
        {basicInfo.profilePhoto && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ml-4">
            <img
              src={basicInfo.profilePhoto}
              alt={basicInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Column - 60% */}
        <div className="w-[60%] p-6 pr-4">
          {/* Summary Section */}
          {objective &&
            objective.description &&
            objective.description !== "<p><br></p>" && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
                  style={{
                    color: theme.primaryColor,
                    borderColor: theme.primaryColor,
                  }}
                >
                  {t("resumeBuilder.pdfHeaders.objective")}
                </h2>
                <div
                  className="ql-editor !p-0 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: objective.description }}
                  style={{ color: theme.textColor }}
                />
              </div>
            )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
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
                      className="text-lg font-bold"
                      style={{ color: theme.textColor }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      className="font-semibold"
                      style={{ color: theme.primaryColor }}
                    >
                      {exp.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    </div>
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

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3
                      className="text-base font-bold"
                      style={{ color: theme.textColor }}
                    >
                      {edu.major}
                    </h3>
                    <p
                      className="font-semibold"
                      style={{ color: theme.primaryColor }}
                    >
                      {edu.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    {edu.score && (
                      <p className="text-sm text-gray-600 mt-1">{edu.score}</p>
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
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
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
                        className="font-bold"
                        style={{ color: theme.textColor }}
                      >
                        {project.title}
                      </h3>
                      <span className="text-sm text-gray-500">
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

        {/* Right Column - 40% */}
        <div className="w-[40%] p-6 pl-4 border-l border-gray-200">
          {/* Achievements/Awards Section */}
          {awards && awards.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.awards")}
              </h2>
              <div className="space-y-4">
                {awards.map((award, index) => {
                  const IconComponent =
                    achievementIcons[index % achievementIcons.length];
                  return (
                    <div key={index} className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.primaryColor}20` }}
                      >
                        <IconComponent
                          className="w-4 h-4"
                          style={{ color: theme.primaryColor }}
                        />
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: theme.primaryColor }}
                        >
                          {award.title}
                        </h3>
                        {award.date && (
                          <p className="text-xs text-gray-600 mt-1">
                            {award.date}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.skills")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm font-medium border-b-2"
                    style={{
                      color: theme.primaryColor,
                      borderColor: theme.primaryColor,
                    }}
                  >
                    {skill.name}
                    {skill.description ? `: ${skill.description}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <p
                      className="font-medium text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {cert.name}
                    </p>
                    {cert.date && (
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References Section */}
          {references && references.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
                style={{
                  color: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
              <div className="space-y-3">
                {references.map((ref, index) => (
                  <div key={index}>
                    <p
                      className="font-medium text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {ref.information}
                    </p>
                    {ref.description && (
                      <div
                        className="text-xs text-gray-600 ql-editor !p-0"
                        dangerouslySetInnerHTML={{ __html: ref.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {interests &&
            interests.description &&
            interests.description !== "<p><br></p>" && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
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
      </div>
    </div>
  );
}

export default TemplateProfessional2;
