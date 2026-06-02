export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface ApiError {
  detail: string;
  error_code?: string;
  request_id?: string;
}
