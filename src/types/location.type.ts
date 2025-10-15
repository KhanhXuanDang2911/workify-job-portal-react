export interface Province {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  code: string;
  name: string;
  engName: string;
  provinceSlug?: string;
}

export interface District {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  code: string;
  name: string;
  districtSlug?: string;
}
