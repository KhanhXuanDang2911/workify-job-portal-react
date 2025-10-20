import type { District, Province } from "@/types/location.type";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  birthDate: string | null;
  gender: string | null;
  province: Province | null;
  district: District | null;
  detailAddress: string | null;
  avatarUrl: string | null;
  noPassword: boolean;
  role: string;
  status: string;
}