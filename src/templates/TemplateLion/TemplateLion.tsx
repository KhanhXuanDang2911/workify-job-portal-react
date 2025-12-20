import { templateLionDummy } from "@/templates/TemplateLion/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const dummyData: ResumeData = templateLionDummy;

function TemplateLion({
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
      className="w-[900px] min-h-[1300px] mx-auto shadow-2xl relative flex flex-row pointer-events-none select-none bg-white font-sans text-gray-800"
      ref={ref}
      style={{ backgroundColor: data.theme.bgColor }}
    >
      {/* Main Content (Left Side) - 70% */}
      <div className="w-[70%] flex flex-col py-12 pl-12 pr-8 bg-white">
        {/* Header (Name & Title) */}
        <div
          className="mb-10 text-left border-l-8 pl-6"
          style={{ borderColor: data.theme.primaryColor }}
        >
          <h1
            className="text-6xl font-black uppercase tracking-tighter leading-none mb-2 text-gray-900"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.fullName}
          </h1>
          <p className="text-2xl uppercase font-bold tracking-widest text-gray-500">
            {basicInfo.position}
          </p>
        </div>

        <div className="space-y-12">
          {/* Objective */}
          {objective && objective.description !== "<p><br></p>" && (
            <div>
              <h2
                className="text-left text-2xl font-black uppercase tracking-widest mb-4 flex items-center gap-3"
                style={{ color: data.theme.primaryColor }}
              >
                <div
                  className="w-8 h-1"
                  style={{ backgroundColor: data.theme.primaryColor }}
                ></div>
                {t("resumeBuilder.pdfHeaders.objective")}
              </h2>
              <div
                className="ql-editor !p-0 text-[15px] leading-relaxed text-gray-700 text-left"
                dangerouslySetInnerHTML={{ __html: objective.description }}
              />
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2
                className="text-left text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3"
                style={{ color: data.theme.primaryColor }}
              >
                <div
                  className="w-8 h-1"
                  style={{ backgroundColor: data.theme.primaryColor }}
                ></div>
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
              <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-1">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col items-start text-left group"
                  >
                    {/* Dot on the line */}
                    <div
                      className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    ></div>

                    <div className="mb-1 w-full">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-gray-800">
                        {exp.position}
                      </h3>
                      <div className="flex justify-start items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-400 bg-gray-50 px-2 rounded">
                          {exp.startDate} - {exp.endDate}
                        </span>
                        <span
                          className="text-lg font-bold italic"
                          style={{ color: data.theme.primaryColor }}
                        >
                          {exp.company}
                        </span>
                      </div>
                    </div>
                    <div
                      className="ql-editor !p-0 text-[15px] leading-relaxed text-gray-600"
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
                className="text-left text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3"
                style={{ color: data.theme.primaryColor }}
              >
                <div
                  className="w-8 h-1"
                  style={{ backgroundColor: data.theme.primaryColor }}
                ></div>
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="grid gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-6 rounded-r-2xl border-l-4 border-gray-200 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex flex-col items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {project.title}
                      </h3>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white border border-gray-200 text-gray-500 mt-1 inline-block">
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

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2
                className="text-left text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3"
                style={{ color: data.theme.primaryColor }}
              >
                <div
                  className="w-8 h-1"
                  style={{ backgroundColor: data.theme.primaryColor }}
                ></div>
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="space-y-6 text-left">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="pb-4 border-b border-gray-100 last:border-0"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {edu.major}
                    </h3>
                    <div className="text-lg font-medium text-gray-500 mb-1">
                      {edu.name}
                    </div>
                    <div className="flex justify-start gap-4 text-sm font-semibold text-gray-400">
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                      {edu.score && <span>GPA: {edu.score}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - 30% */}
      <div
        className="w-[30%] shrink-0 min-h-full flex flex-col pt-12 pb-12 px-6 gap-10 text-white relative"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        {/* Avatar area - Square with border */}
        <div className="flex justify-center mb-6">
          <div className="w-44 h-44 rounded-xl border-8 border-white/10 shadow-lg overflow-hidden bg-white/5 rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src={basicInfo.profilePhoto || "/default-avatar.png"}
              alt={basicInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Info - Left aligned */}
        <div className="space-y-6 text-left">
          <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
            {t("resumeBuilder.pdfHeaders.contact")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="break-all opacity-95 text-sm font-medium">
                {basicInfo.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span className="break-all opacity-95 text-sm font-medium">
                {basicInfo.phoneNumber}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="break-all opacity-95 text-sm font-medium">
                {basicInfo.location}
              </span>
            </div>
            {/* Custom Fields */}
            {data.basicInfo.customFields &&
              data.basicInfo.customFields.map((field, index) => {
                const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
                      <Icon color="#ffffff" className="h-4 w-4" />
                    </div>
                    <span className="break-all opacity-95 text-sm font-medium">
                      {field.value}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Skills - Left Aligned */}
        {skills && skills.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.skills")}
            </h3>
            <div className="flex flex-col gap-3">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="font-bold text-sm tracking-wide bg-white/10 px-3 py-1 rounded inline-block">
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div className="text-xs opacity-70 mt-1 italic ml-1">
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
          <div className="space-y-6 text-left">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.awards")}
            </h3>
            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div key={idx}>
                  <div className="font-bold text-sm bg-white/10 p-2 rounded">
                    {award.title}
                  </div>
                  {award.date && (
                    <div className="text-xs opacity-60 mt-1 ml-1">
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
          <div className="space-y-6 text-left">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.certifications")}
            </h3>
            <div className="space-y-4">
              {certifications.map((certification, idx) => (
                <div key={idx}>
                  <div className="font-bold text-sm bg-white/10 p-2 rounded">
                    {certification.name}
                  </div>
                  {certification.date && (
                    <div className="text-xs opacity-60 mt-1 ml-1">
                      {certification.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.references")}
            </h3>
            <div className="space-y-4">
              {references.map((reference, idx) => (
                <div key={idx}>
                  <div className="font-bold text-sm border-l-2 border-white/50 pl-2">
                    {reference.information}
                  </div>
                  {reference.description && (
                    <div
                      className="ql-editor !p-0 text-xs opacity-80 mt-1"
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

        {/* Interests */}
        {interests && interests.description !== "<p><br></p>" && (
          <div className="space-y-6 text-left">
            <h3 className="uppercase text-lg font-bold tracking-widest border-b border-white/30 pb-2">
              {t("resumeBuilder.pdfHeaders.interests")}
            </h3>
            <div
              className="ql-editor !p-0 text-xs leading-relaxed opacity-80"
              dangerouslySetInnerHTML={{ __html: interests.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateLion;
