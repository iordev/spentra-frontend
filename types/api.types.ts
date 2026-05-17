// types/api.types.ts

export type ApiMeta = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
};

export type ApiLinks = {
  first: string | null;
  prev: string | null;
  next: string | null;
  last: string | null;
};

// For paginated list responses (getAll, search, etc.)
export type PaginatedResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: ApiMeta;
  links: ApiLinks;
  timestamp: string;
};

// For single-item responses (create, update, me, etc.)
export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};
