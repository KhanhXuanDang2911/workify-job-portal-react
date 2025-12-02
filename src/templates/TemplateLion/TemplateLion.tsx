import { templateLionDummy } from "@/templates/TemplateLion/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { useEffect, useState, type RefObject } from "react";

const PAGE_HEIGHT = 1300;
const dummyData: ResumeData = templateLionDummy;

function TemplateLion({
  data = dummyData,
  ref,
  onUpdateHeight,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
  onUpdateHeight?: (newHeight: number) => void;
}) {
  const {
    basicInfo,
    experience,
    education,
    skills,
    awards,
    certifications,
    interests,
    objective,
    projects,
    theme,
  } = data;
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
      style={{ backgroundColor: data.theme.bgColor }}
    >
      <div id="top">
        <div className="absolute top-0 left-0 h-[100px]">
          <svg
            width="244"
            height="51"
            viewBox="0 0 244 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0 0V44.3C19.3 54.9 44.1 50 64.3 45.2C88.3 39.5 110.9 29.2 133.8 20.2C146.6 15.2 159.7 10.6 173.1 7.5C186.1 4.5 199.3 2.4 212.6 1.3C222.9 0.399999 233.2 0 243.5 0C201.2 0 3.7 0 0 0Z"
              fill={theme.primaryColor}
            />
          </svg>
        </div>

        <div className="absolute top-0 right-0 h-[184px]">
          <svg
            width="179"
            height="93"
            viewBox="0 0 179 93"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M178.6 92.2V0H0C24.8 4.6 49 12.2 72 22.3C111 39.3 148.6 61.8 178.6 92.2Z"
              fill={theme.primaryColor}
            />
          </svg>
        </div>

        <div className="absolute top-[13px] w-full">
          <svg
            width="484"
            height="176"
            viewBox="0 0 484 176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M376.6 27.1932C333.6 8.39319 286.3 -1.90681 239 0.293185C188.1 2.69319 137.3 19.0932 92.3 39.8932C64.1 52.8932 31.6 61.1932 0 54.1932V62.2932V128.093C58.6 138.193 93.5 71.1932 159 34.6932C245.6 -13.5068 345.8 27.0932 412.5 89.6932C435.9 111.693 459.9 139.693 483.2 175.293V97.0932C453.2 66.6932 415.6 44.2932 376.6 27.1932Z"
              fill={theme.textColor}
            />
          </svg>
        </div>

        <div className="absolute top-[45px] w-[440px] left-0">
          <svg
            width="232"
            height="266"
            viewBox="0 0 232 266"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M6 220.5C21.8 247.6 51.2 265.8 84.9 265.8C130.8 265.8 168.8 231.9 175.3 187.7C182.5 138 146.8 90.6 171.2 41.8C176 32.2 182.7 23.5 191.4 16.5C202.8 7.3 216.3 1 231.7 0C195.3 0 157.6 22.3 130 44.1C92.9 73.4 68.5 116.5 11.4 120.2C7.70001 120.4 3.9 120.5 0 120.4V140.7V206.3C1.9 211.5 3.9 216.2 6 220.5Z"
              fill={theme.textColor}
            />
          </svg>
        </div>

        <div className="absolute top-[100px] w-[271px] right-0">
          <svg
            width="146"
            height="178"
            viewBox="0 0 146 178"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M69 49.3C48.7 30.2 25.2 13.1 0 0C24.1 15 46.2 33.9 65 54.5C92.5 84.7 120.3 124.7 145.4 177.8V143.8C120.3 103.8 94.3 73 69 49.3Z"
              fill={theme.primaryColor}
            />
          </svg>
        </div>

        {/* Avatar */}
        <div
          className="absolute top-[275px] w-[230px] left-[48px] bg-gray-500 aspect-square rounded-full outline-[12px]  overflow-hidden"
          style={{ outlineColor: theme.bgColor }}
        >
          <img
            src={data.basicInfo.avatarUrl}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Bottom- right */}
        <div className="absolute bottom-0 right-0 w-[170px] ">
          <svg
            width="84"
            height="61"
            viewBox="0 0 84 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M81.5 3C79.2 6.2 77 9.29996 74.6 12.4C61.3 29.1 41.4 35.2 23 44.1C17.2 46.9 11.5 50.1 6.5 54.3C4.3 56.2 1.9 58.4 0 60.8H83.5V0C83.2 0.4 83 0.899963 82.6 1.39996C82.3 1.89996 81.9 2.5 81.5 3Z"
              fill={theme.primaryColor}
            />
          </svg>
        </div>

        <div className="absolute bottom-0 right-[14px] w-[200px] ">
          <svg
            width="95"
            height="60"
            viewBox="0 0 95 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M18.2 53C23.2 48.9 28.8 45.6 34.7 42.8C53.2 33.9 73.1 27.8 86.3 11.1C88.7 8.09998 91 4.90001 93.2 1.70001C93.6 1.20001 94 0.6 94.4 0C78.9 21.5 51.8 29.4 28.8 39.8C20.9 43.4 13.2 47.4 6.5 52.9C4.3 54.8 1.9 57 0 59.4H11.8C13.6 57.1 16 54.9 18.2 53Z"
              fill={theme.primaryColor}
            />
          </svg>
        </div>

        <div className="absolute -bottom-[2px] right-[97px] w-[160px] ">
          <svg
            width="70"
            height="33"
            viewBox="0 0 70 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M21.3 25.6C26.3 21.5 31.9 18.2 37.8 15.4C48.6 10.2 59.8 6 69.9 0C57.7 6.4 38.3 10.8 25.4 16.3C18.4 19.3 11.6 22.8 5.5 27.4C3.7 28.8 1.8 30.4 0 32.1H14.8C16.7 29.7 19.1 27.5 21.3 25.6Z"
              fill={theme.textColor}
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div id="content" className="px-[32px] flex flex-row ">
        {/* Right Col */}
        <div className=" w-[330px] min-h-[500px] mt-[570px]">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="pt-[16px]">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <span className="" style={{ color: data.theme.bgColor }}>
                  Skills
                </span>
              </h2>

              <div
                className="space-y-2 py-[18px]"
                style={{ color: data.theme.textColor }}
              >
                {skills.map((skill, index) => (
                  <div
                    className=""
                    style={{
                      color: theme.textColor,
                    }}
                    key={index}
                  >
                    <p className="">{skill.name}</p>
                    <p className="">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <div className="pt-[16px]">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <span className="" style={{ color: data.theme.bgColor }}>
                  awards
                </span>
              </h2>

              <div
                className="space-y-2 py-[18px]"
                style={{ color: data.theme.textColor }}
              >
                {awards.map((award, index) => (
                  <div className="flex justify-between gap-2" key={index}>
                    <p className="font-semibold">{award.title}</p>
                    <p className="">{award.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* certifications */}
          {certifications && certifications.length > 0 && (
            <div className="pt-[16px]">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <span className="" style={{ color: data.theme.bgColor }}>
                  certifications
                </span>
              </h2>

              <div
                className="space-y-2 py-[18px]"
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

          {/* Contact Info */}
          <div className="pt-[16px]">
            <h2
              className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
              style={{ backgroundColor: data.theme.primaryColor }}
            >
              <span className="" style={{ color: data.theme.bgColor }}>
                Contact
              </span>
            </h2>
            <div className="mt-2 space-y-2  py-[18px]">
              {/* Email */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.primaryColor || "#3d509f"}
                  className="w-6 h-6 inline-block self-start shrink-0"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <span
                  className="ml-2 text-[#07113c] break-all"
                  style={{ color: data.theme.textColor }}
                >
                  {basicInfo.email}
                </span>
              </div>

              {/* Phone */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.primaryColor || "#3d509f"}
                  className="w-6 h-6 inline-block self-start  shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="ml-2 text-[#07113c] break-all"
                  style={{ color: data.theme.textColor }}
                >
                  {basicInfo.phone}
                </span>
              </div>

              {/* Location */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.primaryColor || "#3d509f"}
                  className="w-6 h-6 self-start shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="ml-2 text-[#07113c] break-all"
                  style={{ color: data.theme.textColor }}
                >
                  {basicInfo.location}
                </span>
              </div>

              {data.basicInfo.customFields &&
                data.basicInfo.customFields.map((field, index) => {
                  const Icon = CUSTOMFIELD_MAP_ICON[field.type];
                  return (
                    <div key={index} className=" flex items-center gap-2">
                      <div className="w-6 h-6 self-start shrink-0">
                        <Icon color={data.theme.primaryColor || "#3d509f"} />
                      </div>
                      <span
                        className="ml-2 text-[#07113c] break-all"
                        style={{ color: data.theme.textColor }}
                      >
                        {field.value}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Interest */}
          {interests && (
            <div className="pt-[16px]">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <span className="" style={{ color: data.theme.bgColor }}>
                  Interest
                </span>
              </h2>
              <div className="py-[18px]">
                <div
                  className="ql-editor px-0! text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: interests.description }}
                  style={{ color: data.theme.textColor }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className=" flex-1  min-h-[500px] mt-[90px] px-[14px]">
          {/* Head */}
          <p
            className="text-[46px] w-[60%] font-semibold"
            style={{ color: theme.textColor }}
          >
            {basicInfo.fullName}
          </p>
          <p
            className="uppercase text-[#A82125] text-[28px] w-[70%] "
            style={{ color: theme.primaryColor }}
          >
            {basicInfo.position}
          </p>

          {/* Right content */}
          <div className="relative mr-[40px] h-full pt-[16px]">
            {/* Decorator top */}
            <div className="absolute w-full flex items-center gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* Line */}
                  <div
                    className="w-9 h-[2px] "
                    style={{
                      backgroundColor: theme.textColor,
                      opacity: "50%",
                    }}
                  ></div>
                  {/* Render dot chỉ khi KHÔNG phải line cuối */}
                  {index < 6 - 1 && (
                    <div
                      className="w-3 h-3 border-2 rounded-full"
                      style={{ borderColor: theme.primaryColor }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Decorator left */}
            <div className="absolute flex  flex-col items-start gap-3 -left-2 top-[184px] h-full py-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-3 ">
                  {/* Line */}
                  <div
                    className="h-9 w-[2px] bg-gray-300"
                    style={{
                      backgroundColor: theme.textColor,
                      opacity: "50%",
                    }}
                  ></div>
                  {/* Render dot chỉ khi KHÔNG phải line cuối */}
                  {index < 8 - 1 && (
                    <div
                      className="w-3 h-3 border-2  rounded-full"
                      style={{ borderColor: theme.primaryColor }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-[30px] pl-[16px]">
              {/* Objective */}
              {objective && (
                <div className="">
                  <h2
                    className=" font-bold mb-2 font-fahkwang text-[26px] capitalize"
                    style={{ color: data.theme.primaryColor }}
                  >
                    Objective
                  </h2>
                  {objective && (
                    <div
                      className="ql-editor text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: objective.description,
                      }}
                      style={{ color: data.theme.textColor }}
                    />
                  )}
                </div>
              )}

              {/* Experience */}
              {experience && experience.length > 0 && (
                <div className="pt-[16px]">
                  <div className="flex items-center gap-2  ">
                    <div
                      className="h-[46px] aspect-square flex items-center justify-center"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={data.theme.bgColor}
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                        <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                      </svg>
                    </div>
                    <h2
                      className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <span className="" style={{ color: data.theme.bgColor }}>
                        Experiences
                      </span>
                    </h2>
                  </div>

                  <div
                    className="space-y-2 py-[18px]"
                    style={{ color: data.theme.textColor }}
                  >
                    {experience.map((exp, index) => (
                      <div className="" key={index}>
                        <div className="flex justify-between">
                          <p className="font-semibold text-lg">
                            {exp.position}
                          </p>
                          <p className="">
                            {exp.startDate}-{exp.endDate}
                          </p>
                        </div>
                        <div
                          className="ql-editor text-sm leading-relaxed px-[34px] py-[18px]"
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

              {/* Project */}
              {projects && projects.length > 0 && (
                <div className="pt-[16px]">
                  <div className="flex items-center gap-2  ">
                    <div
                      className="h-[46px] aspect-square flex items-center justify-center"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={data.theme.bgColor}
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h2
                      className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <span className="" style={{ color: data.theme.bgColor }}>
                        Project
                      </span>
                    </h2>
                  </div>

                  <div
                    className="space-y-2 py-[18px]"
                    style={{ color: data.theme.textColor }}
                  >
                    {projects.map((project, index) => (
                      <div className="" key={index}>
                        <div className="flex justify-between">
                          <p className="font-semibold text-lg">
                            {project.title}
                          </p>
                          <p className="">
                            {project.startDate}-{project.endDate}
                          </p>
                        </div>
                        <div
                          className="ql-editor text-sm leading-relaxed px-[34px] py-[18px]"
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

              {/* Education */}
              {education && education.length > 0 && (
                <div className="pt-[16px]">
                  <div className="flex items-center gap-2  ">
                    <div
                      className="h-[46px] aspect-square flex items-center justify-center"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={data.theme.bgColor}
                        className="w-6 h-6"
                      >
                        <path d="M12 3.25l9.931 4.482a.75.75 0 010 1.336l-9.93 4.482a.75.75 0 01-.662 0L2.069 9.068a.75.75 0 010-1.336L12 3.25z" />
                        <path
                          fillRule="evenodd"
                          d="M4.5 9.75v5.982c0 3.493 2.628 6.432 6.09 6.718v3.3a.75.75 0 001.5 0v-3.3c3.462-.286 6.09-3.225 6.09-6.718V9.75l-7.59 3.429a2.25 2.25 0
                          01-1.82 0L4.5 9.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h2
                      className=" font-bold font-fahkwang text-[26px] py-2 h-[46px] box-border capitalize w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    >
                      <span className="" style={{ color: data.theme.bgColor }}>
                        Education
                      </span>
                    </h2>
                  </div>
                  <div
                    className="space-y-2 py-[18px]"
                    style={{ color: data.theme.textColor }}
                  >
                    {education.map((edu, index) => (
                      <div className=" flex gap-3" key={index}>
                        <div className="">
                          <p className="font-semibold text-lg">{edu.name}</p>
                          <p className="italic">{edu.major}</p>
                          {edu.score && <p className="">{edu.score}</p>}
                        </div>
                        <div className="ml-auto self-start mt-1">
                          <span>
                            {edu.startDate}-{edu.endDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateLion;
