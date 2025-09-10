// Job status types
export const JobStatus = {
  ACTIVE: "active",
  CLOSED: "closed",
  DRAFT: "draft",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

// Application status types
export const ApplicationStatus = {
  PENDING_REVIEW: "pending_review",
  INTERVIEW_SCHEDULED: "interview_scheduled",
  HIRED: "hired",
  REJECTED: "rejected",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

// Time period filters
export const TimePeriod = {
  THIS_WEEK: "this_week",
  THIS_MONTH: "this_month",
  LAST_30_DAYS: "last_30_days",
} as const;

export type TimePeriod = (typeof TimePeriod)[keyof typeof TimePeriod];

// Data for global state store
export const mockStore = {
  user: {
    name: "John Doe",
    company: "Tech Corp",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
};

// Data returned by API queries
export const mockQuery = {
  dashboardMetrics: {
    activeJobs: 12,
    totalApplications: 248,
    interviewsScheduled: 15,
    hiredThisMonth: 8,
  },
  recentJobs: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      status: JobStatus.ACTIVE,
      applicationsCount: 45,
      postedDate: new Date("2024-01-15"),
      location: "Remote",
    },
    {
      id: 2,
      title: "Product Manager",
      status: JobStatus.ACTIVE,
      applicationsCount: 32,
      postedDate: new Date("2024-01-12"),
      location: "San Francisco, CA",
    },
    {
      id: 3,
      title: "UX Designer",
      status: JobStatus.CLOSED,
      applicationsCount: 28,
      postedDate: new Date("2024-01-08"),
      location: "New York, NY",
    },
    {
      id: 4,
      title: "Backend Engineer",
      status: JobStatus.ACTIVE,
      applicationsCount: 52,
      postedDate: new Date("2024-01-10"),
      location: "Austin, TX",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      status: JobStatus.DRAFT,
      applicationsCount: 0,
      postedDate: new Date("2024-01-16"),
      location: "Seattle, WA",
    },
  ],
  recentApplications: [
    {
      id: 1,
      candidateName: "Alice Johnson",
      candidateAvatar: "https://i.pravatar.cc/150?img=1",
      position: "Senior Frontend Developer",
      applicationDate: new Date("2024-01-16"),
      status: ApplicationStatus.PENDING_REVIEW,
    },
    {
      id: 2,
      candidateName: "Bob Smith",
      candidateAvatar: "https://i.pravatar.cc/150?img=2",
      position: "Product Manager",
      applicationDate: new Date("2024-01-15"),
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
    },
    {
      id: 3,
      candidateName: "Carol Davis",
      candidateAvatar: "https://i.pravatar.cc/150?img=3",
      position: "UX Designer",
      applicationDate: new Date("2024-01-14"),
      status: ApplicationStatus.HIRED,
    },
    {
      id: 4,
      candidateName: "David Wilson",
      candidateAvatar: "https://i.pravatar.cc/150?img=4",
      position: "Backend Engineer",
      applicationDate: new Date("2024-01-13"),
      status: ApplicationStatus.PENDING_REVIEW,
    },
    {
      id: 5,
      candidateName: "Emma Brown",
      candidateAvatar: "https://i.pravatar.cc/150?img=6",
      position: "Senior Frontend Developer",
      applicationDate: new Date("2024-01-12"),
      status: ApplicationStatus.REJECTED,
    },
  ],
  analyticsData: {
    applicationTrends: [
      { date: "2024-01-01", applications: 15 },
      { date: "2024-01-02", applications: 22 },
      { date: "2024-01-03", applications: 18 },
      { date: "2024-01-04", applications: 25 },
      { date: "2024-01-05", applications: 30 },
      { date: "2024-01-06", applications: 28 },
      { date: "2024-01-07", applications: 35 },
      { date: "2024-01-08", applications: 32 },
      { date: "2024-01-09", applications: 38 },
      { date: "2024-01-10", applications: 42 },
    ],
    jobPerformance: [
      { jobTitle: "Frontend Developer", applications: 45, views: 320 },
      { jobTitle: "Product Manager", applications: 32, views: 280 },
      { jobTitle: "UX Designer", applications: 28, views: 250 },
      { jobTitle: "Backend Engineer", applications: 52, views: 380 },
      { jobTitle: "DevOps Engineer", applications: 18, views: 150 },
    ],
  },
};

// Data passed as props to the root component
export const mockRootProps = {
  companyName: "Tech Corp",
};
