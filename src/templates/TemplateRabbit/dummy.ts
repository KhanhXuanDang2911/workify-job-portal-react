import type { ResumeData } from "@/types/resume.type";

// Vietnamese dummy data
export const templateRabbitDummyVi: ResumeData = {
  basicInfo: {
    fullName: "Lê Quang Dũng",
    position: "Nhân viên Kinh doanh",
    email: "email@example.com",
    phoneNumber: "0839848211",
    location: "Quận Từ Liêm, Hà Nội",
    profilePhoto: "/template_avatar/default3.jpg",
    customFields: [
      { type: "FACEBOOK", value: "facebook.com/username" },
      { type: "INSTAGRAM", value: "instagram.com/username" },
    ],
  },
  objective: {
    description:
      "Với hơn 3 năm kinh nghiệm làm việc tại vị trí Nhân viên kinh doanh, tôi có nền tảng vững chắc về quy trình bán hàng, kỹ năng nắm bắt tâm lý khách hàng và kinh nghiệm chốt sales. Tại công ty gần nhất, tôi đã tư vấn và xây dựng mối quan hệ bền vững với hơn 200 khách hàng lớn, đạt danh hiệu Nhân viên kinh doanh xuất sắc năm 2024. Tôi mong muốn có cơ hội làm việc tại Quý công ty để nâng cao kỹ năng chuyên môn đồng thời đóng góp sự phát triển bền vững của công ty trong tương lai.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Công ty cổ phần nội thất HLT",
      position: "Chuyên viên viên kinh doanh",
      startDate: "03/2022",
      endDate: "07/2025",
      description:
        '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Quản lý và phát triển mối quan hệ với hơn 200 khách hàng lớn, gồm các nhóm khách hàng chiến lược trong ngành đồ gia dụng và nội thất, giúp duy trì hợp đồng dài hạn và gia tăng doanh thu. </li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Phối hợp với bộ phận Marketing triển khai các chiến dịch quảng cáo, khuyến mãi và các hoạt động marketing để mở rộng tệp khách hàng tiềm năng và tăng trưởng doanh thu.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Theo dõi tình trạng đơn hàng và hỗ trợ giải đáp thắc mắc của khách hàng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Hỗ trợ giải đáp của khách hàng sau khi mua sản phẩm, giúp nâng cao trải nghiệm sau mua và duy trì mối quan hệ lâu dài với khách hàng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Thành tựu:</strong> Đạt danh hiệu "Nhân viên xuất sắc nhất năm 2024" với doanh số vượt 15% KPI trong Quý I và Quý II.</li></ol>',
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty TNHH TM&DV XNK Hồng Lam",
      position: "Nhân viên kinh doanh",
      startDate: "06/2020",
      endDate: "02/2022",
      description:
        '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tìm kiếm và phát triển mối quan hệ với khách hàng tiềm năng, đồng thời duy trì kết nối với khách hàng cũ, hỗ trợ giải đáp thắc mắc và xử lý các khiếu nại liên quan đến sản phẩm/dịch vụ.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tổng hợp thông tin, đánh giá tình hình kinh doanh của đối thủ, đề xuất phương án triển khai để tăng doanh số bán hàng cho doanh nghiệp.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Gửi mail thông báo chương trình khuyến mãi, hội chợ, trải nghiệm sản phẩm cho khách hàng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tổ chức triển khai sự kiện, chương trình PR sản phẩm của công ty.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Lên dự thảo hợp đồng, báo giá gửi khách hàng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Làm báo cáo tuần/tháng/quý về tiến độ công việc.</li></ol>',
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Trường Đại học Ngoại Thương",
      major: "Quản trị Kinh doanh",
      startDate: "2016",
      endDate: "2020",
      score: "GPA: 3.7/4.0",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Kỹ năng bán hàng",
      description: "Thuyết phục và chốt hợp đồng hiệu quả",
    },
    {
      isHidden: false,
      order: 2,
      name: "Giao tiếp",
      description: "Khả năng giao tiếp với khách hàng và đồng nghiệp tốt",
    },
    {
      isHidden: false,
      order: 3,
      name: "Marketing cơ bản",
      description: "Triển khai các chiến dịch marketing và quảng bá sản phẩm",
    },
    {
      isHidden: false,
      order: 4,
      name: "Phân tích thị trường",
      description: "Đánh giá đối thủ và xu hướng thị trường",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Nhân viên xuất sắc nhất năm 2024",
      date: "12/2024",
    },
    {
      isHidden: false,
      order: 2,
      title: "Giải thưởng bán hàng cao nhất Quý I 2023",
      date: "03/2023",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Chứng chỉ Kinh doanh chuyên nghiệp",
      date: "05/2021",
    },
    {
      isHidden: false,
      order: 2,
      name: "Chứng chỉ Marketing Online",
      date: "08/2022",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Triển khai hệ thống CRM cho khách hàng doanh nghiệp",
      startDate: "01/2023",
      endDate: "06/2023",
      description:
        "Tư vấn, triển khai và đào tạo sử dụng hệ thống quản lý quan hệ khách hàng (CRM) cho các doanh nghiệp khách hàng lớn, giúp tăng hiệu suất quản lý dữ liệu khách hàng và cải thiện doanh số.",
    },
    {
      isHidden: false,
      order: 2,
      title: "Chương trình PR sản phẩm nội thất mới",
      startDate: "09/2022",
      endDate: "12/2022",
      description:
        "Phối hợp Marketing tổ chức các chiến dịch PR và sự kiện offline, tăng nhận diện thương hiệu sản phẩm mới trong thị trường nội thất.",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Nguyễn Văn An - Trưởng phòng Kinh doanh tại HLT",
      description: "Email: an.nguyen@hlt.com | Phone: 0901234567",
    },
    {
      isHidden: false,
      order: 2,
      information: "Trần Thị Bích - Giám đốc bán hàng tại Hồng Lam",
      description: "Email: bich.tran@honglam.vn | Phone: 0912345678",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "Thích đọc sách về kinh doanh và marketing, tham gia các hội thảo về quản trị doanh nghiệp, chơi thể thao như bóng đá và bơi lội.",
  },

  additionalInformation: {
    description:
      "Sẵn sàng đi công tác xa, có khả năng làm việc dưới áp lực cao và thích học hỏi công nghệ mới để áp dụng vào công việc.",
  },

  theme: {
    primaryColor: "#247e7aff",
    bgColor: "#FFFFFF",
    textColor: "#000000",
  },
};

// English dummy data
export const templateRabbitDummyEn: ResumeData = {
  basicInfo: {
    fullName: "Daniel Thompson",
    position: "Sales Representative",
    email: "daniel.thompson@email.com",
    phoneNumber: "(555) 456-7890",
    location: "Boston, MA",
    profilePhoto: "/template_avatar/default3.jpg",
    customFields: [
      { type: "FACEBOOK", value: "facebook.com/danielthompson" },
      { type: "INSTAGRAM", value: "instagram.com/danielthompson" },
    ],
  },
  objective: {
    description:
      "With over 3 years of experience as a Sales Representative, I have a solid foundation in sales processes, customer psychology skills, and deal closing experience. At my recent company, I consulted and built lasting relationships with over 200 major clients, achieving the Outstanding Sales Employee title in 2024. I'm eager to join your company to enhance my professional skills while contributing to sustainable company growth.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Modern Furniture Inc.",
      position: "Senior Sales Executive",
      startDate: "Mar 2022",
      endDate: "Jul 2025",
      description:
        '<ul><li>Managed and developed relationships with over 200 key accounts, including strategic customer groups in home goods and furniture industry, maintaining long-term contracts and increasing revenue.</li><li>Coordinated with Marketing department to implement advertising campaigns, promotions and marketing activities to expand potential customer base and grow revenue.</li><li>Monitored order status and supported customer inquiries.</li><li>Provided after-sales support to enhance customer experience and maintain long-term relationships.</li><li><strong>Achievement:</strong> Received "Outstanding Employee 2024" award with sales exceeding 15% KPI in Q1 and Q2.</li></ul>',
    },
    {
      isHidden: false,
      order: 2,
      company: "Global Trade Services LLC",
      position: "Sales Representative",
      startDate: "Jun 2020",
      endDate: "Feb 2022",
      description:
        "<ul><li>Sourced and developed relationships with potential customers while maintaining connections with existing clients, supporting inquiries and handling product/service complaints.</li><li>Compiled competitor information, assessed business situations, and proposed strategies to increase company sales.</li><li>Sent promotional emails, trade show and product experience notifications to customers.</li><li>Organized events and PR campaigns for company products.</li><li>Drafted contracts and quotes for customers.</li><li>Created weekly/monthly/quarterly progress reports.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Boston University",
      major: "Business Administration",
      startDate: "2016",
      endDate: "2020",
      score: "GPA: 3.7/4.0",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Sales Skills",
      description: "Effective persuasion and deal closing",
    },
    {
      isHidden: false,
      order: 2,
      name: "Communication",
      description: "Strong communication with customers and colleagues",
    },
    {
      isHidden: false,
      order: 3,
      name: "Basic Marketing",
      description: "Implementing marketing campaigns and product promotion",
    },
    {
      isHidden: false,
      order: 4,
      name: "Market Analysis",
      description: "Competitor and market trend evaluation",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Outstanding Employee 2024",
      date: "Dec 2024",
    },
    {
      isHidden: false,
      order: 2,
      title: "Highest Sales Award Q1 2023",
      date: "Mar 2023",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Professional Sales Certificate",
      date: "May 2021",
    },
    {
      isHidden: false,
      order: 2,
      name: "Online Marketing Certificate",
      date: "Aug 2022",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "CRM Implementation for Enterprise Clients",
      startDate: "Jan 2023",
      endDate: "Jun 2023",
      description:
        "Consulted, implemented and trained CRM system usage for major enterprise clients, helping improve customer data management efficiency and sales.",
    },
    {
      isHidden: false,
      order: 2,
      title: "New Furniture Product PR Campaign",
      startDate: "Sep 2022",
      endDate: "Dec 2022",
      description:
        "Collaborated with Marketing to organize PR campaigns and offline events, increasing brand awareness for new products in the furniture market.",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "James Wilson - Sales Director at Modern Furniture",
      description:
        "Email: james.wilson@modernfurniture.com | Phone: (555) 222-3333",
    },
    {
      isHidden: false,
      order: 2,
      information: "Amy Chen - Sales Manager at Global Trade Services",
      description:
        "Email: amy.chen@globaltradeservices.com | Phone: (555) 444-5555",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "Reading business and marketing books, attending business management seminars, playing sports like soccer and swimming.",
  },
  additionalInformation: {
    description:
      "Ready for business travel, capable of working under high pressure and eager to learn new technologies to apply at work.",
  },
  theme: {
    primaryColor: "#247e7aff",
    bgColor: "#FFFFFF",
    textColor: "#000000",
  },
};

// Default export for backward compatibility
export const templateRabbitDummy = templateRabbitDummyVi;
