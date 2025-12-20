import type { ResumeData } from "@/types/resume.type";

export const templateTigerDummyVi: ResumeData = {
  basicInfo: {
    fullName: "Trần Thị Mai",
    position: "Senior Marketing Manager",
    email: "mai.tran.marketing@gmail.com",
    phoneNumber: "0912 345 678",
    location: "Quận 1, TP. Hồ Chí Minh",
    profilePhoto: "/template_avatar/default1.jpg",
    customFields: [
      { type: "LINKEDIN", value: "linkedin.com/in/maitran" },
      { type: "INFO", value: "maitran-portfolio.com" },
    ],
  },
  objective: {
    description:
      "Senior Marketing Manager với hơn 8 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Chuyên gia về chiến lược marketing đa kênh, đã dẫn dắt các chiến dịch đạt ROI trung bình 350%. Có khả năng xây dựng và phát triển team marketing từ 5 lên 25 thành viên.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Tập đoàn Vingroup",
      position: "Senior Marketing Manager",
      startDate: "03/2021",
      endDate: "Hiện tại",
      description:
        "<ul><li>Quản lý đội ngũ Marketing 15 người, phụ trách chiến lược marketing cho 3 thương hiệu con với ngân sách 50 tỷ đồng/năm.</li><li>Xây dựng và triển khai chiến dịch Omnichannel Marketing, tăng brand awareness 45% trong 12 tháng.</li><li>Phối hợp với đội ngũ Sales đạt mục tiêu doanh thu 800 tỷ đồng năm 2023.</li><li>Đưa ra các quyết định dựa trên data analytics, cải thiện conversion rate 60%.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Công ty CP Thế Giới Di Động",
      position: "Marketing Team Lead",
      startDate: "06/2018",
      endDate: "02/2021",
      description:
        "<ul><li>Lead team 8 thành viên phụ trách Digital Marketing và Content Marketing.</li><li>Triển khai chiến dịch Black Friday đạt doanh thu kỷ lục 500 tỷ đồng trong 3 ngày.</li><li>Xây dựng hệ thống Marketing Automation, tiết kiệm 30% chi phí vận hành.</li><li>Phát triển chiến lược SEO/SEM, tăng organic traffic 200% trong 18 tháng.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "Công ty TNHH Shopee Việt Nam",
      position: "Digital Marketing Specialist",
      startDate: "01/2016",
      endDate: "05/2018",
      description:
        "<ul><li>Quản lý campaigns trên Facebook, Google Ads với budget 2 tỷ đồng/tháng.</li><li>Tối ưu hóa landing pages và A/B testing, tăng CTR 35%.</li><li>Phân tích data và đề xuất chiến lược cải thiện performance marketing.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)",
      major: "Marketing",
      startDate: "2012",
      endDate: "2016",
      score: "Xuất sắc (GPA: 3.7/4.0)",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Digital Marketing",
      description: "Facebook Ads, Google Ads, TikTok Ads",
    },
    {
      isHidden: false,
      order: 2,
      name: "Marketing Analytics",
      description: "Google Analytics, Mixpanel, Tableau",
    },
    {
      isHidden: false,
      order: 3,
      name: "Brand Management",
      description: "Brand Strategy, Positioning",
    },
    {
      isHidden: false,
      order: 4,
      name: "Marketing Automation",
      description: "HubSpot, Salesforce Marketing Cloud",
    },
    {
      isHidden: false,
      order: 5,
      name: "Leadership",
      description: "Team building, Coaching, OKRs",
    },
    {
      isHidden: false,
      order: 6,
      name: "Content Strategy",
      description: "SEO, Copywriting, Storytelling",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Best Marketing Campaign Award - Vietnam Marketing Association",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      title: "Top 30 Under 30 - Forbes Vietnam",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      title: "Employee of the Year - Thế Giới Di Động",
      date: "2020",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Google Analytics Professional Certificate",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      name: "Meta Certified Marketing Science Professional",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      name: "HubSpot Inbound Marketing Certification",
      date: "2021",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "Chiến dịch Ra mắt Thương hiệu Mới",
      startDate: "01/2023",
      endDate: "06/2023",
      description:
        "<ul><li>Lead chiến dịch launch thương hiệu mới với ngân sách 20 tỷ đồng</li><li>Đạt 50 triệu impressions và 2 triệu engagements trên social media</li><li>Thương hiệu đạt top 3 brand recall trong ngành sau 6 tháng</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Digital Transformation Project",
      startDate: "06/2022",
      endDate: "12/2022",
      description:
        "<ul><li>Chủ trì dự án chuyển đổi số cho bộ phận Marketing</li><li>Triển khai hệ thống CRM và Marketing Automation mới</li><li>Giảm 40% thời gian xử lý và tăng 25% hiệu quả chiến dịch</li></ul>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Nguyễn Văn Hùng - CMO tại Vingroup",
      description: "Email: hung.nguyen@vingroup.net | Phone: 0909 123 456",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "<ul><li>Đọc sách về Marketing và Business Strategy</li><li>Tham gia các hội thảo Marketing quốc tế</li><li>Mentoring cho các bạn trẻ trong ngành</li></ul>",
  },
  additionalInformation: {
    description:
      "Sẵn sàng đi công tác trong và ngoài nước. Có khả năng làm việc dưới áp lực cao và quản lý nhiều dự án cùng lúc.",
  },
  theme: {
    primaryColor: "#2d5a4a",
    bgColor: "#ffffff",
    textColor: "#333333",
  },
};

export const templateTigerDummyEn: ResumeData = {
  basicInfo: {
    fullName: "Sarah Johnson",
    position: "Senior Marketing Manager",
    email: "sarah.johnson.marketing@gmail.com",
    phoneNumber: "(555) 123-4567",
    location: "New York, NY",
    profilePhoto: "/template_avatar/default1.jpg",
    customFields: [
      { type: "LINKEDIN", value: "linkedin.com/in/sarahjohnson" },
      { type: "INFO", value: "sarahjohnson-portfolio.com" },
    ],
  },
  objective: {
    description:
      "Senior Marketing Manager with over 8 years of experience in Digital Marketing and Brand Management. Expert in multi-channel marketing strategies, having led campaigns with an average ROI of 350%. Capable of building and developing marketing teams from 5 to 25 members.",
  },
  experience: [
    {
      isHidden: false,
      order: 1,
      company: "Fortune 500 Corporation",
      position: "Senior Marketing Manager",
      startDate: "Mar 2021",
      endDate: "Present",
      description:
        "<ul><li>Managed a Marketing team of 15 people, responsible for marketing strategy for 3 sub-brands with a budget of $2M/year.</li><li>Built and implemented Omnichannel Marketing campaigns, increasing brand awareness by 45% in 12 months.</li><li>Collaborated with the Sales team to achieve revenue target of $35M in 2023.</li><li>Made data-driven decisions using analytics, improving conversion rate by 60%.</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      company: "Tech Retail Inc.",
      position: "Marketing Team Lead",
      startDate: "Jun 2018",
      endDate: "Feb 2021",
      description:
        "<ul><li>Led team of 8 members responsible for Digital Marketing and Content Marketing.</li><li>Executed Black Friday campaign achieving record revenue of $22M in 3 days.</li><li>Built Marketing Automation system, saving 30% operational costs.</li><li>Developed SEO/SEM strategy, increasing organic traffic by 200% in 18 months.</li></ul>",
    },
    {
      isHidden: false,
      order: 3,
      company: "E-Commerce Solutions LLC",
      position: "Digital Marketing Specialist",
      startDate: "Jan 2016",
      endDate: "May 2018",
      description:
        "<ul><li>Managed campaigns on Facebook, Google Ads with budget of $100K/month.</li><li>Optimized landing pages and A/B testing, increasing CTR by 35%.</li><li>Analyzed data and proposed strategies to improve performance marketing.</li></ul>",
    },
  ],
  education: [
    {
      isHidden: false,
      order: 1,
      name: "Columbia University",
      major: "Marketing",
      startDate: "2012",
      endDate: "2016",
      score: "Magna Cum Laude (GPA: 3.7/4.0)",
    },
  ],
  skills: [
    {
      isHidden: false,
      order: 1,
      name: "Digital Marketing",
      description: "Facebook Ads, Google Ads, TikTok Ads",
    },
    {
      isHidden: false,
      order: 2,
      name: "Marketing Analytics",
      description: "Google Analytics, Mixpanel, Tableau",
    },
    {
      isHidden: false,
      order: 3,
      name: "Brand Management",
      description: "Brand Strategy, Positioning",
    },
    {
      isHidden: false,
      order: 4,
      name: "Marketing Automation",
      description: "HubSpot, Salesforce Marketing Cloud",
    },
    {
      isHidden: false,
      order: 5,
      name: "Leadership",
      description: "Team building, Coaching, OKRs",
    },
    {
      isHidden: false,
      order: 6,
      name: "Content Strategy",
      description: "SEO, Copywriting, Storytelling",
    },
  ],
  awards: [
    {
      isHidden: false,
      order: 1,
      title: "Best Marketing Campaign Award - American Marketing Association",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      title: "Top 30 Under 30 - Forbes",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      title: "Employee of the Year - Tech Retail Inc.",
      date: "2020",
    },
  ],
  certifications: [
    {
      isHidden: false,
      order: 1,
      name: "Google Analytics Professional Certificate",
      date: "2023",
    },
    {
      isHidden: false,
      order: 2,
      name: "Meta Certified Marketing Science Professional",
      date: "2022",
    },
    {
      isHidden: false,
      order: 3,
      name: "HubSpot Inbound Marketing Certification",
      date: "2021",
    },
  ],
  projects: [
    {
      isHidden: false,
      order: 1,
      title: "New Brand Launch Campaign",
      startDate: "Jan 2023",
      endDate: "Jun 2023",
      description:
        "<ul><li>Led brand launch campaign with $800K budget</li><li>Achieved 50 million impressions and 2 million engagements on social media</li><li>Brand reached top 3 brand recall in industry after 6 months</li></ul>",
    },
    {
      isHidden: false,
      order: 2,
      title: "Digital Transformation Project",
      startDate: "Jun 2022",
      endDate: "Dec 2022",
      description:
        "<ul><li>Led digital transformation project for Marketing department</li><li>Implemented new CRM and Marketing Automation system</li><li>Reduced processing time by 40% and increased campaign efficiency by 25%</li></ul>",
    },
  ],
  references: [
    {
      isHidden: false,
      order: 1,
      information: "Michael Chen - CMO at Fortune 500 Corp",
      description: "Email: michael.chen@fortune500.com | Phone: (555) 987-6543",
    },
  ],
  interests: {
    isHidden: false,
    description:
      "<ul><li>Reading books about Marketing and Business Strategy</li><li>Attending international Marketing conferences</li><li>Mentoring young professionals in the industry</li></ul>",
  },
  additionalInformation: {
    description:
      "Ready to travel domestically and internationally. Capable of working under high pressure and managing multiple projects simultaneously.",
  },
  theme: {
    primaryColor: "#2d5a4a",
    bgColor: "#ffffff",
    textColor: "#333333",
  },
};

export const templateTigerDummy = templateTigerDummyVi;
