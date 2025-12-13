import type { ResumeData } from "@/types/resume.type";

// English dummy data
export const templateProfessional2DummyEn: ResumeData = {
  basicInfo: {
    fullName: "JACOB ROBERTS",
    position: "Product Manager | PaaS Expertise | Strategic Vision",
    email: "help@enhancv.com",
    phoneNumber: "+44 20 7123 4567",
    location: "Edinburgh, UK",
    profilePhoto: "/template_avatar/default1.jpg",
    customFields: [
      {
        type: "LINKEDIN",
        value: "linkedin.com",
      },
    ],
  },
  objective: {
    description:
      "<p>Experienced Product Manager with a strong record of boosting user experience and streamlining product delivery. Significant achievements in driving product strategy, with over 6 years of experience and a passion for DevOps practices.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "TechSolutions Ltd",
      position: "Senior Product Manager",
      startDate: "07/2019",
      endDate: "Present",
      description:
        "<ul><li>Orchestrated the launch of an innovative SaaS product, leading to a 30% increase in market penetration over 12 months.</li><li>Enhanced product delivery cycles through Agile methodologies, reducing time-to-market by 40%.</li><li>Fostered cross-departmental collaboration, resulting in a unified approach to product development and a 25% increase in product quality.</li><li>Piloted user research initiatives, incorporating feedback into product iterations, and achieving a 95% customer satisfaction rate.</li><li>Spearheaded a DevOps transformation project, automating key processes and boosting development efficiency by 50%.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Innovatech Solutions",
      position: "Product Manager",
      startDate: "03/2016",
      endDate: "06/2019",
      description:
        "<ul><li>Managed a portfolio of PaaS solutions, enhancing the scalability of products and attracting a 15% increase in enterprise clientele.</li><li>Drove user engagement by implementing feedback loops, leading to a 12% uplift in active users.</li><li>Optimized resource allocation, resulting in a 35% cost reduction while maintaining product development timelines.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "CloudTech Innovations",
      position: "Associate Product Manager",
      startDate: "09/2013",
      endDate: "02/2016",
      description:
        "<ul><li>Assisted in the development of a cloud-based analytics tool, resulting in a 20% uplift in user productivity.</li><li>Played a key role in the market research that informed product direction, correlating to a 15% rise in competitive positioning.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "University of Edinburgh",
      major: "Master of Science in Product Management",
      score: "",
      startDate: "01/2014",
      endDate: "01/2015",
    },
    {
      isHidden: false,
      order: 2,
      name: "Heriot-Watt University",
      major: "Bachelor of Engineering in Software Engineering",
      score: "",
      startDate: "01/2009",
      endDate: "01/2013",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Product Lifecycle Management",
      description: "",
    },
    {
      isHidden: false,
      order: 2,
      name: "Stakeholder Engagement",
      description: "",
    },
    {
      isHidden: false,
      order: 3,
      name: "Agile & Scrum Methodologies",
      description: "",
    },
    {
      isHidden: false,
      order: 4,
      name: "User Experience Design",
      description: "",
    },
    { isHidden: false, order: 5, name: "Market Research", description: "" },
    { isHidden: false, order: 6, name: "DevOps Practices", description: "" },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "30% Market Penetration Growth",
      date: "Led the development and launch of a cutting-edge SaaS product",
    },
    {
      isHidden: false,
      order: 2,
      title: "40% Reduction in Time-to-Market",
      date: "Pioneered an Agile transformation which significantly decreased product development cycles",
    },
    {
      isHidden: false,
      order: 3,
      title: "95% Customer Satisfaction",
      date: "Utilized customer feedback to iterate on products, achieving a near-perfect satisfaction score",
    },
  ],
  certifications: [],
  interests: {
    isHidden: true,
    description: "",
  },
  projects: [],
  references: [],
  additionalInformation: {
    description: "",
  },
  theme: {
    primaryColor: "#2D3748",
    bgColor: "#FFFFFF",
    textColor: "#4A5568",
  },
};

// Vietnamese dummy data
export const templateProfessional2DummyVi: ResumeData = {
  basicInfo: {
    fullName: "TRẦN MINH TUẤN",
    position: "Quản lý Sản phẩm | Chuyên gia PaaS | Tầm nhìn Chiến lược",
    email: "tuan.tran@example.com",
    phoneNumber: "0987 654 321",
    location: "Quận Cầu Giấy, Hà Nội",
    profilePhoto: "/template_avatar/default1.jpg",
    customFields: [
      {
        type: "LINKEDIN",
        value: "linkedin.com/in/minhtuan",
      },
    ],
  },
  objective: {
    description:
      "<p>Quản lý Sản phẩm giàu kinh nghiệm với thành tích nổi bật trong việc nâng cao trải nghiệm người dùng và tối ưu hóa quy trình phát triển sản phẩm. Đạt được nhiều thành tựu trong việc dẫn dắt chiến lược sản phẩm, với hơn 6 năm kinh nghiệm và đam mê thực hành DevOps.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Công ty TNHH Giải pháp Công nghệ Việt",
      position: "Quản lý Sản phẩm Cao cấp",
      startDate: "07/2019",
      endDate: "Hiện tại",
      description:
        "<ul><li>Điều phối ra mắt sản phẩm SaaS sáng tạo, đạt tăng trưởng 30% thị phần trong 12 tháng.</li><li>Nâng cao chu kỳ phát triển sản phẩm thông qua phương pháp Agile, giảm 40% thời gian ra thị trường.</li><li>Thúc đẩy hợp tác liên phòng ban, tạo nên cách tiếp cận thống nhất trong phát triển sản phẩm và tăng 25% chất lượng sản phẩm.</li><li>Khởi xướng các sáng kiến nghiên cứu người dùng, tích hợp phản hồi vào cải tiến sản phẩm, đạt tỷ lệ hài lòng khách hàng 95%.</li><li>Dẫn đầu dự án chuyển đổi DevOps, tự động hóa các quy trình chính và tăng 50% hiệu suất phát triển.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty CP Phần mềm ABC",
      position: "Quản lý Sản phẩm",
      startDate: "03/2016",
      endDate: "06/2019",
      description:
        "<ul><li>Quản lý danh mục giải pháp PaaS, nâng cao khả năng mở rộng sản phẩm và thu hút tăng 15% khách hàng doanh nghiệp.</li><li>Thúc đẩy tương tác người dùng thông qua triển khai vòng phản hồi, đạt tăng 12% người dùng hoạt động.</li><li>Tối ưu hóa phân bổ nguồn lực, giảm 35% chi phí trong khi duy trì tiến độ phát triển sản phẩm.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Công ty Công nghệ Đám mây XYZ",
      position: "Trợ lý Quản lý Sản phẩm",
      startDate: "09/2013",
      endDate: "02/2016",
      description:
        "<ul><li>Hỗ trợ phát triển công cụ phân tích dựa trên đám mây, tăng 20% năng suất người dùng.</li><li>Đóng vai trò quan trọng trong nghiên cứu thị trường định hướng sản phẩm, góp phần tăng 15% vị thế cạnh tranh.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Đại học Bách Khoa Hà Nội",
      major: "Thạc sĩ Quản trị Công nghệ Thông tin",
      score: "",
      startDate: "2014",
      endDate: "2016",
    },
    {
      isHidden: false,
      order: 2,
      name: "Đại học Công nghệ - ĐHQGHN",
      major: "Kỹ sư Công nghệ Phần mềm",
      score: "",
      startDate: "2009",
      endDate: "2013",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Quản lý Vòng đời Sản phẩm",
      description: "",
    },
    {
      isHidden: false,
      order: 2,
      name: "Giao tiếp với Stakeholder",
      description: "",
    },
    {
      isHidden: false,
      order: 3,
      name: "Phương pháp Agile & Scrum",
      description: "",
    },
    {
      isHidden: false,
      order: 4,
      name: "Thiết kế Trải nghiệm Người dùng",
      description: "",
    },
    {
      isHidden: false,
      order: 5,
      name: "Nghiên cứu Thị trường",
      description: "",
    },
    { isHidden: false, order: 6, name: "Thực hành DevOps", description: "" },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Tăng trưởng 30% Thị phần",
      date: "Dẫn đầu phát triển và ra mắt sản phẩm SaaS tiên tiến",
    },
    {
      isHidden: false,
      order: 2,
      title: "Giảm 40% Thời gian Ra thị trường",
      date: "Tiên phong chuyển đổi Agile giúp rút ngắn đáng kể chu kỳ phát triển sản phẩm",
    },
    {
      isHidden: false,
      order: 3,
      title: "95% Khách hàng Hài lòng",
      date: "Sử dụng phản hồi khách hàng để cải tiến sản phẩm, đạt điểm hài lòng gần hoàn hảo",
    },
  ],
  certifications: [],
  interests: {
    isHidden: true,
    description: "",
  },
  projects: [],
  references: [],
  additionalInformation: {
    description: "",
  },
  theme: {
    primaryColor: "#2D3748",
    bgColor: "#FFFFFF",
    textColor: "#4A5568",
  },
};

// Default export for backward compatibility
export const templateProfessional2Dummy = templateProfessional2DummyEn;
