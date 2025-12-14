import { templateTigerDummy } from "@/templates/TemplateTiger/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Wrench,
  BadgeCheck,
  Briefcase,
  FolderKanban,
  Users,
  Heart,
} from "lucide-react";

const dummyData: ResumeData = templateTigerDummy;
const PAGE_HEIGHT = 1300;

function TemplateTiger({
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

  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMinPageHeight = () => {
      const leftHeight = leftColRef.current?.offsetHeight || 0;
      const rightHeight = rightColRef.current?.offsetHeight || 0;
      const maxHeight = Math.max(PAGE_HEIGHT, leftHeight, rightHeight);
      setMinPageHeight(maxHeight);
    };

    updateMinPageHeight();

    const resizeObserver = new ResizeObserver(updateMinPageHeight);
    if (leftColRef.current) resizeObserver.observe(leftColRef.current);
    if (rightColRef.current) resizeObserver.observe(rightColRef.current);

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
      className="w-[900px] min-h-[1300px] mx-auto shadow-lg relative pointer-events-none select-none flex"
      style={{ minHeight: minPageHeight, backgroundColor: data.theme.bgColor }}
      ref={ref}
    >
      {/* Left Sidebar - Green Background with Gradient Overlay */}
      <div
        ref={leftColRef}
        className="w-[300px] min-h-full relative overflow-hidden"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full bg-white/20 -translate-x-1/2" />
        </div>

        <div className="relative z-10 p-6">
          {/* Avatar with Ring Effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/40 shadow-xl">
                <img
                  src={basicInfo.profilePhoto || "/default-avatar.png"}
                  alt={basicInfo.fullName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-white/30" />
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="mb-6">
            <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Phone size={14} />
              </div>
              {t("resumeBuilder.pdfHeaders.contact")}
            </h3>
            <div className="space-y-3 text-white text-sm">
              {/* Phone */}
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2">
                <Phone size={14} className="shrink-0 text-emerald-200" />
                <span className="break-all">{basicInfo.phoneNumber}</span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2">
                <Mail size={14} className="shrink-0 text-emerald-200" />
                <span className="break-all text-xs">{basicInfo.email}</span>
              </div>
              {/* Location */}
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2">
                <MapPin size={14} className="shrink-0 text-emerald-200" />
                <span className="break-all">{basicInfo.location}</span>
              </div>
              {/* Custom Fields */}
              {basicInfo.customFields?.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                if (!Icon) return null;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-2"
                  >
                    <div className="w-3.5 h-3.5 shrink-0 text-emerald-200">
                      <Icon color="#a7f3d0" />
                    </div>
                    <span className="break-all text-xs">{field.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Wrench size={14} />
                </div>
                {t("resumeBuilder.pdfHeaders.skills")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white/15 rounded-full px-3 py-1.5 text-xs text-white font-medium hover:bg-white/25 transition-colors"
                  >
                    <span>{skill.name}</span>
                    {skill.description && (
                      <span className="font-light text-white/80">
                        {" "}
                        - {skill.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards Section */}
          {awards && awards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Award size={14} />
                </div>
                {t("resumeBuilder.pdfHeaders.awards")}
              </h3>
              <div className="space-y-2 text-white text-sm">
                {awards.map((award, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-300 mt-0.5">★</span>
                    <div>
                      <div className="font-medium text-white text-xs">
                        {award.title}
                      </div>
                      {award.date && (
                        <div className="text-emerald-200 text-xs">
                          {award.date}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <BadgeCheck size={14} />
                </div>
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h3>
              <div className="space-y-2 text-white text-sm">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <BadgeCheck
                      size={14}
                      className="shrink-0 mt-0.5 text-emerald-300"
                    />
                    <div>
                      <div className="text-white/90 text-xs">{cert.name}</div>
                      <div className="text-emerald-200 text-xs">
                        {cert.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div
        ref={rightColRef}
        className="flex-1 p-8 bg-gradient-to-br from-white to-gray-50"
      >
        {/* Header - Name & Position */}
        <div className="mb-6 relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{ backgroundColor: data.theme.primaryColor }}
          />
          <div className="pl-5">
            <h1
              className="text-3xl font-extrabold tracking-tight mb-1"
              style={{ color: data.theme.primaryColor }}
            >
              {basicInfo.fullName}
            </h1>
            <p
              className="text-lg font-semibold uppercase tracking-wide"
              style={{ color: `${data.theme.primaryColor}99` }}
            >
              {basicInfo.position}
            </p>
          </div>
        </div>

        {/* Objective */}
        {objective &&
          objective.description &&
          objective.description !== "<p><br></p>" && (
            <div className="mb-6">
              <div
                className="relative p-4 rounded-xl"
                style={{ backgroundColor: `${data.theme.primaryColor}08` }}
              >
                <span
                  className="absolute top-2 left-3 text-4xl opacity-20"
                  style={{ color: data.theme.primaryColor }}
                >
                  "
                </span>
                <div
                  className="ql-editor !p-0 text-sm leading-relaxed pl-4"
                  dangerouslySetInnerHTML={{ __html: objective.description }}
                  style={{ color: data.theme.textColor }}
                />
              </div>
            </div>
          )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${data.theme.primaryColor}15` }}
              >
                <GraduationCap
                  size={18}
                  style={{ color: data.theme.primaryColor }}
                />
              </div>
              <h2
                className="text-lg font-bold uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
            </div>
            <div
              className="relative pl-6 border-l-2"
              style={{ borderColor: `${data.theme.primaryColor}30` }}
            >
              {education.map((edu, idx) => (
                <div key={idx} className="mb-5 relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 bg-white"
                    style={{ borderColor: data.theme.primaryColor }}
                  />
                  <div
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1"
                    style={{
                      backgroundColor: `${data.theme.primaryColor}15`,
                      color: data.theme.primaryColor,
                    }}
                  >
                    {edu.startDate} - {edu.endDate}
                  </div>
                  <div
                    className="font-bold text-base"
                    style={{ color: data.theme.primaryColor }}
                  >
                    {edu.name}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {edu.major}
                  </div>
                  {edu.score && (
                    <div className="text-sm text-gray-600">
                      Score: {edu.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${data.theme.primaryColor}15` }}
              >
                <Briefcase
                  size={18}
                  style={{ color: data.theme.primaryColor }}
                />
              </div>
              <h2
                className="text-lg font-bold uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
            </div>
            <div
              className="relative pl-6 border-l-2"
              style={{ borderColor: `${data.theme.primaryColor}30` }}
            >
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-5 relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 bg-white"
                    style={{ borderColor: data.theme.primaryColor }}
                  />
                  <div
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1"
                    style={{
                      backgroundColor: `${data.theme.primaryColor}15`,
                      color: data.theme.primaryColor,
                    }}
                  >
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div
                    className="font-bold text-base"
                    style={{ color: data.theme.primaryColor }}
                  >
                    {exp.position}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {exp.company}
                  </div>
                  {exp.description && (
                    <div
                      className="ql-editor text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                      style={{ color: data.theme.textColor }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects / Activities Section */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${data.theme.primaryColor}15` }}
              >
                <FolderKanban
                  size={18}
                  style={{ color: data.theme.primaryColor }}
                />
              </div>
              <h2
                className="text-lg font-bold uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
            </div>
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 rounded-xl border-l-4"
                style={{
                  backgroundColor: `${data.theme.primaryColor}05`,
                  borderColor: data.theme.primaryColor,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className="font-bold"
                    style={{ color: data.theme.primaryColor }}
                  >
                    {project.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${data.theme.primaryColor}15`,
                      color: data.theme.primaryColor,
                    }}
                  >
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                {project.description && (
                  <div
                    className="ql-editor text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    style={{ color: data.theme.textColor }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* References Section */}
        {references && references.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${data.theme.primaryColor}15` }}
              >
                <Users size={18} style={{ color: data.theme.primaryColor }} />
              </div>
              <h2
                className="text-lg font-bold uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
            </div>
            {references.map((ref, idx) => (
              <div key={idx} className="mb-3 flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ backgroundColor: data.theme.primaryColor }}
                >
                  {ref.information?.charAt(0) || "R"}
                </div>
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: data.theme.textColor }}
                  >
                    {ref.information}
                  </div>
                  {ref.description && (
                    <div
                      className="ql-editor text-xs text-gray-500 p-0"
                      dangerouslySetInnerHTML={{ __html: ref.description }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interests Section */}
        {interests &&
          interests.description &&
          interests.description !== "<p><br></p>" && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${data.theme.primaryColor}15` }}
                >
                  <Heart size={18} style={{ color: data.theme.primaryColor }} />
                </div>
                <h2
                  className="text-lg font-bold uppercase tracking-wide"
                  style={{ color: data.theme.primaryColor }}
                >
                  {t("resumeBuilder.pdfHeaders.interests")}
                </h2>
              </div>
              <div
                className="ql-editor !p-0 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: interests.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default TemplateTiger;
