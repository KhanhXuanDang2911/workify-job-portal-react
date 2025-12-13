import { cn } from "@/lib";
import { templateDolphinDummy } from "@/templates/TemplateDolphin/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateDolphinDummy;
function TemplateDolphin({
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
  const interests = data.interests?.isHidden ? null : data.interests;

  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const observer = new ResizeObserver(() => {
      const h = ref.current!.offsetHeight;
      setMinPageHeight(h);
      console.log("Height changed:", h);
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (onUpdateHeight) {
      onUpdateHeight(minPageHeight);
    }
    console.log(minPageHeight);
  }, [minPageHeight, onUpdateHeight]);

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto font-sans shadow-lg relative pointer-events-none select-none"
      ref={ref}
      style={{ backgroundColor: theme.bgColor }}
    >
      <div id="top" className="h-[280px] flex gap-[32px]">
        <div className="w-[325px] bg-[#1E2837] flex items-center justify-center">
          {/* Avatar */}
          <div
            className="rounded-tl-[0px] rounded-tr-[32px] rounded-bl-[32px] rounded-br-[0px] bg-white w-[203px] h-[189px] outline-[10px]  overflow-hidden"
            style={{ outlineColor: theme.primaryColor }}
          >
            <img
              src={basicInfo.profilePhoto || "/default-avatar.png"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 bg-[#1E2837] px-[44px] flex items-center">
          {/* Name and Position */}
          <div
            className="bg-[#1E2837] outline-[7px]  flex-1 py-[34px] px-[14px] relative"
            style={{ outlineColor: theme.primaryColor }}
          >
            <p
              className="font-bold uppercase text-4xl text-center"
              style={{ color: theme.primaryColor }}
            >
              {basicInfo.fullName}
            </p>
            <p
              className={cn(
                "absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#1E2837] uppercase  py-[12px] px-[20px]",
                basicInfo.position.length > 20 ? "-bottom-12" : "-bottom-6"
              )}
              style={{ color: theme.bgColor }}
            >
              {basicInfo.position}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div id="content" className="mt-[35px] flex gap-[32px] pr-[42px]">
        <div
          className="w-[325px] min-h-[500px] py-[32px] pr-[32px] space-y-5"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {/* Contact */}
          <div className="">
            <h2
              className="bg-[#1E2837] uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
              style={{ color: theme.bgColor }}
            >
              {t("resumeBuilder.pdfHeaders.contact")}
            </h2>
            <div className="mt-4 space-y-2">
              {/* Email */}
              <div className=" flex items-center gap-2">
                <div className="pl-[24px] py-[6px] pr-2 flex items-center bg-[#1E2837]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={theme.primaryColor || "#71BDBD"}
                    className="w-6 h-6 inline-block self-start shrink-0"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>

                <span
                  className="ml-2  break-all"
                  style={{ color: theme.textColor }}
                >
                  {basicInfo.email}
                </span>
              </div>

              {/* Phone */}
              <div className=" flex items-center gap-2">
                <div className="pl-[24px] py-[6px] pr-2  flex items-center bg-[#1E2837]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={theme.primaryColor || "#71BDBD"}
                    className="w-6 h-6 inline-block self-start  shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <span
                  className="ml-2 break-all"
                  style={{ color: theme.textColor }}
                >
                  {basicInfo.phoneNumber}
                </span>
              </div>

              {/* Location */}
              <div className=" flex items-center gap-2">
                <div className="pl-[24px] py-[6px] pr-2 flex items-center bg-[#1E2837]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={theme.primaryColor || "#71BDBD"}
                    className="w-6 h-6 self-start shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <span
                  className="ml-2 break-all"
                  style={{ color: theme.textColor }}
                >
                  {basicInfo.location}
                </span>
              </div>

              {basicInfo.customFields &&
                basicInfo.customFields.map((field, index) => {
                  const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                  return (
                    <div key={index} className=" flex items-center gap-2">
                      <div className="pl-[24px] py-[6px] pr-2 flex items-center bg-[#1E2837]">
                        <div className="w-6 h-6 self-start shrink-0">
                          <Icon color={theme.primaryColor || "#71BDBD"} />
                        </div>
                      </div>
                      <span
                        className="ml-2 break-all"
                        style={{ color: theme.textColor }}
                      >
                        {field.value}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.skills")}
              </h2>
              <div className="mt-2 space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className=" flex items-center gap-2">
                    <Dot
                      size={20}
                      color={data.theme.primaryColor || "#71BDBD"}
                      className="self-start mt-1 font-bold"
                      strokeWidth={7}
                    />
                    <span className="ml-2">
                      {"- "}
                      <span
                        className=" font-semibold"
                        style={{ color: data.theme.textColor }}
                      >
                        {skill.name} :
                      </span>
                      <span style={{ color: data.theme.textColor }}>
                        {skill.description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objective */}
          {objective && (
            <div className="">
              <h2
                className="bg-[#1E2837] uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.objective")}
              </h2>
              <div
                className="ql-editor text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: objective.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}

          {/* certifications */}
          {certifications && certifications.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.certifications")}
              </h2>
              <div
                className="space-y-2 py-[18px] pl-[10px]"
                style={{ color: data.theme.textColor }}
              >
                {certifications.map((certification, index) => (
                  <div className="flex justify-between gap-2" key={index}>
                    <p className="font-semibold">{certification.name}</p>
                    <p className="">{certification.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interest */}
          {interests && (
            <div className="">
              <h2
                className="bg-[#1E2837] uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.interests")}
              </h2>
              <div
                className="ql-editor text-sm leading-relaxed pl-[10px]! pr-0! py-[18px]"
                dangerouslySetInnerHTML={{ __html: interests.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          {/* Education */}
          {education && education.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] w-full uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.education")}
              </h2>
              <div className="mt-[12px] ">
                {education?.map((edu) => (
                  <div
                    key={edu.order}
                    className="mb-[16px]"
                    style={{ color: data.theme.textColor }}
                  >
                    <p className="font-semibold text-[18px]">{edu.name}</p>
                    <p className="italic text-[14px]">{edu.major}</p>
                    <p className="text-[14px]">
                      {edu.startDate}-{edu.endDate}
                    </p>
                    {edu.score && (
                      <p className="text-[14px]">Score: {edu.score}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiences */}
          {experience && experience.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] w-full uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center"
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.experience")}
              </h2>
              <div className="mt-[12px] ">
                {experience?.map((exp, idx) => (
                  <div key={idx} className="mb-[12px]">
                    <div
                      className="flex items-start gap-2 justify-between"
                      style={{ color: data.theme.textColor }}
                    >
                      <div className="">
                        <p className="font-semibold text-[18px]">
                          {exp.position}
                        </p>
                        <p className="italic text-[14px]">{exp.company}</p>
                      </div>
                      <p className="text-[14px]">
                        {exp.startDate}-{exp.endDate}
                      </p>
                    </div>
                    <div
                      className="text-sm leading-relaxed px-[34px] py-[18px] ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: exp.description || "",
                      }}
                      style={{ color: data.theme.textColor }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] w-full uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.awards")}
              </h2>
              <div className="space-y-1">
                {awards?.map((award) => (
                  <div
                    key={award.order}
                    className=" mt-[12px] flex justify-between items-center"
                    style={{ color: data.theme.textColor }}
                  >
                    <p className="font-semibold text-[18px]">{award.title}</p>
                    <p className="text-[14px]">{award.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*Projects  */}
          {projects && projects.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] w-full uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.projects")}
              </h2>
              <div className="mt-[12px] ">
                {projects?.map((project) => (
                  <div key={project.order} className="mb-[12px]">
                    <div
                      className="flex justify-between items-start gap-6"
                      style={{ color: data.theme.textColor }}
                    >
                      <p className="font-semibold text-[18px]">
                        {project.title}
                      </p>
                      <p className="italic text-[14px] shrink-0">
                        {project.startDate} - {project.endDate}
                      </p>
                    </div>
                    <div
                      className="ql-editor !px-0 text-sm leading-relaxed py-[18px]"
                      dangerouslySetInnerHTML={{
                        __html: project.description || "",
                      }}
                      style={{ color: data.theme.textColor }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <div className="">
              <h2
                className="bg-[#1E2837] w-full uppercase text-[24px] font-semibold py-[8px] px-[12px] text-center "
                style={{ color: theme.bgColor }}
              >
                {t("resumeBuilder.pdfHeaders.references")}
              </h2>
              <div className="mt-[12px] space-y-4">
                {data.references?.map((ref, idx) => (
                  <div key={idx} className="mb-[12px]">
                    <p
                      className="font-semibold text-[18px]"
                      style={{ color: data.theme.textColor }}
                    >
                      {ref.information}
                    </p>
                    {ref.description && (
                      <div
                        className="ql-editor px-0! text-sm leading-relaxed py-[8px]"
                        dangerouslySetInnerHTML={{
                          __html: ref.description,
                        }}
                        style={{ color: data.theme.textColor }}
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

export default TemplateDolphin;
