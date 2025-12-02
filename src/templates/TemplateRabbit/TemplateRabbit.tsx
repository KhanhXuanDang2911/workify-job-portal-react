import { templateRabbitDummy } from "@/templates/TemplateRabbit/dummy";
import { CUSTOMFIELD_MAP_ICON, type ResumeData } from "@/types/resume.type";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

const dummyData: ResumeData = templateRabbitDummy;

const PAGE_HEIGHT = 1300;

function TemplateRabbit({
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
    references,
  } = data;
  const [minPageHeight, setMinPageHeight] = useState(PAGE_HEIGHT);

  const topRef = useRef<HTMLDivElement>(null);

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
      className="w-[900px] mx-auto font-sans shadow-lg relative flex flex-col pointer-events-none select-none"
      ref={ref}
      style={{ minHeight: minPageHeight, backgroundColor: data.theme.bgColor }}
    >
      {/* Top header */}
      <div
        className="flex pb-[30px]"
        ref={topRef}
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        {/* Placeholder Right */}
        <div className="w-[300px]"></div>
        <div className="text-center flex-1 ">
          <p
            className="uppercase text-[46px] pt-10"
            style={{ color: data.theme.bgColor }}
          >
            {data.basicInfo.fullName}
          </p>
          <p
            className="uppercase text-[25px]"
            style={{ color: data.theme.bgColor }}
          >
            {data.basicInfo.position}
          </p>
        </div>
      </div>
      {/* Line */}
      <div
        className="w-full h-1 my-2 relative"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        <div
          className="w-[190px] h-[190px] aspect-square rounded-full absolute top-1/2 -translate-y-1/2 left-[150px] -translate-x-1/2 flex items-center justify-center p-[6px] overflow-hidden"
          style={{
            border: `6px solid ${data.theme.primaryColor}`,
            outline: `6px solid ${data.theme.bgColor}`,
            backgroundColor: data.theme.bgColor,
          }}
        >
          <img
            src={data.basicInfo.avatarUrl}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-row">
        {/* LEft col */}
        <div
          className="w-[300px] min-h-[1000px] pt-[110px] px-[18px]"
          style={{ backgroundColor: data.theme.primaryColor }}
        >
          {/* Contact Info */}
          <div className=" px-[18px]">
            <h1
              className="uppercase text-[26px] font-fahkwang font-semibold"
              style={{ color: data.theme.bgColor }}
            >
              Contact
            </h1>
            <div className="mt-2 space-y-2">
              {/* Email */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.bgColor}
                  className="w-6 h-6 inline-block self-start shrink-0"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <span
                  className="ml-2 text-[#07113c] break-all"
                  style={{ color: data.theme.bgColor }}
                >
                  {basicInfo.email}
                </span>
              </div>

              {/* Phone */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.bgColor}
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
                  style={{ color: data.theme.bgColor }}
                >
                  {basicInfo.phone}
                </span>
              </div>

              {/* Location */}
              <div className=" flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.bgColor}
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
                  style={{ color: data.theme.bgColor }}
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
                        <Icon color={data.theme.bgColor} />
                      </div>
                      <span
                        className="ml-2 text-[#07113c] break-all"
                        style={{ color: data.theme.bgColor }}
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
            <div className="pt-[36px]">
              <div className="px-[18px]">
                <h1
                  className="uppercase text-[26px] font-fahkwang font-semibold"
                  style={{ color: data.theme.bgColor }}
                >
                  Skills
                </h1>
                <div className="mt-2 space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className=" flex items-center gap-2">
                      <Dot
                        size={20}
                        color={data.theme.bgColor}
                        className="self-start mt-1 font-bold"
                        strokeWidth={7}
                      />
                      <span className="ml-2">
                        <span
                          className=" font-semibold"
                          style={{ color: data.theme.bgColor }}
                        >
                          {" "}
                          {skill.name} :
                        </span>{" "}
                        <span style={{ color: data.theme.bgColor }}>
                          {skill.description}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <div className="pt-[36px]">
              <div className="px-[18px]">
                <h1
                  className="uppercase text-[26px] font-fahkwang font-semibold"
                  style={{ color: data.theme.bgColor }}
                >
                  Awards
                </h1>
                <div className="mt-2 space-y-2">
                  {awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="mb-3"
                      style={{ color: data.theme.bgColor }}
                    >
                      <div className="font-semibold">{award.title}</div>
                      {award.date && (
                        <div className="text-sm ">{award.date}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* interests */}
          {interests && (
            <div className="pt-[36px]">
              <div className="px-[18px]">
                <h1
                  className="uppercase text-[26px] font-fahkwang font-semibold"
                  style={{ color: data.theme.bgColor }}
                >
                  interests
                </h1>
                <div
                  className="text-sm leading-relaxed pt-2"
                  dangerouslySetInnerHTML={{ __html: interests.description }}
                  style={{ color: data.theme.bgColor }}
                />
              </div>
            </div>
          )}

          {/* Certifications*/}
          {certifications && certifications.length > 0 && (
            <div className="pt-[36px]">
              <div className="px-[18px]">
                <h1
                  className="uppercase text-[26px] font-fahkwang font-semibold"
                  style={{ color: data.theme.bgColor }}
                >
                  Certifications
                </h1>
                <div className="mt-2 space-y-2">
                  {certifications.map((certification, idx) => (
                    <div
                      key={idx}
                      className="mb-3"
                      style={{ color: data.theme.bgColor }}
                    >
                      <div className="font-semibold">{certification.name}</div>
                      {certification.date && (
                        <div className="text-sm ">{certification.date}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="pt-[36px]">
              <div className="px-[18px]">
                <h1
                  className="uppercase text-[26px] font-fahkwang font-semibold"
                  style={{ color: data.theme.bgColor }}
                >
                  References
                </h1>
                <div className="mt-2 space-y-2">
                  {references.map((reference, idx) => (
                    <div
                      key={idx}
                      className="mb-3"
                      style={{ color: data.theme.bgColor }}
                    >
                      <div className="font-semibold">
                        {reference.information}
                      </div>
                      {reference.description && (
                        <div className="text-sm ">{reference.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right col */}

        <div
          className="flex flex-col flex-1 py-[34px] relative"
          style={{ backgroundColor: data.theme.bgColor }}
        >
          {/* Objective */}
          {objective && (
            <div className="">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-3 uppercase w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.bgColor}
                  className="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="" style={{ color: data.theme.bgColor }}>
                  Objective
                </span>
              </h2>
              <div
                className="ql-editor text-sm leading-relaxed px-[34px]! py-[18px]!"
                dangerouslySetInnerHTML={{ __html: objective.description }}
                style={{ color: data.theme.textColor }}
              />
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-3 uppercase w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
                style={{ backgroundColor: data.theme.primaryColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={data.theme.bgColor}
                  className="w-6 h-6"
                >
                  <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                </svg>

                <span className="" style={{ color: data.theme.bgColor }}>
                  Education
                </span>
              </h2>
              <div
                className="space-y-2 px-[34px] py-[18px]"
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

          {/* Experiences */}
          {experience && experience.length > 0 && (
            <div className="">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-3 uppercase w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
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

                <span className="" style={{ color: data.theme.bgColor }}>
                  Experiences
                </span>
              </h2>
              <div
                className="space-y-2 px-[34px] py-[18px]"
                style={{ color: data.theme.textColor }}
              >
                {experience.map((exp, index) => (
                  <div className="">
                    <div className=" flex gap-3" key={index}>
                      <div
                        className="px-3 pr-5 py-1 self-start mt-2"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
                          backgroundColor: data.theme.primaryColor,
                          color: data.theme.bgColor,
                        }}
                      >
                        {exp.startDate}-{exp.endDate}
                      </div>
                      <div className="">
                        <div className="font-raleway uppercase text-[18px]">
                          {exp.position}
                        </div>
                        <div className="text-base italic  mb-2 font-raleway font-medium">
                          {exp.company}
                        </div>
                      </div>
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="">
              <h2
                className=" font-bold font-fahkwang text-[26px] py-3 uppercase w-[70%] rounded-tr-4xl rounded-br-4xl flex gap-2 items-center pl-4"
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

                <span className="" style={{ color: data.theme.bgColor }}>
                  Projects
                </span>
              </h2>
              <div
                className="space-y-2 px-[34px] py-[18px]"
                style={{ color: data.theme.textColor }}
              >
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
                      className="ql-editor text-sm  leading-relaxed font-raleway font-medium mt-2"
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

export default TemplateRabbit;
