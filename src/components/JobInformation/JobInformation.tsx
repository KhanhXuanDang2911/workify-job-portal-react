import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Heart,
  Share2,
  CalendarDays,
  Clock,
  Briefcase,
  Users,
  Building2,
  DollarSign,
  GraduationCap,
  Globe,
  Phone,
  Mail,
  Award,
  Target,
  Gift,
  UserCheck,
  Layers,
  User,
  Grid3X3,
} from "lucide-react";
import JobApplicationModal from "../JobApplicationModal";

interface JobInformationProps {
  job: {
    title: string;
    company: string;
    companySize: string;
    location: string;
    address: string;
    salary: string;
    period: string;
    experience: string;
    level: string;
    education: string;
    gender: string;
    posted: string;
    deadline: string;
    remainingDays: string;
    applicationDeadline: string;
    logo: string;
    coverImage?: string;
    isNew?: boolean;
    website: string;
    language: string;
    jobType: string;
    workType: string;
    age: string;
    industry: string;
  };
  jobDescription: {
    keyResponsibilities: string[];
    whatWeOffer: string[];
    vietnameseResponsibilities: string[];
    benefits: string[];
    description?: string;
  };
  qualifications: {
    english: string[];
    vietnamese: string[];
    skillsRequired?: string;
  };
  companyInfo: {
    name: string;
    size: string;
    description: string;
    applicationInstructions: string[];
  };
}

const JobInformation: React.FC<JobInformationProps> = ({
  job,
  jobDescription,
  qualifications,
  companyInfo,
}) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Company Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        {job.coverImage && (
          <img
            src={job.coverImage || "/placeholder.svg"}
            alt={`${job.company} cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>

        {/* New Badge - Repositioned */}
        {job.isNew && (
          <Badge className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 font-medium">
            New
          </Badge>
        )}
      </div>

      {/* Job Header */}
      <div className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Company Logo */}
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white -mt-10 relative z-10">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={job.company}
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <p className="text-lg font-medium text-gray-800">
                    {job.company}
                  </p>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-blue-600 text-sm">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="hover:underline cursor-pointer">
                    {job.website}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Lưu
                </Button>
                <JobApplicationModal
                  jobTitle={job.title}
                  companyName={job.company}
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Nộp đơn ngay
                  </Button>
                </JobApplicationModal>
              </div>
            </div>

            {/* Job Meta Info with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/80 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-gray-900">
                    {job.salary}{" "}
                    <span className="text-sm font-normal">/ {job.period}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-semibold text-green-600">{job.posted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Hết hạn trong</p>
                  <p className="font-semibold text-red-600">
                    {job.remainingDays}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => scrollToSection(descriptionRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Mô tả
          </button>
          <button
            onClick={() => scrollToSection(benefitsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Quyền lợi
          </button>
          <button
            onClick={() => scrollToSection(skillsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Kỹ năng yêu cầu
          </button>
          <button
            onClick={() => scrollToSection(detailsRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Chi tiết công việc
          </button>
          <button
            onClick={() => scrollToSection(contactRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Liên hệ
          </button>
          <button
            onClick={() => scrollToSection(companyRef)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors"
          >
            Về công ty
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">
        {/* Job Description Section */}
        <div ref={descriptionRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-600">Mô tả công việc</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-lg p-6 border border-blue-100">
            {jobDescription.description ? (
              <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: jobDescription.description }}
              />
            ) : (
              <div className="space-y-4 text-gray-700">
                {jobDescription.keyResponsibilities.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Benefits Section */}
        <div ref={benefitsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-600">Phúc lợi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                What We Offer
              </h4>
              {jobDescription.whatWeOffer.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Quyền lợi</h4>
              {jobDescription.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Skills Required Section */}
        <div ref={skillsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-600">
              Kỹ năng yêu cầu
            </h3>
          </div>

          <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-lg p-6 border border-orange-100">
            {qualifications.skillsRequired ? (
              <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: qualifications.skillsRequired,
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {qualifications.english.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-orange-600" />
                      English Requirements
                    </h4>
                    <div className="space-y-3">
                      {qualifications.english.map((skill, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {qualifications.vietnamese.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      Yêu cầu kỹ năng
                    </h4>
                    <div className="space-y-3">
                      {qualifications.vietnamese.map((skill, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Job Details Section */}
        <div ref={detailsRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-600">
              Chi tiết công việc
            </h3>
          </div>

          <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-lg p-6 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Loại công việc
                    </p>
                    <p className="font-semibold text-gray-900">
                      {job.workType || "Nhân viên toàn thời gian"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Layers className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Cấp bậc</p>
                    <p className="font-semibold text-gray-900">{job.level}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Học vấn</p>
                    <p className="font-semibold text-gray-900">
                      {job.education}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Kinh nghiệm
                    </p>
                    <p className="font-semibold text-gray-900">
                      {job.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Giới tính
                    </p>
                    <p className="font-semibold text-gray-900">{job.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tuổi</p>
                    <p className="font-semibold text-gray-900">
                      {job.age || "28 - 40"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Grid3X3 className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Ngành nghề
                    </p>
                    <p className="font-semibold text-gray-900">
                      {job.industry || job.jobType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Section */}
        <div ref={contactRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-indigo-600">
              Thông tin liên hệ
            </h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">
                  Tên liên hệ: {companyInfo.name}
                </h4>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> {job.address}
                </p>
              </div>

              <div className="space-y-3">
                {companyInfo.applicationInstructions.map(
                  (instruction, index) => (
                    <div key={index} className="text-gray-700">
                      {instruction.startsWith("-") ? (
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{instruction.substring(1).trim()}</span>
                        </div>
                      ) : (
                        instruction
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <strong>Ngôn ngữ:</strong> {job.language}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-600" />
                  <strong>Đăng tuyển:</strong> {job.applicationDeadline}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Section */}
        <div ref={companyRef} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-emerald-600">Về công ty</h3>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-lg p-6 border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-emerald-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                {companyInfo.name}
              </h4>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-gray-600">
                <strong>Quy mô:</strong> {companyInfo.size}
              </p>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p>{companyInfo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInformation;
