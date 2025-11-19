import { templatePandaDummy } from "@/templates/TemplatePanda/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

const dummyData: ResumeData = templatePandaDummy;

const PAGE_HEIGHT = 1300;

function TemplatePanda({
  data = dummyData,
  ref,
}: {
  data?: ResumeData;
  ref?: RefObject<HTMLDivElement | null>;
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
  } = data;
  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  const topRef = useRef<HTMLDivElement>(null);
  const topHeight = topRef.current?.offsetHeight || 0;
  const colRightRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMinPageHeight = () => {
      if (colLeftRef.current) {
        const leftHeight = colLeftRef.current.offsetHeight;
        // Chọn max giữa PAGE_HEIGHT cứng và height colLeft
        setMinPageHeight(Math.max(PAGE_HEIGHT, leftHeight + 68));
      }
      if (topRef.current && colRightRef.current) {
        const topHeight = topRef.current.offsetHeight;
        colRightRef.current.style.paddingTop = `${topHeight}px`;
      }
    };

    updateMinPageHeight();

    const resizeObserver = new ResizeObserver(updateMinPageHeight);
    if (colLeftRef.current) resizeObserver.observe(colLeftRef.current);
    if (topRef.current) resizeObserver.observe(topRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      id="page-1"
      className="w-[900px] min-h-[1300px] mx-auto font-sans shadow-lg relative"
      style={{ minHeight: minPageHeight, backgroundColor: data.theme.bgColor }}
      ref={ref}
    >
      {/* Top */}
      <div
        id="template-top"
        ref={topRef}
        className="top-0 pl-[314px] absolute w-full bg-[#DCE1F5]"
      >
        <div className=" text-[#07113C] py-8 pt-10 px-[34px]">
          <h1
            className="text-[54px] font-normal uppercase font-fahkwang text-[#07113c] text-center"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo?.fullName}
          </h1>
          <p
            className="text-lg font-semibold font-raleway mt-2 uppercase text-[#07113c] text-center"
            style={{ color: data.theme.primaryColor }}
          >
            {basicInfo.position}
          </p>
        </div>
      </div>

      {/* Col-1 : Left */}
      <div
        ref={colLeftRef}
        className="w-[280px] absolute top-[34px] left-[34px] min-h-[500px] space-y-3"
      >
        {/* Avatar & Contact */}
        <div className="bg-[#F5F7FF] py-[36px]">
          {/* Avatar */}
          <div className="mx-auto w-[212px] h-[270px] overflow-hidden mb-[36px]">
            <img
              src={basicInfo.avatarUrl}
              alt={basicInfo.fullName}
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Contact Info */}
          <div className="px-[18px]">
            <h1
              className="uppercase text-[26px] font-fahkwang font-semibold"
              style={{ color: data.theme.primaryColor }}
            >
              Contact
            </h1>
            <div className="mt-2 space-y-2">
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

              {/* Website */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.primaryColor || "#3d509f"}
                  className="w-6 h-6 self-start shrink-0"
                >
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
                <span
                  className="ml-2 text-[#07113c] break-all"
                  style={{ color: data.theme.textColor }}
                >
                  {basicInfo.website}
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
        </div>

        {/* Skills */}
        {skills && (
          <div className="bg-[#F5F7FF] py-[36px]">
            <div className="px-[18px]">
              <h1
                className="uppercase text-[26px] font-fahkwang font-semibold"
                style={{ color: data.theme.primaryColor }}
              >
                Skills
              </h1>
              <div className="mt-2 space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className=" flex items-center gap-2">
                    <Dot
                      size={20}
                      color={data.theme.primaryColor || "#3d509f"}
                      className="self-start mt-1 font-bold"
                      strokeWidth={7}
                    />
                    <span className="ml-2">
                      <span
                        className=" font-semibold"
                        style={{ color: data.theme.primaryColor }}
                      >
                        {" "}
                        {skill.name} :
                      </span>{" "}
                      <span style={{ color: data.theme.textColor }}>
                        {skill.description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {education && (
          <div className="bg-[#F5F7FF] py-[36px]">
            <div className="px-[18px]">
              <h1
                className="uppercase text-[26px] font-fahkwang font-semibold"
                style={{ color: data.theme.primaryColor }}
              >
                Educations
              </h1>
              <div className="mt-2 space-y-2">
                {education.map((e, idx) => (
                  <div
                    key={idx}
                    className="mb-3 flex items-center gap-1"
                    style={{ color: data.theme.textColor }}
                  >
                    <Dot
                      size={10}
                      color={data.theme.primaryColor || "#3d509f"}
                      className="self-start mt-2 font-bold"
                      strokeWidth={7}
                    />
                    <div>
                      <div className="font-semibold">{e.institution}</div>
                      {e.studyType && (
                        <div className="text-sm ">{e.studyType}</div>
                      )}
                      {e.score && <div className="text-sm ">{e.score}</div>}
                      {e.dateRange && (
                        <div className="text-sm ">{e.dateRange}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Awards */}
        {awards && (
          <div className="bg-[#F5F7FF] py-[36px]">
            <div className="px-[18px]">
              <h1
                className="uppercase text-[26px] font-fahkwang font-semibold"
                style={{ color: data.theme.primaryColor }}
              >
                Awards
              </h1>
              <div className="mt-2 space-y-2">
                {awards.map((award, idx) => (
                  <div
                    key={idx}
                    className="mb-3"
                    style={{ color: data.theme.textColor }}
                  >
                    <div className="font-semibold">{award.title}</div>
                    {award.date && <div className="text-sm ">{award.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Col-2 : Right */}
      <div className="pl-[calc(280px+34px)]" ref={colRightRef}>
        <div className="p-[34px] space-y-4">
          {/* Objective */}
          {objective && (
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: objective.description }}
              style={{ color: data.theme.textColor }}
            />
          )}

          <hr
            className="h-[1.5px] border-0"
            style={{ backgroundColor: data.theme.primaryColor }}
          />

          {/* Experience */}
          {experience && experience.length > 0 && (
            <>
              <div>
                <h2
                  className=" font-bold mb-5 font-fahkwang text-[26px] uppercase"
                  style={{ color: data.theme.primaryColor }}
                >
                  Experience
                </h2>

                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="mb-6"
                    style={{ color: data.theme.textColor }}
                  >
                    <div className="flex justify-between font-semibold text-sm">
                      <div className="font-raleway uppercase text-[18px]">
                        {exp.position}
                      </div>
                      <div>{exp.duration}</div>
                    </div>
                    <div className="text-base italic  mb-2 font-raleway font-medium">
                      {exp.company}
                    </div>

                    <div
                      className="text-sm  leading-relaxed font-raleway font-medium"
                      dangerouslySetInnerHTML={{ __html: exp.summary || "" }}
                    />
                  </div>
                ))}
              </div>

              <hr
                className="h-[1.5px] border-0"
                style={{ backgroundColor: data.theme.primaryColor }}
              />
            </>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2
                className=" font-bold mb-5 font-fahkwang text-[26px] uppercase"
                style={{ color: data.theme.primaryColor }}
              >
                projects
              </h2>
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className="mb-6"
                  style={{ color: data.theme.textColor }}
                >
                  <div className="flex justify-between gap-3 font-semibold text-sm">
                    <div className="font-raleway uppercase text-[18px] max-w-[70%]">
                      {project.title}
                    </div>
                    <div>
                      <span>{project.startDate}</span> -{" "}
                      <span>{project.endDate}</span>
                    </div>
                  </div>

                  <div
                    className="text-sm  leading-relaxed font-raleway font-medium mt-2"
                    dangerouslySetInnerHTML={{
                      __html: project.description || "",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default TemplatePanda;
