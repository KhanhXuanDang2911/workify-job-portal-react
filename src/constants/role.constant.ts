export const ROLE = {
  ADMIN: "ADMIN",
  JOB_SEEKER: "JOB_SEEKER",
  EMPLOYER: "EMPLOYER",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
