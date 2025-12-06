import type { ResumeData } from "@/types/resume.type";

export const templateRabbitDummy: ResumeData = {
  basicInfo: {
    fullName: "Lê Quang Dũng",
    position: "Nhân viên Kinh doanh",
    email: "email@example.com",
    phone: "0839848211",
    location: "Quận Từ Liêm, Hà Nội",
    avatarUrl:
      "https://cdnphoto.dantri.com.vn/1w9CPc-X5J2WhlvqQtZQnarq-Og=/thumb_w/1020/2024/10/03/quanghung-12-1727967721737.jpg",
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
