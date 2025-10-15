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


