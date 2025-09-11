import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  Home,
  CalendarDays,
  Clock,
  Briefcase,
  Users,
  MapPin,
} from "lucide-react";
import SuggestedJobs from "@/components/SuggestedJob";
import JobInformation from "@/components/JobInformation";
import JobApplicationModal from "@/components/JobApplicationModal";

const sampleJob = {
  title: "Senior Frontend Developer",
  company: "Tech Innovation Co.",
  companySize: "100-500 nhân viên",
  location: "Hồ Chí Minh",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  salary: "$2000 - $3000",
  period: "tháng",
  experience: "2 - 5 năm kinh nghiệm",
  level: "Nhân viên",
  education: "Cử nhân",
  gender: "Nữ",
  posted: "2 ngày trước",
  deadline: "30/12/2024",
  remainingDays: "15 ngày",
  applicationDeadline: "30/12/2024",
  logo: "https://thewebmax.org/react/jobzilla/assets/images/jobs-company/pic1.jpg",
  coverImage:
    "https://thewebmax.org/react/jobzilla/assets/images/job-detail-bg.jpg",
  isNew: true,
  website: "www.techinnovation.com",
  language: "Tiếng Anh, Tiếng Việt",
  jobType: "Công nghệ thông tin",
  workType: "Nhân viên toàn thời gian",
  age: "28 - 40",
  industry: "Kế toán / Kiểm toán , Tài chính / Đầu tư",
};

const sampleJobDescription = {
  keyResponsibilities: [
    "Develop and maintain responsive web applications using React.js and Next.js",
    "Collaborate with design team to implement pixel-perfect UI/UX designs",
    "Optimize application performance and ensure cross-browser compatibility",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and mentor junior developers",
  ],
  whatWeOffer: [
    "Competitive salary with performance bonuses",
    "Flexible working hours and remote work options",
    "Professional development opportunities",
    "Modern office with latest technology",
    "Health insurance and wellness programs",
  ],
  vietnameseResponsibilities: [
    "Phát triển và duy trì các ứng dụng web responsive",
    "Tối ưu hóa hiệu suất ứng dụng",
    "Tham gia review code và hướng dẫn developer junior",
  ],
  benefits: [
    "Lương cạnh tranh với thưởng hiệu suất",
    "Giờ làm việc linh hoạt",
    "Bảo hiểm sức khỏe đầy đủ",
    "Môi trường làm việc hiện đại",
    "Cơ hội phát triển nghề nghiệp",
  ],
  description: `
    <h4>Nhiệm vụ chính:</h4>
    <ul>
      <li>Phát triển và duy trì các ứng dụng web responsive sử dụng <strong>React.js</strong> và <strong>Next.js</strong></li>
      <li>Hợp tác với team thiết kế để triển khai các giao diện UI/UX hoàn hảo</li>
      <li>Tối ưu hóa hiệu suất ứng dụng và đảm bảo tương thích đa trình duyệt</li>
      <li>Viết code sạch, dễ bảo trì và có tài liệu đầy đủ</li>
      <li>Tham gia review code và hướng dẫn các developer junior</li>
    </ul>
    <h4>Trách nhiệm bổ sung:</h4>
    <p>Tham gia vào quá trình phát triển sản phẩm từ khâu lên ý tưởng đến triển khai, đảm bảo chất lượng code và tuân thủ các tiêu chuẩn công ty.</p>
  `,
};

const sampleQualifications = {
  english: [
    "3+ years of experience with React.js and modern JavaScript",
    "Strong knowledge of HTML5, CSS3, and responsive design",
    "Experience with state management libraries (Redux, Zustand)",
    "Familiarity with TypeScript and modern build tools",
    "Understanding of RESTful APIs and GraphQL",
  ],
  vietnamese: [
    "Có ít nhất 3 năm kinh nghiệm với React.js",
    "Thành thạo HTML5, CSS3 và responsive design",
    "Kinh nghiệm với các thư viện quản lý state",
    "Hiểu biết về TypeScript và các công cụ build hiện đại",
    "Kỹ năng giao tiếp tốt và làm việc nhóm",
  ],
  skillsRequired: `
    <h4>Kỹ năng bắt buộc:</h4>
    <ul>
      <li>Có ít nhất <strong>3 năm kinh nghiệm</strong> với React.js và JavaScript hiện đại</li>
      <li>Thành thạo <strong>HTML5, CSS3</strong> và responsive design</li>
      <li>Kinh nghiệm với các thư viện quản lý state như <em>Redux, Zustand</em></li>
      <li>Hiểu biết về <strong>TypeScript</strong> và các công cụ build hiện đại</li>
    </ul>
    <h4>Kỹ năng ưu tiên:</h4>
    <ul>
      <li>Kinh nghiệm với <strong>Next.js</strong> và Server-Side Rendering</li>
      <li>Hiểu biết về RESTful APIs và GraphQL</li>
      <li>Kỹ năng giao tiếp tốt và làm việc nhóm hiệu quả</li>
    </ul>
  `,
};

const sampleCompanyInfo = {
  name: "Tech Innovation Co.",
  size: "100-500 nhân viên",
  description:
    "Tech Innovation Co. là một công ty công nghệ hàng đầu chuyên phát triển các giải pháp phần mềm sáng tạo. Chúng tôi tập trung vào việc xây dựng các sản phẩm công nghệ tiên tiến và cung cấp dịch vụ chất lượng cao cho khách hàng trên toàn thế giới.",
  applicationInstructions: [
    "Gửi CV và thư xin việc qua email: hr@techinnovation.com",
    "- Tiêu đề email: [Frontend Developer] - Họ tên của bạn",
    "- Đính kèm portfolio hoặc link GitHub",
    "- Thời gian phản hồi: 3-5 ngày làm việc",
  ],
};

const relatedJobs = [
  {
    id: 2,
    title: "Kế toán tổng hợp",
    company: "Công ty XYZ",
    salary: "15 - 20 triệu VNĐ",
    type: "Toàn thời gian",
    typeColor: "bg-blue-500 text-blue-800",
  },
  {
    id: 3,
    title: "Trưởng phòng Tài chính",
    company: "Công ty DEF",
    salary: "30 - 40 triệu VNĐ",
    type: "Toàn thời gian",
    typeColor: "bg-green-500 text-green-800",
  },
];

const JobDetail = () => {
  const job = sampleJob;
  const jobDescription = sampleJobDescription;
  const qualifications = sampleQualifications;
  const companyInfo = sampleCompanyInfo;

  const suggestedJobs = relatedJobs.map((relatedJob) => ({
    id: relatedJob.id,
    title: relatedJob.title,
    company: relatedJob.company,
    salary: relatedJob.salary,
    type: relatedJob.type,
    typeColor: relatedJob.typeColor,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl opacity-60 animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-50 animate-float-gentle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-2xl opacity-40 animate-breathe"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-45 animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-35 animate-breathe"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-cyan-200 via-blue-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 left-0 w-64 h-24 bg-gradient-to-r from-purple-100 to-transparent opacity-50"></div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Home
            </span>
            <span>→</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Jobs
            </span>
            <span>→</span>
            <span className="text-blue-600 font-medium">Job Details</span>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            className="mb-4 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Job Information */}
          <div className="lg:col-span-2">
            <JobInformation
              job={job}
              jobDescription={jobDescription}
              qualifications={qualifications}
              companyInfo={companyInfo}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Job Quick Details */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/30 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-60"></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">
                    Job Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium text-gray-900">
                          {job.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Job Type</p>
                        <p className="font-medium text-gray-900">
                          {job.workType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium text-gray-900">
                          {job.companySize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarDays className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Application Deadline
                        </p>
                        <p className="font-medium text-gray-900">
                          {job.applicationDeadline}
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          {job.remainingDays}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t space-y-3">
                    <JobApplicationModal
                      jobTitle={job.title}
                      companyName={job.company}
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        Nộp đơn ngay
                      </Button>
                    </JobApplicationModal>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Lưu việc làm
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Suggested Jobs */}
              <SuggestedJobs
                jobs={suggestedJobs}
                onViewAll={() => console.log("View all suggested jobs")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
