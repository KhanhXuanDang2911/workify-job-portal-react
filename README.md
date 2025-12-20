# Workify - Next-Gen Recruitment Platform 🚀

![Workify Banner](public/logo.png?height=100)

> **Workify** is a comprehensive, modern job portal application designed to bridge the gap between talent and opportunity. It leverages state-of-the-art web technologies to provide a seamless, real-time, and intelligent recruitment experience for job seekers, employers, and administrators.

---

## 🌟 Key Features

### 👨‍💼 For Job Seekers (Candidates)

- **🤖 AI-Powered Smart Search**: Intelligent job search capability (powered by Gemini AI) that understands natural language queries to find the most relevant opportunities.
- **🔍 Advanced Filtering**: Granular search filters including location, salary range, job type, experience level, and industry.
- **📄 Interactive Resume Builder**:
  - **Drag-and-Drop Interface**: Easily rearrange sections.
  - **Professional Templates**: Choose from vetted designs (Panda, Rabbit, Harvard, etc.).
  - **Rich Text Editing**: detailed descriptions for experience and skills.
  - **PDF Export**: High-quality resume downloads.
- **📊 Application Dashboard**:
  - **Kanban/List Views**: Track application statuses (Applied, Interview, Offer, Rejected).
  - **Saved Jobs**: Bookmark interesting positions for later.
  - **Job Alerts**: Custom notifications for new matches.
- **💬 Real-Time Communication**: Integrated chat system to communicate directly with recruiters via WebSocket.
- **👤 Comprehensive Profile**: Showcase detailed work history, education, skills, and certifications.

### 🏢 For Employers

- **📢 Flexible Job Posting**:
  - Rich text editor for job descriptions.
  - Custom screening questions.
  - Salary range configuration (Public/Private).
- **👥 Candidate Pipeline Management**:
  - Visual recruitment pipeline to move candidates through stages (Screening, Interview, Offer).
  - Collaborative hiring team tools.
  - Scorecards and rating systems for interviewers.
- **🏢 Company Branding**:
  - Customizable career pages with banners, culture videos, and benefits.
  - "Why join us" sections.
- **🔍 Talent Search**: Proactively search for candidates using skills, location, and experience filters.
- **📈 Analytics & Insights**: Dashboard for viewing metrics like Application Conversion Rate, Time to Hire, and Visitor traffic.

### 🛡️ For Administrators

- **👥 User Management**: Full control over candidate and employer accounts (Ban/Unban, Verify).
- **📝 Content Moderation**: Tools to review and approve job postings and community articles.
- **⚙️ System Configuration**: Manage job categories, industries, and skill tags.
- **📊 Platform Health**: Monitoring dashboard for system performance and user engagement stats.

---

## 💻 Technology Stack

### Frontend Core

- ![React](https://img.shields.io/badge/React_19-20232a?style=flat&logo=react&logoColor=61DAFB) **React 19**: The latest version of the library for building robust user interfaces.
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**: For type-safe code and better developer experience.
- ![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white) **Vite 7**: Ultra-fast build tool and development server.

### Styling & UI Components

- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS 4**: A utility-first CSS framework for rapid UI development.
- ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white) **Radix UI**: Unstyled, accessible components for building high-quality design systems.
- **Lucide React**: Beautiful & consistent icons.
- **GSAP**: Professional-grade animations for a polished feel.

### State Management & Data Fetching

- **TanStack Query (React Query)**: Powerful asynchronous state management, caching, and data synchronization.
- **Context API**: For global UI state (Auth, Theme).

### Forms & Validation

- **React Hook Form**: Performant, flexible, and extensible forms.
- **Zod**: TypeScript-first schema declaration and validation.

### Real-Time & Utilities

- **WebSocket (SockJS + STOMP)**: Real-time bi-directional communication for chat and notifications.
- **Tiptap / React Quill**: Rich text editing for job descriptions and resumes.
- **React Leaflet**: Interactive maps for location services.
- **html-to-image / jsPDF**: Client-side PDF generation for resumes.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/KhanhXuanDang2911/workify-job-portal-react.git
    cd workify-job-portal-react
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory based on `.env.example`.

    ```env
    VITE_API_URL=http://localhost:8080/api/v1
    VITE_WEBSOCKET_URL=http://localhost:8080/ws
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://localhost:5173`.

---

## 📂 Project Structure

A high-level overview of the codebase organization:

```text
src/
├── assets/          # Static assets (images, fonts, global styles)
├── components/      # Shared components (Buttons, Inputs, Modals, etc.)
├── context/         # React Contexts (UserAuth, EmployerAuth, Resume, WebSocket)
├── hooks/           # Custom React Hooks (useTranslation, useDebounce)
├── layouts/         # Layout wrappers (MainLayout, EmployerLayout, AdminLayout)
├── lib/             # Third-party library configurations (axios, utils)
├── pages/           # Page components organized by feature
│   ├── Admin/       # Administration views
│   ├── Employer/    # Employer dashboard and management
│   └── User/        # Candidate facing pages (Home, JobSearch, Profile)
├── routes/          # Router configuration and Route Guards
├── services/        # API service layers
├── templates/       # Resume template definitions
├── types/           # TypeScript interfaces and types
└── utils/           # Helper functions and formatters
```

---

## 🤝 Contribution

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

1.  Fork the repository.
2.  Create your feature branch: `git checkout -b feature/NewFeature`
3.  Commit your changes: `git commit -m 'Add NewFeature'`
4.  Push to the branch: `git push origin feature/NewFeature`
5.  Submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the Workify Team
</p>
