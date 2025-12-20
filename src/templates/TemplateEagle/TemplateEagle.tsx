import { templateEagleDummy } from "@/templates/TemplateEagle/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BadgeCheck,
  Wrench,
  Award,
  Heart,
  Briefcase,
  FolderKanban,
  Users,
} from "lucide-react";

const dummyData: ResumeData = templateEagleDummy;
const PAGE_HEIGHT = 1300;

function TemplateEagle({
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
      {/* Left Column - White Background with Objective, Experience, Projects */}
      <div
        ref={leftColRef}
        className="flex-1 p-6 bg-gradient-to-br from-white via-gray-50 to-slate-50"
      >
        {/* Name & Position Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-extrabold uppercase tracking-wide"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.fullName}
          </h1>
          <p
            className="text-lg font-semibold uppercase tracking-wider mt-1"
            style={{ color: `${data.theme.primaryColor}99` }}
          >
            {basicInfo.position}
          </p>
        </div>

        {/* Objective Section */}
        {objective &&
          objective.description &&
          objective.description !== "<p><br></p>" && (
            <div className="mb-6">
              <div
                className="relative p-5 rounded-2xl shadow-sm"
                style={{ backgroundColor: `${data.theme.primaryColor}08` }}
              >
                <div
                  className="absolute left-0 top-3 bottom-3 w-1.5 rounded-full"
                  style={{ backgroundColor: data.theme.primaryColor }}
                />
                <span
                  className="text-5xl absolute top-0 left-5 opacity-15"
                  style={{ color: data.theme.primaryColor }}
                >
                  "
                </span>
                <div
                  className="ql-editor !p-0 text-sm leading-relaxed pl-8"
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
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <GraduationCap size={18} className="text-white" />
              </div>
              <h3
                className="font-bold text-lg uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h3>
            </div>
            <div
              className="relative pl-6 border-l-2"
              style={{ borderColor: `${data.theme.primaryColor}30` }}
            >
              {education.map((edu, idx) => (
                <div key={idx} className="mb-5 relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 bg-white shadow-sm"
                    style={{ borderColor: data.theme.primaryColor }}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div
                        className="font-bold"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {edu.name}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: data.theme.textColor }}
                      >
                        {edu.major}
                      </div>
                      {edu.score && (
                        <div
                          className="text-sm"
                          style={{ color: data.theme.textColor }}
                        >
                          {edu.score}
                        </div>
                      )}
                    </div>
                    <div
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${data.theme.primaryColor}15`,
                        color: data.theme.primaryColor,
                      }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
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
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <Briefcase size={18} className="text-white" />
              </div>
              <h3
                className="font-bold text-lg uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.experience")}
              </h3>
            </div>
            <div
              className="relative pl-6 border-l-2"
              style={{ borderColor: `${data.theme.primaryColor}30` }}
            >
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-5 relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 bg-white shadow-sm"
                    style={{ borderColor: data.theme.primaryColor }}
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <div
                        className="font-bold"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {exp.position}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: data.theme.textColor }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${data.theme.primaryColor}15`,
                        color: data.theme.primaryColor,
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <div
                      className="ql-editor text-sm leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                      style={{ color: data.theme.textColor }}
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
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <FolderKanban size={18} className="text-white" />
              </div>
              <h3
                className="font-bold text-lg uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.projects")}
              </h3>
            </div>
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 rounded-xl border-l-4 shadow-sm"
                style={{
                  backgroundColor: `${data.theme.primaryColor}05`,
                  borderColor: data.theme.primaryColor,
                }}
              >
                <div className="flex justify-between items-start">
                  <span
                    className="font-bold"
                    style={{ color: data.theme.primaryColor }}
                  >
                    {project.title}
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
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
                    className="ql-editor text-sm mt-2"
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
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <Users size={18} className="text-white" />
              </div>
              <h3
                className="font-bold text-lg uppercase tracking-wide"
                style={{ color: data.theme.primaryColor }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h3>
            </div>
            {references.map((ref, idx) => (
              <div key={idx} className="mb-3 flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-md"
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
                      className="text-xs text-gray-500"
                      dangerouslySetInnerHTML={{ __html: ref.description }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Blue Background with Gradient and Modern Design */}
      <div
        ref={rightColRef}
        className="w-[320px] min-h-full relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${data.theme.primaryColor} 0%, ${data.theme.primaryColor}dd 100%)`,
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-40 right-0 w-48 h-48 rounded-full bg-white/5 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          {/* Avatar Section */}
          <div className="p-6 pb-4">
            <div className="relative mx-auto w-44 h-44">
              {/* Outer ring decoration */}
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-white/20" />
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
                <img
                  src={basicInfo.profilePhoto || "/default-avatar.png"}
                  alt={basicInfo.fullName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="px-6 py-4 mx-4 mb-3 bg-white/10 rounded-xl">
            <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                <Phone size={12} />
              </div>
              {t("resumeBuilder.pdfHeaders.contact")}
            </h3>
            <div className="space-y-2 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={12} className="shrink-0 text-sky-200" />
                <span>{basicInfo.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="shrink-0 text-sky-200" />
                <span className="break-all text-xs">{basicInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="shrink-0 text-sky-200" />
                <span className="text-xs">{basicInfo.location}</span>
              </div>
              {basicInfo.customFields?.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                if (!Icon) return null;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 shrink-0 text-sky-200">
                      <Icon color="#bae6fd" />
                    </div>
                    <span className="break-all text-xs">{field.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="px-6 py-4 mx-4 mb-3 bg-white/10 rounded-xl">
              <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <Wrench size={12} />
                </div>
                {t("resumeBuilder.pdfHeaders.skills")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 rounded-full px-2.5 py-1 text-xs text-white font-medium"
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

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div className="px-6 py-4 mx-4 mb-3 bg-white/10 rounded-xl">
              <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <BadgeCheck size={12} />
                </div>
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h3>
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="mb-2 text-white/90 flex items-start gap-2"
                >
                  <BadgeCheck
                    size={12}
                    className="shrink-0 mt-0.5 text-sky-300"
                  />
                  <div>
                    <div className="text-xs">{cert.name}</div>
                    <div className="text-xs text-sky-200">{cert.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Awards Section */}
          {awards && awards.length > 0 && (
            <div className="px-6 py-4 mx-4 mb-3 bg-white/10 rounded-xl">
              <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                  <Award size={12} />
                </div>
                {t("resumeBuilder.pdfHeaders.awards")}
              </h3>
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="mb-2 text-white/90 flex items-start gap-2"
                >
                  <span className="text-yellow-300">★</span>
                  <div>
                    <div className="font-medium text-white text-xs">
                      {award.title}
                    </div>
                    {award.date && (
                      <div className="text-xs text-sky-200">{award.date}</div>
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
              <div className="px-6 py-4 mx-4 mb-3 bg-white/10 rounded-xl">
                <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                    <Heart size={12} />
                  </div>
                  {t("resumeBuilder.pdfHeaders.interests")}
                </h3>
                <div
                  className="ql-editor !p-0 text-xs text-white/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: interests.description }}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default TemplateEagle;
