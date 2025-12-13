import type { ResumeData } from "@/types/resume.type";

// Vietnamese dummy data
export const templateEagleDummyVi: ResumeData = {
  basicInfo: {
    fullName: "Nguyễn Khánh Huyền",
    position: "Trưởng nhóm Tester",
    email: "tech.growth@topcv.vn",
    phoneNumber: "0123456789",
    location: "Ba Đình, Hà Nội",
    profilePhoto: "/template_avatar/default2.jpg",
    customFields: [
      { type: "LINKEDIN", value: "linkedin.com/in/khanhhuyen" },
      { type: "GITHUB", value: "github.com/khanhhuyen" },
    ],
  },
  objective: {
    description:
      "Trưởng nhóm Tester với 7 năm kinh nghiệm trong lĩnh vực kiểm thử phần mềm, sở hữu các chứng chỉ quốc tế chuyên sâu về QA. Kỹ năng lãnh đạo tốt, giàu kinh nghiệm trong việc đào tạo, phát triển đội ngũ kiểm thử.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Công ty CP Công nghệ Minwon Việt Nam",
      position: "Tester Leader",
      startDate: "08/2022",
      endDate: "Hiện tại",
      description:
        "<ul><li>Chịu trách nhiệm quản lý nghiệp vụ, công việc của team Tester gồm 8 thành viên.</li><li>Lập kế hoạch, chiến lược test cho team tester và quản lý tiến độ, chất lượng của đội nhóm.</li><li>Thực hiện việc test với các loại sản phẩm khác nhau, áp dụng các kỹ thuật test và phần mềm test khác nhau.</li><li>Tham gia xây dựng tài liệu dự án, viết tài liệu hướng dẫn sử dụng chương trình.</li><li>Tổng hợp kết quả test của cả team, tạo báo cáo phân tích chất lượng cho khách hàng.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty TNHH Phần mềm FPT",
      position: "Senior QA Engineer",
      startDate: "03/2019",
      endDate: "07/2022",
      description:
        "<ul><li>Thực hiện kiểm thử các tính năng mới và regression testing cho các dự án outsource.</li><li>Phối hợp với team developer để fix bug và cải thiện chất lượng sản phẩm.</li><li>Đào tạo và hướng dẫn các tester mới trong team.</li><li>Xây dựng automation test framework sử dụng Selenium và TestNG.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Công ty CP VNG Corporation",
      position: "QA Engineer",
      startDate: "06/2016",
      endDate: "02/2019",
      description:
        "<ul><li>Kiểm thử chức năng, hiệu năng cho các sản phẩm game mobile.</li><li>Viết test cases và thực hiện manual testing.</li><li>Tham gia UAT với khách hàng và stakeholders.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Đại học Bách Khoa Hà Nội",
      major: "Công nghệ thông tin",
      startDate: "2012",
      endDate: "2016",
      score: "Giỏi (GPA: 3.5/4.0)",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Lập kế hoạch kiểm thử",
      description: "Test plan, test strategy",
    },
    {
      isHidden: false,
      order: 2,
      name: "Automation Testing",
      description: "Selenium, Appium, Cypress",
    },
    {
      isHidden: false,
      order: 3,
      name: "Testing Tools",
      description: "JIRA, TestRail, Postman",
    },
    {
      isHidden: false,
      order: 4,
      name: "Performance Testing",
      description: "JMeter, LoadRunner",
    },
    {
      isHidden: false,
      order: 5,
      name: "Agile/Scrum",
      description: "Scrum Master certified",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Best QA Team Leader 2023",
      date: "12/2023",
    },
    {
      isHidden: false,
      order: 2,
      title: "Employee of the Year 2021",
      date: "01/2022",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "ISTQB Foundation Level",
      date: "2020",
    },
    {
      isHidden: false,
      order: 2,
      name: "CAST - Certified Associate in Software Testing",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      name: "AWS Certified Cloud Practitioner",
      date: "2023",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "E-Commerce Platform Testing",
      startDate: "01/2023",
      endDate: "06/2023",
      description:
        "<ul><li>Lead testing team for large-scale e-commerce platform migration</li><li>Implemented automated regression test suite with 500+ test cases</li></ul>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Nguyễn Văn An - CTO tại Minwon Việt Nam",
      description: "Email: an.nguyen@minwon.vn | Phone: 0987654321",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "Đọc sách công nghệ, tham gia các meetup về QA/Testing, chơi cờ vua",
  },
  additionalInformation: {
    description:
      "Sẵn sàng làm việc ngoài giờ, tham gia các dự án on-site và remote. Có đam mê với việc nâng cao chất lượng phần mềm.",
  },
  theme: {
    primaryColor: "#0284c7",
    bgColor: "#ffffff",
    textColor: "#333333",
  },
};

// English dummy data
export const templateEagleDummyEn: ResumeData = {
  basicInfo: {
    fullName: "Jennifer Adams",
    position: "QA Team Lead",
    email: "jennifer.adams@tech.com",
    phoneNumber: "(555) 234-5678",
    location: "San Francisco, CA",
    profilePhoto: "/template_avatar/default2.jpg",
    customFields: [
      { type: "LINKEDIN", value: "linkedin.com/in/jenniferadams" },
      { type: "GITHUB", value: "github.com/jenniferadams" },
    ],
  },
  objective: {
    description:
      "QA Team Lead with 7 years of experience in software testing, holding international QA certifications. Strong leadership skills with extensive experience in training and developing testing teams.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Tech Solutions Inc.",
      position: "Tester Leader",
      startDate: "Aug 2022",
      endDate: "Present",
      description:
        "<ul><li>Responsible for managing operations and work of a QA team of 8 members.</li><li>Develop test plans, strategies and manage team progress and quality.</li><li>Perform testing on various products, applying different testing techniques and tools.</li><li>Participate in project documentation and user manual creation.</li><li>Compile team test results and create quality analysis reports for clients.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Global Software Ltd.",
      position: "Senior QA Engineer",
      startDate: "Mar 2019",
      endDate: "Jul 2022",
      description:
        "<ul><li>Performed new feature testing and regression testing for outsource projects.</li><li>Collaborated with development team to fix bugs and improve product quality.</li><li>Trained and mentored new testers in the team.</li><li>Built automation test framework using Selenium and TestNG.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Gaming Tech Corp.",
      position: "QA Engineer",
      startDate: "Jun 2016",
      endDate: "Feb 2019",
      description:
        "<ul><li>Performed functional and performance testing for mobile game products.</li><li>Wrote test cases and executed manual testing.</li><li>Participated in UAT with clients and stakeholders.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Stanford University",
      major: "Computer Science",
      startDate: "2012",
      endDate: "2016",
      score: "Honors (GPA: 3.5/4.0)",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Test Planning",
      description: "Test plan, test strategy",
    },
    {
      isHidden: false,
      order: 2,
      name: "Automation Testing",
      description: "Selenium, Appium, Cypress",
    },
    {
      isHidden: false,
      order: 3,
      name: "Testing Tools",
      description: "JIRA, TestRail, Postman",
    },
    {
      isHidden: false,
      order: 4,
      name: "Performance Testing",
      description: "JMeter, LoadRunner",
    },
    {
      isHidden: false,
      order: 5,
      name: "Agile/Scrum",
      description: "Scrum Master certified",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Best QA Team Leader 2023",
      date: "Dec 2023",
    },
    {
      isHidden: false,
      order: 2,
      title: "Employee of the Year 2021",
      date: "Jan 2022",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "ISTQB Foundation Level",
      date: "2020",
    },
    {
      isHidden: false,
      order: 2,
      name: "CAST - Certified Associate in Software Testing",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      name: "AWS Certified Cloud Practitioner",
      date: "2023",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "E-Commerce Platform Testing",
      startDate: "Jan 2023",
      endDate: "Jun 2023",
      description:
        "<ul><li>Lead testing team for large-scale e-commerce platform migration</li><li>Implemented automated regression test suite with 500+ test cases</li></ul>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "David Miller - CTO at Tech Solutions Inc.",
      description:
        "Email: david.miller@techsolutions.com | Phone: (555) 876-5432",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "Reading tech books, attending QA/Testing meetups, playing chess",
  },
  additionalInformation: {
    description:
      "Ready for overtime, on-site and remote projects. Passionate about improving software quality.",
  },
  theme: {
    primaryColor: "#0284c7",
    bgColor: "#ffffff",
    textColor: "#333333",
  },
};

// Default export for backward compatibility
export const templateEagleDummy = templateEagleDummyVi;
