import { cn } from "@/lib";
import { templateDolphinDummy } from "@/templates/TemplateDolphin/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const dummyData: ResumeData = templateDolphinDummy;

function TemplateDolphin({
  data = dummyData,
  ref,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
  onUpdateHeight?: (newHeight: number) => void;
}) {
  const { t } = useTranslation();
  const { basicInfo, objective, references } = data;

  const experience = (data.experience || []).filter((item) => !item.isHidden);
  const education = (data.education || []).filter((item) => !item.isHidden);
  const skills = (data.skills || []).filter((item) => !item.isHidden);
  const awards = (data.awards || []).filter((item) => !item.isHidden);
  const certifications = (data.certifications || []).filter(
    (item) => !item.isHidden
  );
  const projects = (data.projects || []).filter((item) => !item.isHidden);
  const interests = data.interests?.isHidden ? null : data.interests;

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto shadow-2xl relative flex flex-row pointer-events-none select-none bg-slate-50 font-sans"
      ref={ref}
      style={{ backgroundColor: data.theme.bgColor }}
    >
      {/* Left Sidebar - Tech Themed */}
      <div
        className="w-[300px] shrink-0 min-h-full flex flex-col py-12 px-6 gap-8 text-white relative overflow-hidden"
        style={{ backgroundColor: "#0f172a" }} // Force dark base, overlay primary color with opacity if needed, or just use primary color. Let's use primary color as accent and dark bg.
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        {/* Override background with theme primary if it's dark enough, else use a dark shade */}
        <div
          className="absolute inset-0 opacity-90"
          style={{ backgroundColor: data.theme.primaryColor }}
        ></div>

        {/* Avatar - Hexagon like clip path or just sharp square with border */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="w-44 h-44 p-1 bg-white/20 backdrop-blur-sm"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <div
              className="w-full h-full bg-white"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <img
                src={basicInfo.profilePhoto || "/default-avatar.png"}
                alt={basicInfo.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 text-sm font-medium tracking-wide">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <div className="p-1.5 bg-white/10 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <span className="truncate">{basicInfo.email}</span>
            </div>

            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <div className="p-1.5 bg-white/10 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="truncate">{basicInfo.phoneNumber}</span>
            </div>

            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <div className="p-1.5 bg-white/10 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="truncate">{basicInfo.location}</span>
            </div>

            {data.basicInfo.customFields &&
              data.basicInfo.customFields.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 border-b border-white/10 pb-2"
                  >
                    <div className="p-1.5 bg-white/10 rounded">
                      <Icon color="#ffffff" className="w-4 h-4" />
                    </div>
                    <span className="truncate">{field.value}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="relative z-10 space-y-6">
            <h3 className="uppercase text-lg font-black tracking-[0.2em] border-l-4 border-white pl-3 text-white/90">
              {t("resumeBuilder.pdfHeaders.skills")}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-black/20 rounded p-2 px-3 border border-white/5"
                >
                  <div className="font-bold text-sm text-white/95 tracking-wide">
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div className="text-xs opacity-70 mt-1 leading-relaxed font-light">
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards, Certs, References in Sidebar style same as skills */}
        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="relative z-10 space-y-6">
            <h3 className="uppercase text-lg font-black tracking-[0.2em] border-l-4 border-white pl-3 text-white/90">
              {t("resumeBuilder.pdfHeaders.awards")}
            </h3>
            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="bg-black/20 rounded p-3 border border-white/5"
                >
                  <div className="font-bold text-sm text-white/95">
                    {award.title}
                  </div>
                  {award.date && (
                    <div className="text-xs opacity-60 mt-0.5 font-mono">
                      {award.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - 100% white with clean tech headers */}
      <div className="flex-1 flex flex-col py-16 px-10 bg-white">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-6xl font-black uppercase tracking-tighter leading-none mb-3"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.fullName}
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-1.5 w-12 bg-gray-800"></span>
            <p className="text-2xl uppercase font-bold text-gray-800 tracking-widest">
              {basicInfo.position}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Objective */}
          {objective && objective.description !== "<p><br></p>" && (
            <div className="relative">
              <h2
                className="text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="text-3xl mr-1">/</span>
                {t("resumeBuilder.pdfHeaders.objective")}
              </h2>
              <div
                className="ql-editor !p-0 text-sm leading-7 text-gray-700 font-medium"
                dangerouslySetInnerHTML={{ __html: objective.description }}
              />
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2
                className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b-2 border-gray-100 pb-2"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="text-3xl mr-1">/</span>
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
              <div className="space-y-10">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-8 border-l-2 border-dashed border-gray-300"
                  >
                    <div
                      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4"
                      style={{ borderColor: data.theme.primaryColor }}
                    ></div>

                    <div className="flex flex-col mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">
                        {exp.startDate} - {exp.endDate}
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">
                        {exp.position}
                      </h3>
                      <div
                        className="text-lg font-bold"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: exp.description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2
                className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b-2 border-gray-100 pb-2"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="text-3xl mr-1">/</span>
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 p-5 rounded-lg border-l-4"
                    style={{ borderLeftColor: data.theme.primaryColor }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {edu.major}
                      </h3>
                      <span className="text-xs font-bold text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-600">
                      {edu.name}
                    </p>
                    {edu.score && (
                      <p className="text-sm text-gray-400 font-mono mt-1">
                        GPA: {edu.score}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2
                className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-2"
                style={{ color: data.theme.primaryColor }}
              >
                <span className="text-3xl mr-1">/</span>
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="grid gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {project.title}
                      </h3>
                      <span className="text-xs font-bold text-gray-400 font-mono">
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <div
                      className="ql-editor !p-0 text-sm leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: project.description || "",
                      }}
                    />
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

export default TemplateDolphin;
