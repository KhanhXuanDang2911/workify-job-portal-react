export interface TalentFilters {
  jobPosting?: { id: string; name: string };
  jobCategories: { id: string; name: string }[];
  experienceLevel: { id: string; name: string }[];
  careerLevel: { id: string; name: string }[];
  salary: { min: number; max: number; includeNoSalaryData: boolean };
  positionType: { id: string; name: string }[];
  educationLevel: {
    id: string;
    name: string;
    includeHigherDegrees: boolean;
  };
  school?: string;
  major?: string;
  languageLevel?: string;
  gender?: string;
  maritalStatus?: string;
  ageRange: [number, number];
  resumePostedWithin?: string;
}
