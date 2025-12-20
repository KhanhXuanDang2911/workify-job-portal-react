import type { ResumeData } from "@/types/resume.type";

export const templateHavard1DummyEn: ResumeData = {
  basicInfo: {
    fullName: "Daniel Johnson",
    position: "District Manager",
    email: "your.email@here.com",
    phoneNumber: "508-278-2542",
    location: "San Francisco, CA",
    profilePhoto: "",
    customFields: [
      { type: "LINKEDIN", value: "https://linkedin.com/in/danieljohnson" },
      { type: "GITHUB", value: "https://github.com/danieljohnson" },
    ],
  },
  objective: {
    description:
      "<p>Successful sales professional with 10+ years experience in large-scale food and retail environments. Implement cost control measures to ensure operations remain within company targets. Skilled in P&L management, staff development, process optimization and delivering measurable improvements in customer satisfaction and retention.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Verizon Wireless",
      position: "District Manager",
      startDate: "06/2019",
      endDate: "Current",
      description:
        "<ul><li>Directed recruitment/training/staff development initiatives to maximize productivity and revenue potential through development of a sales team.</li><li>Successfully increased employee retention by creating a positive work environment in 18 stores.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Walgreens, Inc",
      position: "Operations Manager",
      startDate: "08/2016",
      endDate: "05/2019",
      description:
        "<ul><li>Oversaw opening/closing operations for a $4 million annual revenue store in compliance with current company policies/procedures.</li><li>Managed operational costs by spearheading inventory control.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Safeway",
      position: "Store Director",
      startDate: "02/2014",
      endDate: "08/2016",
      description:
        "<ul><li>Increased store revenues by cultivating new customers, providing superior service and applying pricing strategies and up-selling techniques.</li></ul>",
    },
    {
      isHidden: false,
      order: 4,
      company: "Regional Retail Group",
      position: "Area Supervisor",
      startDate: "03/2012",
      endDate: "01/2014",
      description:
        "<ul><li>Coached store managers across 10 locations to improve operational KPIs and execute promotional campaigns.</li><li>Reduced shrinkage by 12% through inventory process improvements.</li></ul>",
    },
    {
      isHidden: false,
      order: 5,
      company: "City Foods Co.",
      position: "Assistant Store Manager",
      startDate: "07/2010",
      endDate: "02/2012",
      description:
        "<ul><li>Supported daily store operations, scheduling and vendor coordination.</li><li>Implemented visual merchandising updates that increased impulse sales.</li></ul>",
    },
    {
      isHidden: false,
      order: 6,
      company: "Local Market",
      position: "Sales Associate",
      startDate: "01/2008",
      endDate: "06/2010",
      description:
        "<ul><li>Provided customer service and achieved top sales in assigned department for 6 consecutive quarters.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Verizon Inc.",
      major: "Certified Retail District Manager",
      score: "",
      startDate: "",
      endDate: "2019",
    },
    {
      isHidden: false,
      order: 2,
      name: "San Francisco University",
      major: "Master of Business Administration: Operations Management",
      score: "",
      startDate: "",
      endDate: "2016",
    },
    {
      isHidden: false,
      order: 3,
      name: "State Community College",
      major: "Associate of Science: Business Administration",
      score: "",
      startDate: "2006",
      endDate: "2008",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Executive team leadership",
      description: "",
    },
    {
      isHidden: false,
      order: 2,
      name: "Inventory report generation",
      description: "",
    },
    {
      isHidden: false,
      order: 3,
      name: "Client/Vendor relations",
      description: "",
    },
    { isHidden: false, order: 4, name: "Market Analysis", description: "" },
    {
      isHidden: false,
      order: 5,
      name: "Budgeting and finance",
      description: "",
    },
    { isHidden: false, order: 6, name: "Project management", description: "" },
    { isHidden: false, order: 7, name: "Team liaison", description: "" },
    {
      isHidden: false,
      order: 8,
      name: "Strong verbal communication",
      description: "",
    },
    {
      isHidden: false,
      order: 9,
      name: "Customer experience strategy",
      description: "",
    },
    { isHidden: false, order: 10, name: "Loss prevention", description: "" },
    { isHidden: false, order: 11, name: "Vendor negotiation", description: "" },
    {
      isHidden: false,
      order: 12,
      name: "Data-driven reporting",
      description: "",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Regional Sales Excellence",
      date: "2018",
    },
    {
      isHidden: false,
      order: 2,
      title: "Operational Leadership Award",
      date: "2015",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Certified Retail Manager",
      date: "2019",
    },
    {
      isHidden: false,
      order: 2,
      name: "Lean Six Sigma Yellow Belt",
      date: "2017",
    },
  ],
  interests: {
    isHidden: false,
    description: "<p>Travel, Coaching, Community Volunteering</p>",
  },
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Store Modernization Program",
      startDate: "2018",
      endDate: "2019",
      description:
        "<p>Led a cross-functional team to modernize 12 stores, improving conversion by 9%.</p>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Inventory Optimization Initiative",
      startDate: "2016",
      endDate: "2017",
      description:
        "<p>Implemented inventory forecasting and replenishment strategies that reduced stockouts by 18% and lowered carrying costs.</p>",
    },
    {
      isHidden: false,
      order: 3,
      title: "Customer Retention Campaign",
      startDate: "2014",
      endDate: "2015",
      description:
        "<p>Designed a loyalty program and targeted promotions that increased repeat purchase rate by 12%.</p>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "John Smith - VP Sales, Verizon Wireless",
      description: "(john.smith@verizon.com)",
    },
    {
      isHidden: false,
      order: 2,
      information: "Emily Carter - Regional HR Director, Walgreens",
      description: "(emily.carter@walgreens.com)",
    },
    {
      isHidden: false,
      order: 3,
      information: "Mark Lee - Operations Lead, Safeway",
      description: "(mark.lee@safeway.com)",
    },
  ],
  additionalInformation: { description: "" },
  theme: { primaryColor: "#000000", bgColor: "#FFFFFF", textColor: "#000000" },
};

export const templateHavard1DummyVi: ResumeData = {
  basicInfo: {
    fullName: "Nguyễn Danh",
    position: "Giám đốc Khu vực",
    email: "email.cua.ban@here.com",
    phoneNumber: "(+84) 90 123 4567",
    location: "Hà Nội, Việt Nam",
    profilePhoto: "",
    customFields: [],
  },
  objective: {
    description:
      "<p>Chuyên gia bán hàng với hơn 10 năm kinh nghiệm trong môi trường bán lẻ quy mô lớn. Có năng lực tối ưu quy trình, quản lý P&L và phát triển đội ngũ nhằm tăng trưởng doanh thu và nâng cao trải nghiệm khách hàng.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Công ty Viễn Thông",
      position: "Giám đốc Khu vực",
      startDate: "06/2019",
      endDate: "Hiện tại",
      description:
        "<ul><li>Điều phối tuyển dụng, đào tạo và phát triển nhân sự để tăng doanh thu.</li><li>Tăng tỷ lệ giữ chân nhân viên bằng cách xây dựng môi trường làm việc tích cực cho 18 cửa hàng.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty Bán Lẻ ABC",
      position: "Quản lý vận hành",
      startDate: "08/2016",
      endDate: "05/2019",
      description:
        "<ul><li>Giám sát hoạt động mở/đóng cửa hàng và tối ưu chi phí vận hành.</li><li>Triển khai kiểm soát tồn kho giúp giảm thiểu rủi ro thất thoát.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Siêu thị Safeway",
      position: "Giám đốc cửa hàng",
      startDate: "02/2014",
      endDate: "08/2016",
      description:
        "<ul><li>Tăng doanh thu thông qua chiến lược giá và nâng cao dịch vụ khách hàng.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Đại học Kinh tế Hà Nội",
      major: "Thạc sĩ Quản trị Kinh doanh - Quản lý Vận hành",
      score: "",
      startDate: "2014",
      endDate: "2016",
    },
    {
      isHidden: false,
      order: 2,
      name: "Trường Cao đẳng Cộng đồng",
      major: "Cao đẳng Quản trị Kinh doanh",
      score: "",
      startDate: "2006",
      endDate: "2008",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Lãnh đạo và phát triển đội ngũ",
      description: "",
    },
    {
      isHidden: false,
      order: 2,
      name: "Quản lý tồn kho & kiểm soát chi phí",
      description: "",
    },
    {
      isHidden: false,
      order: 3,
      name: "Kế hoạch kinh doanh và phân tích KPI",
      description: "",
    },
    {
      isHidden: false,
      order: 4,
      name: "Đào tạo & huấn luyện bán hàng",
      description: "",
    },
    {
      isHidden: false,
      order: 5,
      name: "Quản lý dự án cải tiến",
      description: "",
    },
    {
      isHidden: false,
      order: 6,
      name: "Giao tiếp khách hàng chuyên nghiệp",
      description: "",
    },
    {
      isHidden: false,
      order: 7,
      name: "Phân tích dữ liệu bán hàng",
      description: "",
    },
    {
      isHidden: false,
      order: 8,
      name: "Thương thuyết với nhà cung cấp",
      description: "",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Giải thưởng Bán hàng Khu vực",
      date: "2018",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Chứng chỉ Quản lý Bán lẻ",
      date: "2019",
    },
  ],
  interests: {
    isHidden: false,
    description: "<p>Du lịch, Đào tạo, Tình nguyện</p>",
  },
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Chương trình Cải tiến Cửa hàng",
      startDate: "2018",
      endDate: "2019",
      description:
        "<p>Dẫn dắt dự án hiện đại hóa 12 cửa hàng, cải thiện trải nghiệm khách hàng và tăng tỷ lệ chuyển đổi 9%.</p>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Chuỗi Đổi Mới Dịch vụ Khách hàng",
      startDate: "2015",
      endDate: "2016",
      description:
        "<p>Triển khai chương trình đào tạo dịch vụ khách hàng, nâng điểm hài lòng lên 15% trong 12 tháng.</p>",
    },
    {
      isHidden: false,
      order: 3,
      title: "Tối ưu Hệ thống Kiểm kê",
      startDate: "2013",
      endDate: "2014",
      description:
        "<p>Áp dụng phương pháp kiểm kê định kỳ và hệ thống báo cáo giúp giảm sai sót tồn kho 12%.</p>",
    },
    {
      isHidden: false,
      order: 4,
      title: "Dự án Tối ưu Hoạt động Giao nhận",
      startDate: "2011",
      endDate: "2012",
      description:
        "<p>Thiết kế lại luồng giao nhận hàng giúp rút ngắn thời gian xử lý đơn hàng 20%.</p>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Nguyễn Văn A - Phó Giám đốc Bán hàng",
      description: "(nv.a@example.com)",
    },
    {
      isHidden: false,
      order: 2,
      information: "Trần Thị B - Quản lý Nhân sự",
      description: "(ttb@example.com)",
    },
    {
      isHidden: false,
      order: 3,
      information: "Lê Minh C - Trưởng vùng",
      description: "(lmc@example.com)",
    },
  ],
  additionalInformation: { description: "" },
  theme: { primaryColor: "#000000", bgColor: "#FFFFFF", textColor: "#000000" },
};

export const templateHavard1Dummy = templateHavard1DummyVi;
