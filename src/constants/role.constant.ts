export const ROLE = {
  ADMIN: "ADMIN",
  JOB_SEEKER: "JOB_SEEKER",
  EMPLOYER: "EMPLOYER",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const RoleLabelEN: Record<Role, string> = {
  [ROLE.ADMIN]: "Admin",
  [ROLE.JOB_SEEKER]: "Job Seeker",
  [ROLE.EMPLOYER]: "Employer",
};

export const RoleColors: Record<Role, string> = {
  [ROLE.ADMIN]: "border-red-500 text-red-500",
  [ROLE.JOB_SEEKER]: "border-teal-500 text-teal-500",
  [ROLE.EMPLOYER]: "border-orange-500 text-orange-500",
};
