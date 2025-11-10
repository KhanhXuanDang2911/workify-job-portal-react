export enum ApplicationStatus {
  UNREAD = "UNREAD",
  VIEWED = "VIEWED",
  EMAILED = "EMAILED",
  SCREENING = "SCREENING",
  SCREENING_PENDING = "SCREENING_PENDING",
  INTERVIEW_SCHEDULING = "INTERVIEW_SCHEDULING",
  INTERVIEWED_PENDING = "INTERVIEWED_PENDING",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
}

export interface ApplicationRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  jobId: number;
  cvUrl?: string; // Required for link application
}

export interface ApplicationResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl: string;
  applyCount: number;
  status: ApplicationStatus;
  job: {
    id: number;
    jobTitle: string;
    status: string;
    employer: {
      email: string;
      companyName: string;
      avatarUrl: string | null;
      backgroundUrl: string | null;
      employerSlug: string;
    };
  };
}
