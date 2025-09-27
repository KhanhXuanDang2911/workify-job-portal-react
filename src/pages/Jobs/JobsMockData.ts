export interface Job {
  id: string;
  title: string;
  status: JobStatus;
  progress: number;
  applications: number;
  views: number;
  displayType: string;
  createdBy: string;
  createdDate: string;
  endDate: string;
  category: string;
  location: string;
}

export type JobStatus = "Draft" | "Pending" | "Active" | "Expired" | "Inactive";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior/Middle Hybrid App Developer (Angular + Capacitor)",
    status: "Draft",
    progress: 100,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 26, 2025",
    endDate: "Nov 26, 2025",
    category: "IT - Software",
    location: "Da Nang",
  },
  {
    id: "2",
    title: "(Untitled) h hhh h i ijjjojjjhj",
    status: "Draft",
    progress: 20,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 11, 2025",
    endDate: "Nov 11, 2025",
    category: "IT - Software",
    location: "Ha Noi",
  },
  {
    id: "3",
    title: "Back",
    status: "Draft",
    progress: 20,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 22, 2025",
    endDate: "Nov 22, 2025",
    category: "Construction",
    location: "Bac Giang",
  },
  {
    id: "4",
    title: "Java Developer",
    status: "Draft",
    progress: 100,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 21, 2025",
    endDate: "Nov 21, 2025",
    category: "IT - Software",
    location: "Da Nang",
  },
  {
    id: "5",
    title: "Back-End Developer (NodeJS)",
    status: "Draft",
    progress: 20,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 21, 2025",
    endDate: "Nov 21, 2025",
    category: "IT - Software",
    location: "Da Nang",
  },
  {
    id: "6",
    title: "Frontend Engineer",
    status: "Draft",
    progress: 20,
    applications: 0,
    views: 0,
    displayType: "Normal",
    createdBy: "Admin",
    createdDate: "Sep 12, 2025",
    endDate: "Nov 12, 2025",
    category: "IT - Software",
    location: "Ha Noi",
  },
];

export const statusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
  { value: "Inactive", label: "Inactive" },
];
