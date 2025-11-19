import type { ResumeData } from "@/types/resume.type";

export const templatePandaDummy: ResumeData = {
  basicInfo: {
    fullName: "Văn Hoàng Duy",
    position: "Game Developer",
    email: "duy.nguyen@example.com",
    phone: "0912345678",
    location: "Quận 1, TP.HCM",
    website: "github.com/duynguyen",
    avatarUrl:
      "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    customFields: [
      { type: "GITHUB", value: "github.com/duynguyen" },
      { type: "LINKEDIN", value: "linkedin.com/in/duynguyen" },
    ],
  },
  objective: {
    description:
      "Tôi là Game Developer với hơn 4 năm kinh nghiệm phát triển game trên Unity và Unreal Engine. Tôi đã tham gia nhiều dự án game 2D/3D trên PC và Mobile, tối ưu hóa hiệu năng và tạo trải nghiệm mượt mà cho người chơi. Tôi mong muốn đóng góp kỹ năng lập trình và sáng tạo của mình vào các dự án game chất lượng cao tại công ty của bạn.",
  },
  experience: [
    {
      order: 1,
      company: "Công ty TNHH GameTech Studio",
      position: "Game Developer",
      duration: "03/2021 - 10/2025",
      summary:
        '<ol><li data-list="bullet">Phát triển game 3D trên Unity, tối ưu hóa performance và animation.</li><li data-list="bullet">Tích hợp hệ thống multiplayer cho game mobile và PC.</li><li data-list="bullet">Hợp tác với đội thiết kế và QA để hoàn thiện gameplay, bug fixing và cân bằng game.</li><li data-list="bullet"><strong>Thành tựu:</strong> Game "Battle Arena" đạt 1 triệu lượt tải trên App Store & Google Play, được đánh giá 4.7 sao.</li></ol>',
    },
    {
      order: 2,
      company: "Công ty Cổ phần PixelFun",
      position: "Junior Game Developer",
      duration: "06/2019 - 02/2021",
      summary:
        '<ol><li data-list="bullet">Phát triển game 2D trên Unity, tối ưu UI/UX và cơ chế gameplay.</li><li data-list="bullet">Viết script gameplay, animation và hệ thống AI cơ bản.</li><li data-list="bullet">Hỗ trợ phát triển các công cụ nội bộ để tăng hiệu quả pipeline game.</li></ol>',
    },
  ],
  education: [
    {
      order: 1,
      institution: "Đại học Bách Khoa TP.HCM",
      studyType: "Công nghệ thông tin - Chuyên ngành Game Development",
      dateRange: "2015 - 2019",
      score: "GPA: 3.8/4.0",
    },
  ],
  skills: [
    {
      order: 1,
      name: "Unity 3D / C#",
      description: "Phát triển gameplay, animation, scripting",
    },
    {
      order: 2,
      name: "Unreal Engine / C++",
      description: "Tạo game 3D, tối ưu hiệu năng, vật lý",
    },
    {
      order: 3,
      name: "AI & Game Logic",
      description: "Thiết kế NPC, hệ thống enemy và AI gameplay",
    },
    {
      order: 4,
      name: "Shader & VFX",
      description: "Hiệu ứng hình ảnh và ánh sáng trong game",
    },
    {
      order: 5,
      name: "Git & CI/CD",
      description: "Quản lý version, triển khai build tự động",
    },
  ],
  awards: [
    { order: 1, title: "Game of the Year - Battle Arena", date: "12/2023" },
    { order: 2, title: "Top Indie Game Award", date: "05/2022" },
  ],
  certifications: [
    { order: 1, name: "Unity Certified Programmer", date: "08/2021" },
    { order: 2, name: "Unreal Engine Developer Certificate", date: "11/2020" },
  ],
  projects: [
    {
      order: 1,
      title: "Battle Arena (Mobile & PC)",
      startDate: "01/2023",
      endDate: "12/2023",
      description:
        "Phát triển game hành động 3D multiplayer, tối ưu hóa network và hệ thống server, triển khai trên iOS, Android và PC.",
    },
    {
      order: 2,
      title: "Pixel Adventure (2D Platformer)",
      startDate: "03/2021",
      endDate: "12/2021",
      description:
        "Game 2D platformer cho mobile, thiết kế level, cơ chế gameplay, animation và audio integration.",
    },
  ],
  references: [
    {
      order: 1,
      information: "Trần Văn Hưng - Lead Game Developer tại GameTech Studio",
      description: "Email: hung.tran@gametech.com | Phone: 0909876543",
    },
  ],
  interests:
    "Chơi và phát triển game indie, tham gia hackathon về game, nghiên cứu AI trong gameplay.",
  additionalInformation:
    "Sẵn sàng làm việc remote hoặc onsite, yêu thích thử thách mới trong phát triển game.",
  theme: {
    primaryColor: "#1F2937",
    bgColor: "#F9FAFB",
    textColor: "#111827",
  },
};
