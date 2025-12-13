import type { ResumeData } from "@/types/resume.type";

// English dummy data
export const templateProfessional1DummyEn: ResumeData = {
  basicInfo: {
    fullName: "Samantha Williams",
    position: "Senior Sales Associate",
    email: "samantha.williams@example.com",
    phoneNumber: "(555) 789-1234",
    location: "New York, NY, 10001",
    profilePhoto: "/template_avatar/default2.jpg",
    customFields: [
      {
        type: "LINKEDIN",
        value: "linkedin.com/in/samanthawilliams",
      },
    ],
  },
  objective: {
    description:
      "<p>Senior Analyst with 5+ years of experience in data analysis, business intelligence, and process optimization. Skilled in driving operational efficiency, forecasting, and leading data-driven strategies to support business decisions and improvements. Strong communicator focused on results.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Loom & Lantern Co.",
      position: "Senior Analyst",
      startDate: "Jul 2021",
      endDate: "Current",
      description:
        "<ul><li>Spearhead data analysis and reporting for key business functions, identifying trends and providing insights to improve company performance and profitability.</li><li>Conduct in-depth market analysis and competitive benchmarking to inform strategic decisions, resulting in a 15% increase in market share within one year.</li><li>Develop predictive models to forecast sales performance and customer behavior, contributing to more accurate budgeting and resource allocation.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Willow & Wren Ltd.",
      position: "Business Analyst",
      startDate: "Aug 2017",
      endDate: "May 2021",
      description:
        "<ul><li>Analyzed and interpreted large datasets to identify business opportunities and recommend process improvements, leading to a 20% reduction in operational costs.</li><li>Created detailed financial models and dashboards to track key performance indicators (KPIs), enabling data-driven decision-making across departments.</li><li>Worked closely with project managers to monitor progress on major initiatives, ensuring projects were delivered on time and within budget.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "DataTech Solutions",
      position: "Junior Data Analyst",
      startDate: "Jun 2015",
      endDate: "Jul 2017",
      description:
        "<ul><li>Assisted senior analysts in collecting, cleaning, and organizing large datasets for analysis and reporting purposes.</li><li>Created weekly and monthly reports using Excel and SQL, providing insights to management on key business metrics.</li><li>Participated in cross-functional team meetings to understand business requirements and translate them into analytical solutions.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "New York University",
      major: "Bachelor of Science: Economics",
      score: "",
      startDate: "2013",
      endDate: "2017",
    },
  ],
  skills: [
    { isHidden: false, order: 1, name: "Project Management", description: "" },
    {
      isHidden: false,
      order: 2,
      name: "Data-driven Decision Making",
      description: "",
    },
    { isHidden: false, order: 3, name: "SQL & Excel", description: "" },
    { isHidden: false, order: 4, name: "Financial Analysis", description: "" },
    {
      isHidden: false,
      order: 5,
      name: "Business Intelligence tools",
      description: "",
    },
    {
      isHidden: false,
      order: 6,
      name: "Statistical Modeling",
      description: "",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Top Sales Performer Q4 2022",
      date: "Dec 2022",
    },
    {
      isHidden: false,
      order: 2,
      title: "Employee of the Year",
      date: "2021",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Google Data Analytics Certificate",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      name: "Tableau Desktop Specialist",
      date: "2022",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "<p>Data visualization, Machine learning, Hiking, Photography</p>",
  },
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Sales Dashboard Automation",
      startDate: "Jan 2023",
      endDate: "Mar 2023",
      description:
        "<p>Built an automated sales reporting dashboard using Tableau and Python, reducing manual reporting time by 80%.</p>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Customer Churn Prediction Model",
      startDate: "Jun 2022",
      endDate: "Aug 2022",
      description:
        "<p>Developed a machine learning model to predict customer churn with 85% accuracy, enabling proactive retention strategies.</p>",
    },
    {
      isHidden: false,
      order: 3,
      title: "Inventory Optimization System",
      startDate: "Sep 2021",
      endDate: "Dec 2021",
      description:
        "<p>Designed and implemented an inventory management optimization system that reduced stockouts by 40% and decreased holding costs by 25%.</p>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "John Smith - Director at Loom & Lantern Co.",
      description: "john.smith@loomlantern.com | (555) 123-4567",
    },
    {
      isHidden: false,
      order: 2,
      information: "Emily Johnson - VP of Analytics at Willow & Wren",
      description: "emily.j@willowwren.com | (555) 987-6543",
    },
  ],
  additionalInformation: {
    description: "",
  },
  theme: {
    primaryColor: "#4A6FA5",
    bgColor: "#FFFFFF",
    textColor: "#333333",
  },
};

// Vietnamese dummy data
export const templateProfessional1DummyVi: ResumeData = {
  basicInfo: {
    fullName: "Nguyễn Thị Hương",
    position: "Chuyên viên Phân tích Kinh doanh",
    email: "huong.nguyen@example.com",
    phoneNumber: "0912 345 678",
    location: "Quận 1, TP. Hồ Chí Minh",
    profilePhoto: "/template_avatar/default2.jpg",
    customFields: [
      {
        type: "LINKEDIN",
        value: "linkedin.com/in/huongnguyen",
      },
    ],
  },
  objective: {
    description:
      "<p>Chuyên viên phân tích với hơn 5 năm kinh nghiệm trong phân tích dữ liệu, business intelligence và tối ưu hóa quy trình. Thành thạo trong việc nâng cao hiệu quả vận hành, dự báo và dẫn dắt các chiến lược dựa trên dữ liệu để hỗ trợ quyết định kinh doanh. Khả năng giao tiếp tốt và tập trung vào kết quả.</p>",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Công ty TNHH Công nghệ ABC",
      position: "Chuyên viên Phân tích Cao cấp",
      startDate: "07/2021",
      endDate: "Hiện tại",
      description:
        "<ul><li>Dẫn đầu công tác phân tích dữ liệu và báo cáo cho các chức năng kinh doanh chính, xác định xu hướng và cung cấp insights để cải thiện hiệu suất và lợi nhuận công ty.</li><li>Thực hiện phân tích thị trường chuyên sâu và đánh giá cạnh tranh để hỗ trợ quyết định chiến lược, đạt được tăng trưởng 15% thị phần trong một năm.</li><li>Phát triển các mô hình dự đoán để dự báo hiệu suất bán hàng và hành vi khách hàng, góp phần lập ngân sách và phân bổ nguồn lực chính xác hơn.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty CP Thương mại XYZ",
      position: "Chuyên viên Phân tích Kinh doanh",
      startDate: "08/2017",
      endDate: "05/2021",
      description:
        "<ul><li>Phân tích và giải thích các bộ dữ liệu lớn để xác định cơ hội kinh doanh và đề xuất cải tiến quy trình, giảm 20% chi phí vận hành.</li><li>Xây dựng các mô hình tài chính và dashboard chi tiết để theo dõi các chỉ số hiệu suất chính (KPI), hỗ trợ ra quyết định dựa trên dữ liệu.</li><li>Phối hợp chặt chẽ với các quản lý dự án để giám sát tiến độ các dự án lớn, đảm bảo hoàn thành đúng hạn và trong ngân sách.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Công ty TNHH Giải pháp Dữ liệu",
      position: "Thực tập sinh Phân tích Dữ liệu",
      startDate: "06/2015",
      endDate: "07/2017",
      description:
        "<ul><li>Hỗ trợ các chuyên viên cao cấp trong việc thu thập, làm sạch và tổ chức các bộ dữ liệu lớn phục vụ phân tích và báo cáo.</li><li>Xây dựng báo cáo hàng tuần và hàng tháng sử dụng Excel và SQL, cung cấp insights cho ban lãnh đạo về các chỉ số kinh doanh chính.</li><li>Tham gia các cuộc họp liên phòng ban để hiểu yêu cầu kinh doanh và chuyển đổi thành giải pháp phân tích.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Đại học Kinh tế TP.HCM",
      major: "Cử nhân Kinh tế - Chuyên ngành Tài chính",
      score: "GPA: 3.6/4.0",
      startDate: "2013",
      endDate: "2017",
    },
  ],
  skills: [
    { isHidden: false, order: 1, name: "Quản lý Dự án", description: "" },
    {
      isHidden: false,
      order: 2,
      name: "Ra quyết định dựa trên Dữ liệu",
      description: "",
    },
    {
      isHidden: false,
      order: 3,
      name: "SQL & Excel nâng cao",
      description: "",
    },
    { isHidden: false, order: 4, name: "Phân tích Tài chính", description: "" },
    {
      isHidden: false,
      order: 5,
      name: "Công cụ Business Intelligence",
      description: "",
    },
    { isHidden: false, order: 6, name: "Mô hình Thống kê", description: "" },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Nhân viên xuất sắc Q4/2022",
      date: "12/2022",
    },
    { isHidden: false, order: 2, title: "Nhân viên của Năm", date: "2021" },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Chứng chỉ Google Data Analytics",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      name: "Tableau Desktop Specialist",
      date: "2022",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "<p>Trực quan hóa dữ liệu, Machine Learning, Leo núi, Nhiếp ảnh</p>",
  },
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Tự động hóa Dashboard Bán hàng",
      startDate: "01/2023",
      endDate: "03/2023",
      description:
        "<p>Xây dựng dashboard báo cáo bán hàng tự động sử dụng Tableau và Python, giảm 80% thời gian báo cáo thủ công.</p>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Mô hình Dự đoán Khách hàng Rời bỏ",
      startDate: "06/2022",
      endDate: "08/2022",
      description:
        "<p>Phát triển mô hình machine learning dự đoán khách hàng rời bỏ với độ chính xác 85%, hỗ trợ chiến lược giữ chân khách hàng chủ động.</p>",
    },
    {
      isHidden: false,
      order: 3,
      title: "Hệ thống Tối ưu hóa Kho hàng",
      startDate: "09/2021",
      endDate: "12/2021",
      description:
        "<p>Thiết kế và triển khai hệ thống tối ưu hóa quản lý kho hàng, giảm 40% tình trạng hết hàng và giảm 25% chi phí lưu kho.</p>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Trần Văn Minh - Giám đốc Công ty ABC",
      description: "minh.tran@abc.com | 0908 123 456",
    },
    {
      isHidden: false,
      order: 2,
      information: "Lê Thị Hoa - Trưởng phòng Phân tích tại XYZ",
      description: "hoa.le@xyz.com | 0909 876 543",
    },
  ],
  additionalInformation: { description: "" },
  theme: {
    primaryColor: "#4A6FA5",
    bgColor: "#FFFFFF",
    textColor: "#333333",
  },
};

// Default export for backward compatibility
export const templateProfessional1Dummy = templateProfessional1DummyEn;
