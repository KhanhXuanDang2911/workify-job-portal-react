export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  timestamp: string;
  status: number;
  path: string;
  error: string;
  message: string;
  errors?: Array<{
    fieldName: string;
    message: string;
  }>;
}

export interface Province {
  id: number;
  name: string;
  engName: string;
  code: string;
}

export interface District {
  id: number;
  name: string;
  engName: string;
  code: string;
  province: Province;
}

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
